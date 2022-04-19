from django.core.management.base import BaseCommand
from django.db import transaction
from gensim import models as gm
from api.models import TopicModel, Topic, TopicSimilarity, Comparison, TopicStatistics
import os
import numpy as np
import json


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        subparsers = parser.add_subparsers(dest='command')

        register_parser = subparsers.add_parser('set', description='Register model topic statistics')
        register_parser.add_argument('path_to_statistics_json', help='Path to JSON file containing statistics')
        register_parser.add_argument('models_names', help='Name of the models to add information about', nargs='+')
        register_parser.add_argument('-a', '--aliases', nargs='+', help='Mappings of model names found in JSON fields, '
                                                                        'to model names in the database')

        info_parser = subparsers.add_parser('info', description='See information regarding the currently stored topic'
                                                                'statistics')

        drop_parser = subparsers.add_parser('unset', description='Drop topic statistics for specific model')
        drop_parser.add_argument(
            'name',
            help='Name of the model',
        )

        clear_parser = subparsers.add_parser('clear', description='Clear all topic statistics, for all models')

    def handle(self, *args, **options):
        if options['command'] == 'set':
            self.set(**options)
        elif options['command'] == 'list':
            self.list()
        elif options['command'] == 'unset':
            self.drop(**options)
        elif options['command'] == 'clear':
            self.clear()

    def set(self, **kwargs):
        models = {model_name: TopicModel.objects.get(name=model_name) for model_name in kwargs['models_names']}
        db_models = dict()
        for alias_str in kwargs['aliases']:
            doc_model_name, db_model_name = alias_str.split('=')
            if db_model_name in models:
                db_models[doc_model_name] = db_model_name

        input_dict = None
        with open(kwargs['path_to_statistics_json'], 'r', encoding='utf-8') as fin:
            input_dict = json.load(fin)

        with transaction.atomic():
            topic_statistics_objects = list()
            number_of_topics = 0
            number_of_models = 0
            number_of_existing_topics = 0
            for doc_model_name in input_dict:
                if doc_model_name in db_models:
                    number_of_models += 1
                    for topic_str in input_dict[doc_model_name]:
                        topic = int(topic_str)
                        topic_obj = Topic.objects.get(topic_model=models[db_models[doc_model_name]], index=topic)
                        try:
                            topic_stats_obj = TopicStatistics.objects.get(topic=topic_obj)
                            topic_stats_obj.number_of_relevant_texts = input_dict[doc_model_name][topic_str][
                                'documents_clustered']
                            topic_stats_obj.relevant_texts_avg_pagerank_score = input_dict[doc_model_name][topic_str][
                                                                                    'total_score'] / \
                                                                                input_dict[doc_model_name][topic_str][
                                                                                    'documents_scored']
                            topic_stats_obj.save()
                            number_of_existing_topics += 1
                        except TopicStatistics.DoesNotExist:
                            topic_statistics_objects.append(TopicStatistics(
                                topic=topic_obj,
                                number_of_relevant_texts=input_dict[doc_model_name][topic_str]['documents_clustered'],
                                relevant_texts_avg_pagerank_score=input_dict[doc_model_name][topic_str]['total_score'] /
                                                                  input_dict[doc_model_name][topic_str][
                                                                      'documents_scored']
                            ))
                            number_of_topics += 1
                        print(
                            f'\r{number_of_topics + number_of_existing_topics} topic statistics processed '
                            f'for {number_of_models} models', end=''
                        )
            print(
                f'\r{number_of_topics + number_of_existing_topics} topic statistics processed '
                f'for {number_of_models} models', end=''
            )
            TopicStatistics.objects.bulk_create(topic_statistics_objects)
            print()
            print('Complete!')

    def list(self):
        pass

    def drop(self, **kwargs):
        name = kwargs['name']
        model = TopicModel.objects.get(name=name)
        with transaction.atomic():
            TopicStatistics.objects.filter(topic__topic_model=model).delete()

    def clear(self):
        with transaction.atomic():
            TopicStatistics.objects.all().delete()
