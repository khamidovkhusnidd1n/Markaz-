import os
from io import BytesIO
from PIL import Image
from django.test import TestCase, RequestFactory, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.admin.sites import AdminSite
from rest_framework.test import APIRequestFactory

from core.models import Pedagogue, PedagogueProject, PedagogueProjectImage, News, NewsCategory, NewsImage
from core.admin import PedagogueProjectForm, PedagogueProjectAdmin
from core.views import NewsViewSet, NewsCategoryViewSet
from core.authentication import StaticAdminAuthentication


def create_dummy_image(name='test.jpg'):
    file_obj = BytesIO()
    image = Image.new('RGB', (100, 100), color='blue')
    image.save(file_obj, format='JPEG')
    file_obj.seek(0)
    return SimpleUploadedFile(name, file_obj.read(), content_type='image/jpeg')


@override_settings(SECURE_SSL_REDIRECT=False)
class Milestone2TestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.api_factory = APIRequestFactory()
        self.pedagogue = Pedagogue.objects.create(full_name="Test Pedagogue")
        self.category = NewsCategory.objects.create(name="Tech", slug="tech")
        self.news = News.objects.create(title="Test News", category=self.category, content="Content")

    def test_pedagogue_project_multi_image_upload_form(self):
        """Verify PedagogueProjectForm is_valid() passes when multiple files are uploaded."""
        file1 = create_dummy_image('img1.jpg')
        file2 = create_dummy_image('img2.jpg')

        data = {
            'pedagogue': self.pedagogue.id,
            'title': 'Test Project',
            'description': 'Description',
            'views_count': 0,
            'votes_count': 0,
        }
        files = {
            'images_upload': [file1, file2]
        }

        form = PedagogueProjectForm(data=data, files=files)
        self.assertTrue(form.is_valid(), f"Form errors: {form.errors}")

    def test_pedagogue_project_admin_save_model(self):
        """Verify PedagogueProjectAdmin.save_model correctly saves multiple images."""
        file1 = create_dummy_image('img1.jpg')
        file2 = create_dummy_image('img2.jpg')

        project = PedagogueProject.objects.create(
            pedagogue=self.pedagogue,
            title='Admin Test Project'
        )

        request = self.factory.post('/admin/core/pedagogueproject/add/', {'images_upload': [file1, file2]})

        admin_instance = PedagogueProjectAdmin(PedagogueProject, AdminSite())
        form = PedagogueProjectForm(instance=project)
        
        admin_instance.save_model(request, project, form, change=True)
        self.assertEqual(project.images.count(), 2)

    def test_news_viewset_has_relocated_actions(self):
        """Verify add_images, toggle_active, toggle_important actions are on NewsViewSet, not NewsCategoryViewSet."""
        self.assertTrue(hasattr(NewsViewSet, 'add_images'))
        self.assertTrue(hasattr(NewsViewSet, 'toggle_active'))
        self.assertTrue(hasattr(NewsViewSet, 'toggle_important'))

        self.assertFalse(hasattr(NewsCategoryViewSet, 'add_images'))
        self.assertFalse(hasattr(NewsCategoryViewSet, 'toggle_active'))
        self.assertFalse(hasattr(NewsCategoryViewSet, 'toggle_important'))

    def test_static_admin_authentication_security(self):
        """Verify StaticAdminAuthentication rejects default or production bypass."""
        auth = StaticAdminAuthentication()
        request = self.api_factory.get('/api/news/', HTTP_AUTHORIZATION='Bearer static-admin-token')
        
        # In DEBUG=False, static admin auth returns None
        user_auth = auth.authenticate(request)
        self.assertIsNone(user_auth)
