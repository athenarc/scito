from django.db import models
from django.core import validators
from django.utils.text import slugify


class TopicModel(models.Model):
    title = models.CharField(
        max_length=64,
        help_text='A human readable title of the model which will be used to present the model in the interface.'
    )
    start_year = models.PositiveSmallIntegerField(
        help_text='Starting time period of generation of training texts',
    )
    name = models.SlugField(
        max_length=64,
        unique=True,
        blank=True,
        help_text='A unique slug functioning as an identifier which allows reference to a particular model. If '
                  'omitted, it will be inferred by the provided title'
    )
    description = models.TextField(
        blank=True,
        null=True,
        help_text='An optional field which allows the attachment of a text providing more information regarding the '
                  'model.'
    )

    def save(self, *args, **kwargs):
        if not self.name:
            self.name = slugify(self.title)
        super(TopicModel, self).save(*args, **kwargs)

    def __str__(self):
        return f'{self.title}[{self.start_year}]'

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(name__isnull=False),
                name='model_name_defined_constraint'
            ),
        ]


class Term(models.Model):
    string = models.CharField(max_length=128, help_text='A term of a model\'s dictionary', unique=True)

    def __str__(self):
        return self.string


class Topic(models.Model):
    topic_model = models.ForeignKey(
        TopicModel,
        on_delete=models.CASCADE,
        help_text='The topic model which the topic corresponds to.'
    )
    index = models.PositiveSmallIntegerField(
        help_text='Numerical index of the topic, under the corresponding model.'
    )
    title = models.CharField(
        blank=True,
        null=True,
        max_length=64,
        help_text='A textual representation of the topic\'s semantics'
    )
    terms = models.ManyToManyField(Term, through='TopicTermAssignment', blank=True)

    def __str__(self):
        return f'Topic {(self.title or self.index)} of model "{self.topic_model}"'

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['topic_model', 'index'], name='unique_model_topic_index_constraint'),
            models.UniqueConstraint(fields=['topic_model', 'title'], name='unique_model_topic_title_constraint')
        ]
        indexes = [
            models.Index(fields=['topic_model', 'index'], name='topic_idx_index')
        ]


class TopicTermAssignment(models.Model):
    topic = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        help_text='A topic in which the corresponding term has a probability of occurrence'
    )
    term = models.ForeignKey(
        Term,
        on_delete=models.CASCADE,
        help_text='A term with a probability of occurrence'
    )
    probability = models.FloatField(
        help_text='Probability of occurrence',
        validators=[
            validators.MinValueValidator(0, message='Probability value must be between 0 and 1, inclusive'),
            validators.MaxValueValidator(1, message='Probability value must be between 0 and 1, inclusive')
        ]
    )
    rank = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        help_text='A precomputed ranking which can be used in order quickly retrieve order-based instances while '
                  'omitting the ordering phase'
    )

    class Meta:
        constraints = [
            # Value field should hold probabilities, thus the value should be between 0 and 1, inclusive
            models.CheckConstraint(
                check=(models.Q(probability__gte=0) & models.Q(probability__lte=1)),
                name='probability_values_constraint'
            ),
            # A specific topic should have a single mapping with a term
            models.UniqueConstraint(fields=['topic', 'term'], name='unique_topic_term_mapping_constraint'),
            # Shouldn't have topic term mappings with the same rank for a specific topic
            models.UniqueConstraint(fields=['topic', 'rank'], name='unique_topic_term_rank_constraint')
        ]


class TopicStatistics(models.Model):
    topic = models.OneToOneField(Topic, on_delete=models.CASCADE)
    number_of_relevant_texts = models.PositiveIntegerField(blank=True, null=True)
    relevant_texts_avg_citation_count = models.FloatField(blank=True, null=True)
    relevant_texts_avg_incubation_citation_count = models.FloatField(blank=True, null=True)
    relevant_texts_avg_pagerank_score = models.FloatField(blank=True, null=True)
    relevant_texts_avg_ram_score = models.FloatField(blank=True, null=True)
    relevant_texts_avg_attrank_score = models.FloatField(blank=True, null=True)

    # TODO: gain intuition about the corresponding impact scores
    #   - apply any applicable database constraints when the scores move within a specific range


class Comparison(models.Model):
    name = models.SlugField(
        max_length=130,
        unique=True,
        help_text='Descriptor of models of the measured topics'
    )
    model0 = models.ForeignKey(
        TopicModel,
        on_delete=models.CASCADE,
        help_text='Older topic model of the comparison',
        related_name='newer_comparison'
    )
    model1 = models.ForeignKey(
        TopicModel,
        on_delete=models.CASCADE,
        help_text='Newer topic model of the comparison',
        related_name='older_comparison'
    )


class TopicSimilarity(models.Model):
    comparison = models.ForeignKey(Comparison, on_delete=models.CASCADE)
    topic0 = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='newer_topic_similarity',
        help_text='Older topic of a comparison'
    )
    topic1 = models.ForeignKey(
        Topic,
        on_delete=models.CASCADE,
        related_name='older_topic_similarity',
        help_text='Newer topic of a comparison'
    )
    similarity = models.FloatField(
        help_text='Similarity value of the corresponding comparison'
    )

    class Meta:
        constraints = [
            # Two specific topics should have a single similarity value
            models.UniqueConstraint(fields=['comparison', 'topic0', 'topic1'], name='unique_topics_comparison_pairs'),
        ]
