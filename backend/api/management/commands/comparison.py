from django.core.management.base import BaseCommand
from django.db import transaction
from gensim import models as gm
from api.models import TopicModel, Topic, TopicSimilarity, Comparison
import os
import numpy as np


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        subparsers = parser.add_subparsers(dest='command')

        register_parser = subparsers.add_parser('register', description='Register cross-model similarities')
        register_parser.add_argument('path_to_npy', help='Path to similarity matrix')
        register_parser.add_argument('old_model_name', help='Name of the older model')
        register_parser.add_argument('new_model_name', help='Name of the newer model')
        register_parser.add_argument('-n', '--name', help='A unique slug name for the LDA model to be registered. Use '
                                                          '"list" subcommand to determine existing models.')

        list_parser = subparsers.add_parser('list', description='List cross-model similarities')

        drop_parser = subparsers.add_parser('drop', description='Drop cross-model similarities')
        drop_parser.add_argument(
            'name',
            help='Unique names of the models. Use "list" subcommand to determine existing models.'
        )

    def handle(self, *args, **options):
        if options['command'] == 'register':
            self.register(**options)
        elif options['command'] == 'list':
            self.list()
        elif options['command'] == 'drop':
            self.drop(**options)

    def register(self, **kwargs):
        print(kwargs)
        similarity_matrix = np.load(kwargs['path_to_npy'])

        model0 = TopicModel.objects.get(name=kwargs['old_model_name'])
        model1 = TopicModel.objects.get(name=kwargs['new_model_name'])

        similarity_name = kwargs['old_model_name'] + '_' + kwargs['new_model_name']

        with transaction.atomic():
            print('Registering comparison')
            comparison = Comparison(name=similarity_name, model0=model0, model1=model1)
            comparison.save()
            print('Registered comparison')

            with transaction.atomic():
                topic_similarities = list()
                newer_topics = dict()
                for i in range(similarity_matrix.shape[0]):
                    older_topic = Topic.objects.get(index=i, topic_model=model0)
                    for j in range(similarity_matrix.shape[1]):
                        if j not in newer_topics:
                            newer_topics[j] = Topic.objects.get(index=j, topic_model=model1)
                        topic_similarities.append(
                            TopicSimilarity(
                                comparison=comparison,
                                topic0=older_topic,
                                topic1=newer_topics[j],
                                similarity=similarity_matrix[i, j]
                            )
                        )
                        if len(topic_similarities) % 50 == 0:
                            print('\r- Created {} topic similarities'.format(len(topic_similarities)), end='')
                print()
                TopicSimilarity.objects.bulk_create(topic_similarities)
                print('- Registered {} topic similarities'.format(len(topic_similarities)))
        print('Complete!')

    def list(self):
        for comparison in Comparison.objects.all():
            print(comparison.name)

    def drop(self, **kwargs):
        name = kwargs['name']
        comparison = Comparison.objects.get(name=name)
        comparison.delete()
