from django.http import JsonResponse
from django.shortcuts import render
from django.db import transaction
from django.db.models import Count, F
from rest_framework.decorators import api_view
from rest_framework.response import Response

from api.models import Topic, TopicTermAssignment, TopicModel, TopicSimilarity

import math


@api_view(['GET'])
# GET models/MODEL/topics/TOPIC
# GET models/MODEL/topics/
def topics(request, model, topic=None):
    result = {}
    if topic is not None:

        limit = request.GET.get('limit', None)

        with transaction.atomic():
            try:
                topic_obj = Topic.objects.get(index=int(topic), topic_model__name=model)
            except Topic.DoesNotExist:
                return Response({'message': f'Topic {topic} does not exist'}, status=404)
            except TopicModel.DoesNotExist:
                return Response({'message': f'Topic model "{model}" does not exist'}, status=404)
            if limit:
                query = TopicTermAssignment.objects.filter(
                    topic__topic_model__name=model, topic=topic_obj
                ).order_by('-probability').values('topic__index', 'term__string', 'probability')[:int(limit)]
            else:
                query = TopicTermAssignment.objects.filter(
                    topic__topic_model__name=model, topic__index=topic
                ).order_by('-probability').values('topic__index', 'term__string', 'probability')
        if query:
            result = {
                'topic': topic,
                'terms': [
                    {'string': term_distribution['term__string'], 'probability': term_distribution['probability']}
                    for term_distribution in query
                ]
            }
    else:
        result = Topic.objects.all().values('index', 'title')

    return Response(result)


@api_view(['GET'])
# GET models/
# GET models/MODEL/
def models(request, model=None):
    if model:
        model_obj = TopicModel.objects.filter(name=model).values('name').annotate(num_topics=Count('topic'))
        if not model_obj:
            return Response({'message': f'Topic model "{model}" does not exist'}, status=404)
        return Response(model_obj[0])
    else:
        model_objs = TopicModel.objects.all().values('name').annotate(num_topics=Count('topic'))
        return Response(model_objs)


@api_view(['GET'])
# GET models-similarity
def models_similarity_graph(request):
    # TODO: minimum similarity (CHANGE)
    MINIMUM_SIMILARITY = 0.2

    topic_similarities = TopicSimilarity.objects.filter(similarity__gte=MINIMUM_SIMILARITY).values(
        'comparison__model0__name',
        'topic0__index',
        'topic0__topicstatistics__number_of_relevant_texts',
        'topic0__topicstatistics__relevant_texts_avg_pagerank_score',
        'comparison__model1__name',
        'topic1__index',
        'topic1__topicstatistics__number_of_relevant_texts',
        'topic1__topicstatistics__relevant_texts_avg_pagerank_score',
        'similarity'
    )
    referred_topics = dict()
    links = list()
    for topic_similarity_obj in topic_similarities:
        referred_topic_designated_name_0 = topic_similarity_obj['comparison__model0__name'] + '-' + \
                                           str(topic_similarity_obj['topic0__index'])
        if referred_topic_designated_name_0 not in referred_topics:
            referred_topics[referred_topic_designated_name_0] = {
                'name': referred_topic_designated_name_0,
                'model': topic_similarity_obj['comparison__model0__name'],
                'topic': topic_similarity_obj['topic0__index'],
                'number_of_relevant_texts': topic_similarity_obj['topic0__topicstatistics__number_of_relevant_texts'],
                'avg_pagerank_score': topic_similarity_obj[
                    'topic0__topicstatistics__relevant_texts_avg_pagerank_score'],
            }
        referred_topic_designated_name_1 = topic_similarity_obj['comparison__model1__name'] + '-' + \
                                           str(topic_similarity_obj['topic1__index'])
        if referred_topic_designated_name_1 not in referred_topics:
            referred_topics[referred_topic_designated_name_1] = {
                'name': referred_topic_designated_name_1,
                'model': topic_similarity_obj['comparison__model1__name'],
                'topic': topic_similarity_obj['topic1__index'],
                'number_of_relevant_texts': topic_similarity_obj['topic1__topicstatistics__number_of_relevant_texts'],
                'avg_pagerank_score': topic_similarity_obj[
                    'topic1__topicstatistics__relevant_texts_avg_pagerank_score'],
            }
        links.append({
            'topic0': referred_topic_designated_name_0,
            'topic1': referred_topic_designated_name_1,
            'similarity': topic_similarity_obj['similarity']
        })
    return Response(
        {
            'nodes': list(referred_topics.values()),
            'links': links
        }
    )


@api_view(['GET'])
def search_topics(request):
    search_terms = request.GET.get('query', '').split()
    related_topic_term_assignments = TopicTermAssignment.objects.filter(
        term__string__in=search_terms
    ).values('probability').annotate(model=F('topic__topic_model__name')).annotate(topic=F('topic__index'))
    related_topics = dict()
    if related_topic_term_assignments:
        for tta in related_topic_term_assignments:
            if tta['topic'] not in related_topics:
                related_topics[tta['topic']] = list()
            related_topics[tta['topic']].append(tta['probability'])
        score_func = math.prod
        sorted_related_topics = sorted(
            [
                {'topic': topic_index, 'score': score_func(related_topics[topic_index])} for topic_index in
                related_topics
            ], reverse=True, key=lambda x: x['score']
        )
        return Response(sorted_related_topics)
    return Response([])
