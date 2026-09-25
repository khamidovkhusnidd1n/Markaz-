"""
URL Configuration for the core app API endpoints.
With AppContent and JournalSettings.
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

router = DefaultRouter()
router.register(r'departments', views.DepartmentViewSet, basename='departments')
router.register(r'pedagogues', views.PedagogueViewSet, basename='pedagogues')
router.register(r'pedagogue-projects', views.PedagogueProjectViewSet, basename='pedagogue-projects')
router.register(r'news', views.NewsViewSet, basename='news')
router.register(r'news-categories', views.NewsCategoryViewSet, basename='news-category')
router.register(r'gallery', views.GalleryItemViewSet, basename='gallery')
router.register(r'art-gallery', views.ArtGalleryItemViewSet, basename='art-gallery')
router.register(r'appeals', views.AppealViewSet, basename='appeals')
router.register(r'applications', views.ApplicationViewSet, basename='applications')
router.register(r'listeners', views.ListenerViewSet, basename='listeners')
router.register(r'teachers', views.TeacherViewSet, basename='teachers')
router.register(r'personnel', views.PersonnelViewSet, basename='personnel')
router.register(r'courses', views.CourseViewSet, basename='courses')
router.register(r'journal', views.JournalIssueViewSet, basename='journal')
router.register(r'documents', views.DocumentViewSet, basename='documents')
router.register(r'statistics', views.StatisticsViewSet, basename='statistics')
router.register(r'yearly-statistics', views.YearlyStatisticsViewSet, basename='yearly-statistics')
router.register(r'content', views.AppContentViewSet, basename='content')
router.register(r'journal-settings', views.JournalSettingsViewSet, basename='journal-settings')
router.register(r'international-settings', views.InternationalSettingsViewSet, basename='international-settings')
router.register(r'international-partners', views.InternationalPartnerViewSet, basename='international-partners')
router.register(r'international-projects', views.InternationalProjectViewSet, basename='international-projects')
router.register(r'international-media', views.InternationalMediaViewSet, basename='international-media')

urlpatterns = [
    path('projects/<int:pk>/view/', views.increment_project_view, name='views.increment_project_view'),
    path('news/<int:pk>/view/', views.increment_news_view, name='views.increment_news_view'),
    path('s/news/<int:pk>/', views.share_news_preview, name='share_news_preview'),
    path('department-posts/<int:pk>/view/', views.increment_department_post_view, name='views.increment_department_post_view'),
    path('projects/<int:pk>/vote/', views.increment_project_vote, name='views.increment_project_vote'),
    # Router URLs
    path('', include(router.urls)),

    # All data endpoint (for initial load)
    path('all-data/', views.get_all_data, name='all-data'),

    # Authentication endpoints
    path('login/', views.custom_login, name='custom-login'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Legacy pdPlans endpoint (alias for listeners)
    path('pdplans/', views.ListenerViewSet.as_view({'get': 'list', 'post': 'create'}), name='pdplans-list'),
    path('pdplans/<int:pk>/', views.ListenerViewSet.as_view({'get': 'retrieve', 'put': 'update', 'delete': 'destroy'}), name='pdplans-detail'),
    path('pdplans/search/', views.ListenerViewSet.as_view({'get': 'search'}), name='pdplans-search'),
    path('pdplans/bulk-import/', views.ListenerViewSet.as_view({'post': 'bulk_import'}), name='pdplans-bulk-import'),
]
