import os
from io import BytesIO
from PIL import Image
from django.test import TestCase, RequestFactory, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.admin.sites import AdminSite

from core.models import (
    Pedagogue, PedagogueProject, PedagogueProjectImage,
    Course, News, NewsCategory, NewsImage,
    GalleryItem, GalleryImage, Teacher
)
from core.admin import (
    PedagogueProjectForm, PedagogueProjectAdmin
)


def create_test_image(name='test_image.jpg', color='red', format_type='JPEG', size=(100, 100)):
    file_obj = BytesIO()
    image = Image.new('RGB', size, color=color)
    image.save(file_obj, format=format_type)
    file_obj.seek(0)
    content_type = 'image/jpeg' if format_type.upper() in ['JPG', 'JPEG'] else f'image/{format_type.lower()}'
    return SimpleUploadedFile(name, file_obj.read(), content_type=content_type)


@override_settings(SECURE_SSL_REDIRECT=False)
class Milestone3EmpiricalTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.site = AdminSite()
        self.pedagogue = Pedagogue.objects.create(full_name="Test Pedagogue", bio="Bio")
        self.news_category = NewsCategory.objects.create(name="Events", slug="events")

    # -------------------------------------------------------------------------
    # 1. PedagogueProject Multi-Image Upload Tests
    # -------------------------------------------------------------------------
    def test_pedagogue_project_form_multiple_images(self):
        """Verify PedagogueProjectForm accepts multiple uploaded files in images_upload."""
        img1 = create_test_image('proj1.jpg', 'blue')
        img2 = create_test_image('proj2.png', 'green', format_type='PNG')
        img3 = create_test_image('proj3.jpg', 'yellow')

        data = {
            'pedagogue': self.pedagogue.id,
            'title': 'Multi Image Project',
            'description': 'Description for multi image project',
            'views_count': 5,
            'votes_count': 10,
        }
        files = {
            'images_upload': [img1, img2, img3]
        }
        form = PedagogueProjectForm(data=data, files=files)
        self.assertTrue(form.is_valid(), f"Form validation failed: {form.errors}")

    def test_pedagogue_project_admin_save_model_multiple_images(self):
        """Verify PedagogueProjectAdmin.save_model creates PedagogueProjectImage records."""
        img1 = create_test_image('multi1.jpg', 'red')
        img2 = create_test_image('multi2.jpg', 'blue')
        img3 = create_test_image('multi3.jpg', 'purple')

        project = PedagogueProject.objects.create(
            pedagogue=self.pedagogue,
            title='Admin Save Model Project'
        )

        request = self.factory.post('/admin/core/pedagogueproject/add/', {'images_upload': [img1, img2, img3]})
        admin_instance = PedagogueProjectAdmin(PedagogueProject, self.site)
        form = PedagogueProjectForm(instance=project)

        admin_instance.save_model(request, project, form, change=True)

        images = PedagogueProjectImage.objects.filter(project=project)
        self.assertEqual(images.count(), 3)
        for img in images:
            self.assertTrue(os.path.basename(img.image.name).endswith('.jpg'))

    def test_pedagogue_project_admin_save_model_nested_list_and_empty(self):
        """Verify handling of empty list, nested lists, and null items in images_upload."""
        project = PedagogueProject.objects.create(
            pedagogue=self.pedagogue,
            title='Empty & Nested Upload Project'
        )
        admin_instance = PedagogueProjectAdmin(PedagogueProject, self.site)
        form = PedagogueProjectForm(instance=project)

        # 1. Empty upload
        request_empty = self.factory.post('/admin/core/pedagogueproject/add/', {})
        admin_instance.save_model(request_empty, project, form, change=True)
        self.assertEqual(project.images.count(), 0)

        # 2. Nested list upload (simulating custom querydict behaviors)
        img1 = create_test_image('nested1.jpg', 'black')
        img2 = create_test_image('nested2.jpg', 'white')
        request_nested = self.factory.post('/admin/core/pedagogueproject/add/')
        request_nested.FILES.setlist('images_upload', [[img1, img2]])
        admin_instance.save_model(request_nested, project, form, change=True)
        self.assertEqual(project.images.count(), 2)

    def test_pedagogue_project_incremental_image_uploads(self):
        """Verify updating existing PedagogueProject appends new images without destroying existing ones."""
        project = PedagogueProject.objects.create(
            pedagogue=self.pedagogue,
            title='Incremental Project'
        )
        admin_instance = PedagogueProjectAdmin(PedagogueProject, self.site)
        form = PedagogueProjectForm(instance=project)

        # Initial upload 1 image
        img1 = create_test_image('initial.jpg', 'red')
        req1 = self.factory.post('/admin/core/pedagogueproject/1/change/', {'images_upload': [img1]})
        admin_instance.save_model(req1, project, form, change=True)
        self.assertEqual(project.images.count(), 1)

        # Second upload 2 more images
        img2 = create_test_image('append1.jpg', 'green')
        img3 = create_test_image('append2.jpg', 'blue')
        req2 = self.factory.post('/admin/core/pedagogueproject/1/change/', {'images_upload': [img2, img3]})
        admin_instance.save_model(req2, project, form, change=True)
        self.assertEqual(project.images.count(), 3)

    # -------------------------------------------------------------------------
    # 2. Course Image Upload and Update Tests
    # -------------------------------------------------------------------------
    def test_course_image_create_update_delete(self):
        """Test initial upload, update, and removal of Course photo."""
        img1 = create_test_image('course_v1.jpg', 'orange')
        course = Course.objects.create(
            title='Python Backend Course',
            course_type='professional_development',
            photo=img1
        )
        self.assertIsNotNone(course.photo)
        self.assertTrue('uploads/course/' in course.photo.name)
        initial_filename = course.photo.name

        # Update course with new image
        img2 = create_test_image('course_v2.jpg', 'cyan')
        course.photo = img2
        course.save()
        self.assertNotEqual(course.photo.name, initial_filename)
        self.assertTrue('uploads/course/' in course.photo.name)

        # Update course fields without touching photo
        course.title = 'Python & Django Course'
        course.save()
        self.assertTrue(course.photo.name.endswith('.jpg'))

        # Set photo to None / Clear photo
        course.photo = None
        course.save()
        self.assertFalse(bool(course.photo))

    # -------------------------------------------------------------------------
    # 3. News Image Upload and Update Tests
    # -------------------------------------------------------------------------
    def test_news_and_news_image_relationships(self):
        """Test News creation, inline NewsImage creation, update, and order manipulation."""
        news = News.objects.create(
            title='Breaking Tech News',
            category=self.news_category,
            content='Important update details.'
        )

        img1 = create_test_image('news1.jpg', 'red')
        img2 = create_test_image('news2.jpg', 'blue')

        n_img1 = NewsImage.objects.create(news=news, image=img1, order=1)
        n_img2 = NewsImage.objects.create(news=news, image=img2, order=2)

        self.assertEqual(news.images.count(), 2)

        # Update news image order and image content
        img1_updated = create_test_image('news1_new.jpg', 'yellow')
        n_img1.image = img1_updated
        n_img1.order = 10
        n_img1.save()

        updated_n_img1 = NewsImage.objects.get(id=n_img1.id)
        self.assertEqual(updated_n_img1.order, 10)
        self.assertTrue('uploads/newsimage/' in updated_n_img1.image.name)

        # Delete an inline news image
        n_img2.delete()
        self.assertEqual(news.images.count(), 1)

    # -------------------------------------------------------------------------
    # 4. GalleryItem Image Upload and Update Tests
    # -------------------------------------------------------------------------
    def test_gallery_item_and_gallery_image_handling(self):
        """Test GalleryItem cover_image upload/update and GalleryImage inline creation."""
        cover = create_test_image('cover.jpg', 'magenta')
        gallery = GalleryItem.objects.create(
            title='Campus Photo Gallery',
            cover_image=cover
        )
        self.assertTrue('uploads/galleryitem/' in gallery.cover_image.name)

        # Add gallery images
        g_img1 = create_test_image('g1.jpg', 'pink')
        g_img2 = create_test_image('g2.jpg', 'grey')
        GalleryImage.objects.create(gallery=gallery, image=g_img1, order=0)
        GalleryImage.objects.create(gallery=gallery, image=g_img2, order=1)

        self.assertEqual(gallery.images.count(), 2)

        # Update GalleryItem cover image
        new_cover = create_test_image('new_cover.png', 'brown', format_type='PNG')
        gallery.cover_image = new_cover
        gallery.save()
        self.assertTrue(gallery.cover_image.name.endswith('.png'))

    # -------------------------------------------------------------------------
    # 5. Teacher Image Upload and Update Tests
    # -------------------------------------------------------------------------
    def test_teacher_photo_upload_update_and_translation_side_effects(self):
        """Test Teacher photo upload and verify save method handles photo alongside auto-translation gracefully."""
        photo1 = create_test_image('teacher_photo1.jpg', 'blue')
        teacher = Teacher.objects.create(
            full_name='Dr. Alimov',
            position='Professor',
            photo=photo1
        )
        self.assertTrue('uploads/teacher/' in teacher.photo.name)

        # Update photo
        photo2 = create_test_image('teacher_photo2.png', 'red', format_type='PNG')
        teacher.photo = photo2
        teacher.save()

        updated_teacher = Teacher.objects.get(id=teacher.id)
        self.assertTrue(updated_teacher.photo.name.endswith('.png'))

    # -------------------------------------------------------------------------
    # 6. Stress & Boundary Empirical Tests
    # -------------------------------------------------------------------------
    def test_filenames_with_special_characters_and_cyrillic(self):
        """Verify generate_unique_filename handles special characters and Cyrillic safely without corruption."""
        weird_filename = "Rasm yuborish !@#$%^&()_ +=- {}:'| Uzbek Qat'iylik 2026.png"
        img = create_test_image(name=weird_filename, color='yellow', format_type='PNG')

        project = PedagogueProject.objects.create(
            pedagogue=self.pedagogue,
            title='Special Char Test Project'
        )

        proj_img = PedagogueProjectImage.objects.create(project=project, image=img)
        # Unique filename should keep extension (.png) and generate hex uuid
        self.assertTrue(proj_img.image.name.startswith('uploads/pedagogueprojectimage/'))
        self.assertTrue(proj_img.image.name.endswith('.png'))

    # -------------------------------------------------------------------------
    # 7. Adversarial Challenge: Non-Image File Upload Vulnerability
    # -------------------------------------------------------------------------
    def test_pedagogue_project_non_image_file_vulnerability(self):
        """
        Adversarial Test: Uploading non-image text file to PedagogueProjectForm.
        MultipleFileField inherits from FileField instead of ImageField, so non-image files are
        accepted by form validation and saved as PedagogueProjectImage objects.
        """
        txt_file = SimpleUploadedFile("malicious.txt", b"plain text content", content_type="text/plain")
        data = {
            'pedagogue': self.pedagogue.id,
            'title': 'Non-image Upload Project',
            'views_count': 0,
            'votes_count': 0,
        }
        files = {
            'images_upload': [txt_file]
        }
        form = PedagogueProjectForm(data=data, files=files)

        # Empirical Observation: form.is_valid() evaluates to True because MultipleFileField lacks image validation
        form_is_valid = form.is_valid()
        self.assertTrue(form_is_valid, f"Form should pass validation even with non-image file due to FileField usage: {form.errors}")

        # Admin save_model creates PedagogueProjectImage object with the non-image file
        project = PedagogueProject.objects.create(pedagogue=self.pedagogue, title='Non-image Save Project')
        req = self.factory.post('/admin/core/pedagogueproject/add/', {'images_upload': [txt_file]})
        admin_instance = PedagogueProjectAdmin(PedagogueProject, self.site)
        admin_instance.save_model(req, project, form, change=True)

        non_img_obj = PedagogueProjectImage.objects.filter(project=project).first()
        self.assertIsNotNone(non_img_obj)
        self.assertTrue(non_img_obj.image.name.endswith('.txt'))
