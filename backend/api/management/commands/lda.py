from django.core.management.base import BaseCommand
from django.db import transaction
from django.db.models import Q
from gensim import models as gm
from api import models
import os


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def add_arguments(self, parser):
        subparsers = parser.add_subparsers(dest='command')

        register_parser = subparsers.add_parser('register', description='Register data from an LDA model file.')
        register_parser.add_argument('path_to_model', help='Path to the LDA model file.')
        register_parser.add_argument('title', help='A human readable name for the model.')
        register_parser.add_argument('starting_year', type=int, help='Starting time period of generation of model\'s '
                                                                     'training texts.')
        register_parser.add_argument('-n', '--name', help='A unique slug name for the LDA model to be registered. Use '
                                                          '"list" subcommand to determine existing models.')
        register_parser.add_argument('-d', '--description', help='Description about the stored model.')

        list_parser = subparsers.add_parser('list', description='List registered LDA models.')

        remove_parser = subparsers.add_parser('remove', description='Remove data for one or more LDA models.')
        remove_parser.add_argument('name', nargs='+', help='Unique names of the models. Use "list" subcommand to '
                                                           'determine existing models.')

    def handle(self, *args, **options):
        if options['command'] == 'register':
            self.register(**options)
        elif options['command'] == 'list':
            self.list()
        elif options['command'] == 'remove':
            self.remove(**options)

    def register(self, **kwargs):
        path_to_model = os.path.abspath(os.path.expanduser(os.path.expandvars(kwargs['path_to_model'])))
        lda_model = gm.LdaModel.load(path_to_model)

        title = kwargs['title']
        year = int(kwargs['starting_year'])
        name = kwargs['name']
        description = kwargs['description'] or ''

        with transaction.atomic():
            model = models.TopicModel(title=title, start_year=year, name=name, description=description)
            print('Creating model object')
            model.save()
            print('- Created model object (1/1)')
            with transaction.atomic():
                topics = [models.Topic(topic_model=model, index=i) for i in range(lda_model.num_topics)]
                print('Creating topics')
                models.Topic.objects.bulk_create(topics)
                print('- Created topics ({}/{})'.format(len(topics), len(topics)))
                with transaction.atomic():
                    referenced_terms = dict()
                    topic_term_mappings = list()
                    print('Creating terms')
                    terms_created = 0
                    for i in range(lda_model.num_topics):
                        top_term_probabilities = lda_model.show_topic(i, topn=50)
                        for j in range(len(top_term_probabilities)):
                            ttp = top_term_probabilities[j]
                            if ttp[0] not in referenced_terms:
                                referenced_terms[ttp[0]] = models.Term.objects.get_or_create(string=ttp[0])[0]
                                terms_created += 1
                                if terms_created % 50 == 0:
                                    print('\r- Created or linked {} terms'.format(terms_created), end='')
                        topic_term_mappings = topic_term_mappings + [
                            [i, top_term_probabilities[j][0], top_term_probabilities[j][1], j + 1]
                            for j in range(len(top_term_probabilities))
                        ]
                    print('\r- Created or linked {} terms'.format(terms_created), end='')
                    print()
                    with transaction.atomic():
                        print('Creating term assignments')
                        topic_term_assignments = []
                        i = 0
                        for mapping in topic_term_mappings:
                            topic_term_assignments.append(models.TopicTermAssignment(
                                topic=topics[mapping[0]],
                                term=referenced_terms[mapping[1]],
                                probability=mapping[2],
                                rank=mapping[3]
                            ))
                            i += 1
                            print('\r- Created {}/{} topic term assignments'.format(i, len(topic_term_mappings)),
                                  end='')
                        print()
                        models.TopicTermAssignment.objects.bulk_create(topic_term_assignments)
        print('Complete!')

    def list(self):
        for topic_model in models.TopicModel.objects.all().values('name'):
            print(topic_model['name'])

    def remove(self, **kwargs):
        names = kwargs['name']
        target_model = models.TopicModel.objects.filter(name__in=names)
        target_model.delete()
        models.Term.objects.filter(topic__isnull=True).delete()
