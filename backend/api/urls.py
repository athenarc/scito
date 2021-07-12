from django.urls import path
from . import views

urlpatterns = [
    path('models-similarity-graph/', views.models_similarity_graph, name='models-similarity_graph'),
    path('models/<str:model>/topics/<int:topic>/', views.topics, name='list-topic-details'),
    path('models/<str:model>/topics/', views.topics, name='list-topics'),
    path('models/<str:model>/', views.models, name='list-model-details'),
    path('models/', views.models, name='list-models'),
    path('search-topics/', views.search_topics, name='search_topics')
]
