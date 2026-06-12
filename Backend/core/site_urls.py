from django.urls import path

from .site_views import (
    CourseDetailPageView,
    CourseListPageView,
    HomePageView,
    NewsDetailPageView,
    NewsListPageView,
)


app_name = 'site'

urlpatterns = [
    path('', HomePageView.as_view(), name='home'),
    path('news/', NewsListPageView.as_view(), name='news-list'),
    path('news/<int:pk>/', NewsDetailPageView.as_view(), name='news-detail'),
    path('courses/', CourseListPageView.as_view(), name='course-list'),
    path('courses/<int:pk>/', CourseDetailPageView.as_view(), name='course-detail'),
]
