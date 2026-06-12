from django.db import connection
from django.db.utils import OperationalError
from django.views.generic import DetailView, ListView, TemplateView

from .models import AppContent, Course, News, Statistics


class DatabaseStatusMixin:
    """Expose PostgreSQL connection state to DTL templates."""

    def get_database_status(self):
        try:
            connection.ensure_connection()
            return {
                'is_connected': True,
                'message': 'PostgreSQL ulanishi faol.',
            }
        except OperationalError as exc:
            return {
                'is_connected': False,
                'message': f'PostgreSQL ulanish xatosi: {exc}',
            }

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['db_status'] = self.get_database_status()
        return context


class HomePageView(DatabaseStatusMixin, TemplateView):
    template_name = 'site/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['content'] = AppContent.get_instance()
        context['statistics'] = Statistics.get_instance()
        context['featured_news'] = News.objects.filter(is_active=True).select_related('category')[:5]
        context['featured_courses'] = Course.objects.filter(is_active=True)[:6]
        return context


class NewsListPageView(DatabaseStatusMixin, ListView):
    template_name = 'site/news_list.html'
    context_object_name = 'news_list'
    paginate_by = 10

    def get_queryset(self):
        return News.objects.filter(is_active=True).select_related('category')


class NewsDetailPageView(DatabaseStatusMixin, DetailView):
    template_name = 'site/news_detail.html'
    context_object_name = 'news'
    queryset = News.objects.filter(is_active=True).select_related('category').prefetch_related('images')


class CourseListPageView(DatabaseStatusMixin, ListView):
    template_name = 'site/course_list.html'
    context_object_name = 'courses'

    def get_queryset(self):
        return Course.objects.filter(is_active=True)


class CourseDetailPageView(DatabaseStatusMixin, DetailView):
    template_name = 'site/course_detail.html'
    context_object_name = 'course'
    queryset = Course.objects.filter(is_active=True)
