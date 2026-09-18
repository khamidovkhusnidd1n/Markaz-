"""
DRF Serializers for the Educational Center Management System.
Cleaned up version without unnecessary URL fields.
"""
from rest_framework import serializers
from .models import (
    News, NewsImage, NewsCategory, GalleryItem, GalleryImage, ArtGalleryItem, Appeal, Application, Listener, Teacher, Personnel,
    Course, JournalIssue, Document, Statistics, YearlyStatistics,
    AppContent, AppHeroImage, JournalSettings, InternationalSettings, InternationalPartner,
    InternationalProject, InternationalProjectImage, InternationalMedia
)


def get_translated(obj, field, lang):
    """Return translated field value if available, fallback to original."""
    if lang and lang != 'uz':
        translated = getattr(obj, f'{field}_{lang}', '') or ''
        if translated.strip():
            return translated
    return getattr(obj, field, '') or ''


class NewsCategorySerializer(serializers.ModelSerializer):
    name_translated = serializers.SerializerMethodField()

    class Meta:
        model = NewsCategory
        fields = ['id', 'name', 'name_translated', 'name_ru', 'name_en', 'slug', 'order', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_name_translated(self, obj):
        return get_translated(obj, 'name', self.context.get('lang', 'uz'))


class NewsImageSerializer(serializers.ModelSerializer):
    """Serializer for NewsImage model."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = NewsImage
        fields = ['id', 'image', 'image_url', 'order']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class NewsSerializer(serializers.ModelSerializer):
    """Serializer for News model with inline images."""
    images = NewsImageSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_id = serializers.IntegerField(source='category.id', read_only=True)
    title_translated = serializers.SerializerMethodField()
    content_translated = serializers.SerializerMethodField()

    class Meta:
        model = News
        fields = [
            'id', 'title', 'title_ru', 'title_en', 'title_translated',
            'category', 'category_id', 'category_name',
            'content', 'content_ru', 'content_en', 'content_translated',
            'images', 'image_url', 'views_count',
            'is_important', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        """Return first image URL for backwards compatibility."""
        request = self.context.get('request')
        first_image = obj.images.first()
        if first_image and first_image.image:
            if request:
                return request.build_absolute_uri(first_image.image.url)
            return first_image.image.url
        return None

    def get_title_translated(self, obj):
        return get_translated(obj, 'title', self.context.get('lang', 'uz'))

    def get_content_translated(self, obj):
        return get_translated(obj, 'content', self.context.get('lang', 'uz'))


class NewsCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating News with images."""

    class Meta:
        model = News
        fields = ['id', 'title', 'category', 'content', 'is_important', 'is_active']
        read_only_fields = ['id']


class GalleryImageSerializer(serializers.ModelSerializer):
    """Serializer for GalleryImage model - individual gallery images."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = GalleryImage
        fields = ['id', 'image', 'image_url', 'order']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class GalleryItemSerializer(serializers.ModelSerializer):
    """Serializer for GalleryItem model - album with multiple images."""
    cover_image_url = serializers.SerializerMethodField()
    images = GalleryImageSerializer(many=True, read_only=True)

    class Meta:
        model = GalleryItem
        fields = [
            'id', 'title', 'cover_image', 'cover_image_url', 'images',
            'order', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image:
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class ListenerSerializer(serializers.ModelSerializer):
    """Serializer for Listener model with MO/QT types."""
    record_type_display = serializers.CharField(
        source='get_record_type_display',
        read_only=True
    )

    class Meta:
        model = Listener
        fields = [
            'id', 'record_type', 'record_type_display', 'full_name',
            'workplace', 'course_type', 'series', 'number', 'duration',
            'is_verified', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs = {
            'series': {'required': False, 'allow_blank': True},
        }


class ListenerBulkImportSerializer(serializers.Serializer):
    """Serializer for bulk importing listeners from Excel."""
    file = serializers.FileField()
    record_type = serializers.ChoiceField(choices=[
        ('MO', 'Malaka oshirish (MO)'),
        ('QT', 'Qayta tayyorlash (QT)'),
    ])


class TeacherSerializer(serializers.ModelSerializer):
    """Serializer for Teacher model - simplified."""
    photo_url = serializers.SerializerMethodField()
    position_translated = serializers.SerializerMethodField()
    degree_translated = serializers.SerializerMethodField()
    title_translated = serializers.SerializerMethodField()
    awards_translated = serializers.SerializerMethodField()
    biography_translated = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            'id', 'full_name',
            'position', 'position_ru', 'position_en', 'position_translated',
            'degree', 'degree_ru', 'degree_en', 'degree_translated',
            'title', 'title_ru', 'title_en', 'title_translated',
            'awards', 'awards_ru', 'awards_en', 'awards_translated',
            'biography', 'biography_ru', 'biography_en', 'biography_translated',
            'photo', 'photo_url', 'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

    def get_position_translated(self, obj):
        return get_translated(obj, 'position', self.context.get('lang', 'uz'))

    def get_degree_translated(self, obj):
        return get_translated(obj, 'degree', self.context.get('lang', 'uz'))

    def get_title_translated(self, obj):
        return get_translated(obj, 'title', self.context.get('lang', 'uz'))

    def get_awards_translated(self, obj):
        return get_translated(obj, 'awards', self.context.get('lang', 'uz'))

    def get_biography_translated(self, obj):
        return get_translated(obj, 'biography', self.context.get('lang', 'uz'))


class PersonnelSerializer(serializers.ModelSerializer):
    """Serializer for Personnel model."""
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    photo_url = serializers.SerializerMethodField()
    position_translated = serializers.SerializerMethodField()
    duties_translated = serializers.SerializerMethodField()
    biography_translated = serializers.SerializerMethodField()

    class Meta:
        model = Personnel
        fields = [
            'id', 'full_name',
            'position', 'position_ru', 'position_en', 'position_translated',
            'phone', 'email', 'reception_hours',
            'photo', 'photo_url', 'category', 'category_display',
            'duties', 'duties_ru', 'duties_en', 'duties_translated',
            'biography', 'biography_ru', 'biography_en', 'biography_translated',
            'order', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

    def get_position_translated(self, obj):
        return get_translated(obj, 'position', self.context.get('lang', 'uz'))

    def get_duties_translated(self, obj):
        return get_translated(obj, 'duties', self.context.get('lang', 'uz'))

    def get_biography_translated(self, obj):
        return get_translated(obj, 'biography', self.context.get('lang', 'uz'))


class CourseSerializer(serializers.ModelSerializer):
    """Serializer for Course model."""
    course_type_display = serializers.CharField(
        source='get_course_type_display',
        read_only=True
    )
    photo_url = serializers.SerializerMethodField()
    title_translated = serializers.SerializerMethodField()
    description_translated = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = [
            'id',
            'title', 'title_ru', 'title_en', 'title_translated',
            'course_type', 'course_type_display',
            'duration',
            'description', 'description_ru', 'description_en', 'description_translated',
            'phone_numbers', 'email',
            'telegram_link', 'photo', 'photo_url', 'is_active', 'order',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None

    def get_title_translated(self, obj):
        return get_translated(obj, 'title', self.context.get('lang', 'uz'))

    def get_description_translated(self, obj):
        return get_translated(obj, 'description', self.context.get('lang', 'uz'))


class JournalIssueSerializer(serializers.ModelSerializer):
    """Serializer for JournalIssue model - simplified."""
    pdf_url = serializers.SerializerMethodField()
    thumbnail_url = serializers.SerializerMethodField()

    class Meta:
        model = JournalIssue
        fields = [
            'id', 'year', 'issue_number',
            'pdf_file', 'pdf_url', 'thumbnail', 'thumbnail_url',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.pdf_file:
            if request:
                return request.build_absolute_uri(obj.pdf_file.url)
            return obj.pdf_file.url
        return None

    def get_thumbnail_url(self, obj):
        request = self.context.get('request')
        if obj.thumbnail:
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class DocumentSerializer(serializers.ModelSerializer):
    """Serializer for Document model - simplified."""
    category_display = serializers.CharField(
        source='get_category_display',
        read_only=True
    )
    file_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    title_translated = serializers.SerializerMethodField()

    class Meta:
        model = Document
        fields = [
            'id', 'title', 'title_ru', 'title_en', 'title_translated',
            'category', 'category_display',
            'file', 'file_url', 'cover_image', 'cover_image_url',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file:
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        if obj.cover_image:
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

    def get_title_translated(self, obj):
        return get_translated(obj, 'title', self.context.get('lang', 'uz'))


class ArtGalleryItemSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    title_translated = serializers.SerializerMethodField()
    description_translated = serializers.SerializerMethodField()

    class Meta:
        model = ArtGalleryItem
        fields = [
            'id', 'title', 'title_ru', 'title_en', 'title_translated',
            'author', 'image', 'image_url',
            'description', 'description_ru', 'description_en', 'description_translated',
            'order', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_title_translated(self, obj):
        return get_translated(obj, 'title', self.context.get('lang', 'uz'))

    def get_description_translated(self, obj):
        return get_translated(obj, 'description', self.context.get('lang', 'uz'))


class AppealSerializer(serializers.ModelSerializer):
    appeal_type_display = serializers.CharField(source='get_appeal_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Appeal
        fields = [
            'id', 'full_name', 'appeal_type', 'appeal_type_display',
            'description', 'phone', 'email', 'telegram_link',
            'status', 'status_display', 'admin_note',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class ApplicationSerializer(serializers.ModelSerializer):
    application_type_display = serializers.CharField(source='get_application_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'full_name', 'application_type', 'application_type_display',
            'workplace', 'direction', 'phone', 'telegram_link',
            'status', 'status_display', 'admin_note',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class YearlyStatisticsSerializer(serializers.ModelSerializer):
    """Serializer for YearlyStatistics model."""

    class Meta:
        model = YearlyStatistics
        fields = [
            'id', 'year', 'professional_development_count',
            'retraining_count', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class StatisticsSerializer(serializers.ModelSerializer):
    """Serializer for Statistics model."""
    yearly_data = serializers.SerializerMethodField()

    class Meta:
        model = Statistics
        fields = [
            'id', 'total_pedagogs', 'professors', 'dotsents', 'academics', 'potential',
            'yearly_data', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_yearly_data(self, obj):
        yearly_stats = YearlyStatistics.objects.all()
        return YearlyStatisticsSerializer(yearly_stats, many=True).data


class AllDataSerializer(serializers.Serializer):
    """Serializer for returning all data at once (for initial load)."""
    news = NewsSerializer(many=True, read_only=True)
    gallery = GalleryItemSerializer(many=True, read_only=True)
    listeners = ListenerSerializer(many=True, read_only=True)
    teachers = TeacherSerializer(many=True, read_only=True)
    personnel = PersonnelSerializer(many=True, read_only=True)
    courses = CourseSerializer(many=True, read_only=True)
    journal_issues = JournalIssueSerializer(many=True, read_only=True)
    documents = DocumentSerializer(many=True, read_only=True)
    statistics = StatisticsSerializer(read_only=True)


class AppHeroImageSerializer(serializers.ModelSerializer):
    """Serializer for AppHeroImage model."""
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = AppHeroImage
        fields = ['id', 'image', 'image_url', 'order']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class AppContentSerializer(serializers.ModelSerializer):
    """Serializer for AppContent singleton model."""
    structure_image_url = serializers.SerializerMethodField()
    header_logo_url = serializers.SerializerMethodField()
    footer_logo_url = serializers.SerializerMethodField()
    hero_images = serializers.SerializerMethodField()
    history_translated = serializers.SerializerMethodField()
    structure_translated = serializers.SerializerMethodField()
    student_notes_translated = serializers.SerializerMethodField()
    site_name_translated = serializers.SerializerMethodField()

    class Meta:
        model = AppContent
        fields = [
            'id',
            'history', 'history_ru', 'history_en', 'history_translated',
            'structure', 'structure_ru', 'structure_en', 'structure_translated',
            'structure_image', 'structure_image_url',
            'student_notes', 'student_notes_ru', 'student_notes_en', 'student_notes_translated',
            'contact_info', 'address', 'map_embed_url',
            'site_name', 'site_name_ru', 'site_name_en', 'site_name_translated',
            'header_logo', 'header_logo_url',
            'footer_logo', 'footer_logo_url', 'hero_video_url', 'hero_images',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_structure_image_url(self, obj):
        request = self.context.get('request')
        if obj.structure_image:
            if request:
                return request.build_absolute_uri(obj.structure_image.url)
            return obj.structure_image.url
        return None

    def get_header_logo_url(self, obj):
        request = self.context.get('request')
        if obj.header_logo:
            if request:
                return request.build_absolute_uri(obj.header_logo.url)
            return obj.header_logo.url
        return None

    def get_footer_logo_url(self, obj):
        request = self.context.get('request')
        if obj.footer_logo:
            if request:
                return request.build_absolute_uri(obj.footer_logo.url)
            return obj.footer_logo.url
        return None

    def get_hero_images(self, obj):
        request = self.context.get('request')
        items = []
        for image in obj.hero_images.all().order_by('order', '-created_at'):
            image_url = request.build_absolute_uri(image.image.url) if request and image.image else (image.image.url if image.image else None)
            items.append({
                'id': image.id,
                'image_url': image_url,
                'order': image.order,
            })
        return items

    def get_history_translated(self, obj):
        return get_translated(obj, 'history', self.context.get('lang', 'uz'))

    def get_structure_translated(self, obj):
        return get_translated(obj, 'structure', self.context.get('lang', 'uz'))

    def get_student_notes_translated(self, obj):
        return get_translated(obj, 'student_notes', self.context.get('lang', 'uz'))

    def get_site_name_translated(self, obj):
        return get_translated(obj, 'site_name', self.context.get('lang', 'uz'))


class JournalSettingsSerializer(serializers.ModelSerializer):
    """Serializer for JournalSettings singleton model."""
    article_rules_pdf_url = serializers.SerializerMethodField()

    class Meta:
        model = JournalSettings
        fields = [
            'id', 'article_rules_text', 'article_rules_pdf', 'article_rules_pdf_url',
            'about_journal', 'phone', 'editorial_address', 'email',
            'telegram_primary', 'telegram_secondary', 'instagram', 'facebook',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_article_rules_pdf_url(self, obj):
        request = self.context.get('request')
        if obj.article_rules_pdf:
            if request:
                return request.build_absolute_uri(obj.article_rules_pdf.url)
            return obj.article_rules_pdf.url
        return None


class InternationalSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternationalSettings
        fields = [
            'id', 'hero_title', 'hero_description', 'about_text',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class InternationalPartnerSerializer(serializers.ModelSerializer):
    photo_url = serializers.SerializerMethodField()

    class Meta:
        model = InternationalPartner
        fields = [
            'id', 'name', 'country', 'description',
            'photo', 'photo_url', 'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_photo_url(self, obj):
        request = self.context.get('request')
        if obj.photo:
            if request:
                return request.build_absolute_uri(obj.photo.url)
            return obj.photo.url
        return None


class InternationalProjectImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = InternationalProjectImage
        fields = ['id', 'image', 'image_url', 'order']
        read_only_fields = ['id']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class InternationalProjectSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    partners = serializers.SerializerMethodField()
    images = InternationalProjectImageSerializer(many=True, read_only=True)
    title_translated = serializers.SerializerMethodField()
    description_translated = serializers.SerializerMethodField()

    class Meta:
        model = InternationalProject
        fields = [
            'id',
            'title', 'title_ru', 'title_en', 'title_translated',
            'description', 'description_ru', 'description_en', 'description_translated',
            'partners_text', 'partners',
            'start_date', 'end_date', 'status', 'status_display',
            'images', 'order', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_partners(self, obj):
        return [item.strip() for item in obj.partners_text.split(',') if item.strip()]

    def get_title_translated(self, obj):
        return get_translated(obj, 'title', self.context.get('lang', 'uz'))

    def get_description_translated(self, obj):
        return get_translated(obj, 'description', self.context.get('lang', 'uz'))


class InternationalMediaSerializer(serializers.ModelSerializer):
    media_type_display = serializers.CharField(source='get_media_type_display', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = InternationalMedia
        fields = [
            'id', 'title', 'description', 'media_type', 'media_type_display',
            'image', 'image_url', 'youtube_url', 'order', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

from .models import Department, DepartmentTask, DepartmentPost, DepartmentPostImage, DepartmentImage, DepartmentVideo, Pedagogue, PedagogueProject, PedagogueProjectImage

class DepartmentTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentTask
        fields = '__all__'

class DepartmentImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = DepartmentImage
        fields = ['id', 'image', 'image_url', 'order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class DepartmentVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentVideo
        fields = '__all__'




class DepartmentPostImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentPostImage
        fields = '__all__'

class DepartmentPostSerializer(serializers.ModelSerializer):
    images = DepartmentPostImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = DepartmentPost
        fields = '__all__'

class DepartmentSerializer(serializers.ModelSerializer):
    department_tasks = DepartmentTaskSerializer(many=True, read_only=True)
    department_posts = DepartmentPostSerializer(source='posts', many=True, read_only=True)
    images = DepartmentImageSerializer(many=True, read_only=True)
    videos = DepartmentVideoSerializer(many=True, read_only=True)

    class Meta:
        model = Department
        fields = '__all__'

class PedagogueProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedagogueProjectImage
        fields = '__all__'

class PedagogueProjectSerializer(serializers.ModelSerializer):
    images = PedagogueProjectImageSerializer(many=True, read_only=True)
    pedagogue_name = serializers.SerializerMethodField()

    class Meta:
        model = PedagogueProject
        fields = '__all__'

    def get_pedagogue_name(self, obj):
        if obj.pedagogue:
            return obj.pedagogue.full_name or ''
        return ''

class PedagogueSerializer(serializers.ModelSerializer):
    projects = PedagogueProjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedagogue
        fields = '__all__'
