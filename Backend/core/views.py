"""
DRF Views for the Educational Center Management System.
Cleaned up version with simplified models and improved functionality.
"""
try:
    import pandas as pd
except ImportError:  # pragma: no cover - optional in lightweight setups
    pd = None
from io import BytesIO
import logging
from django.db import transaction
from django.http import JsonResponse
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import (
    News, NewsImage, NewsCategory, GalleryItem, GalleryImage, ArtGalleryItem, Appeal, Application, Listener, Teacher, Personnel,
    Course, JournalIssue, Document, Statistics, YearlyStatistics,
    AppContent, AppHeroImage, JournalSettings, InternationalSettings, InternationalPartner,
    InternationalProject, InternationalProjectImage, InternationalMedia
)
from .serializers import (
    NewsSerializer, NewsCreateSerializer, NewsImageSerializer, NewsCategorySerializer,
    GalleryItemSerializer, ArtGalleryItemSerializer, AppealSerializer, ApplicationSerializer, ListenerSerializer, ListenerBulkImportSerializer,
    TeacherSerializer, PersonnelSerializer, CourseSerializer,
    JournalIssueSerializer, DocumentSerializer, StatisticsSerializer,
    YearlyStatisticsSerializer, AppContentSerializer, JournalSettingsSerializer,
    InternationalSettingsSerializer, InternationalPartnerSerializer,
    InternationalProjectSerializer, InternationalProjectImageSerializer, InternationalMediaSerializer
)

logger = logging.getLogger('core')


def is_static_admin_request(request):
    from django.conf import settings
    auth_header = request.headers.get('Authorization', '')
    expected = f"Bearer {settings.STATIC_ADMIN_TOKEN}"
    return auth_header == expected


def has_admin_access(request):
    user = getattr(request, 'user', None)
    return bool(is_static_admin_request(request) or (user and user.is_staff))


class IsAdminOrReadOnly(permissions.BasePermission):
    """Custom permission: read-only for everyone, write only for admins."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return has_admin_access(request)


class NewsViewSet(viewsets.ModelViewSet):
    """ViewSet for News CRUD operations with inline images."""
    queryset = News.objects.all().order_by('-created_at')
    serializer_class = NewsSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        if has_admin_access(self.request):
            queryset = News.objects.all().order_by('-created_at')
        else:
            queryset = News.objects.filter(is_active=True).order_by('-created_at')
        
        important_only = self.request.query_params.get('important', None)
        if important_only == 'true':
            queryset = queryset.filter(is_important=True)

        show_all = self.request.query_params.get('all', None)
        if show_all != 'true' and not has_admin_access(self.request):
            queryset = queryset.filter(is_active=True)
        
        return queryset

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return NewsCreateSerializer
        return NewsSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'uz')
        return context

    def perform_create(self, serializer):
        serializer.save(is_active=True)

    def create(self, request, *args, **kwargs):
        """Create news with optional images."""
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        news = serializer.save(is_active=True)

        # Handle multiple image upload
        images = request.FILES.getlist('images')
        raw_orders = request.data.getlist('image_orders')
        parsed_orders = []
        for idx, value in enumerate(raw_orders):
            try:
                parsed_orders.append(int(value))
            except (TypeError, ValueError):
                parsed_orders.append(idx)

        for idx, img in enumerate(images):
            image_order = parsed_orders[idx] if idx < len(parsed_orders) else idx
            NewsImage.objects.create(news=news, image=img, order=image_order)

        # Return full serialized response
        response_serializer = NewsSerializer(news, context={'request': request})
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class NewsCategoryViewSet(viewsets.ModelViewSet):
    queryset = NewsCategory.objects.all().order_by('order', 'name')
    serializer_class = NewsCategorySerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(is_active=True)

    @action(detail=True, methods=['post'], parser_classes=[MultiPartParser])
    def add_images(self, request, pk=None):
        """Add images to existing news."""
        news = self.get_object()
        images = request.FILES.getlist('images')
        last_order = news.images.count()

        for idx, img in enumerate(images):
            NewsImage.objects.create(news=news, image=img, order=last_order + idx)

        serializer = NewsSerializer(news, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_active(self, request, pk=None):
        """Toggle the is_active status of a news item."""
        news = self.get_object()
        news.is_active = not news.is_active
        news.save()
        serializer = NewsSerializer(news, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_important(self, request, pk=None):
        """Toggle the is_important status of a news item."""
        news = self.get_object()
        news.is_important = not news.is_important
        news.save()
        serializer = NewsSerializer(news, context={'request': request})
        return Response(serializer.data)


class GalleryItemViewSet(viewsets.ModelViewSet):
    """ViewSet for Gallery CRUD operations - simple images only."""
    queryset = GalleryItem.objects.filter(is_active=True).order_by('order', '-created_at')
    serializer_class = GalleryItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = GalleryItem.objects.all().order_by('order', '-created_at')
        if has_admin_access(self.request):
            return queryset
        return queryset.filter(is_active=True)

    def create(self, request, *args, **kwargs):
        title = request.data.get('title', '')
        order = request.data.get('order', 0)
        cover_image = request.FILES.get('cover_image')
        images = request.FILES.getlist('images')

        if not cover_image and images:
            cover_image = images[0]

        if not cover_image:
            return Response({'detail': 'Muqova rasmi yoki kamida bitta rasm kerak.'}, status=status.HTTP_400_BAD_REQUEST)

        item = GalleryItem.objects.create(
            title=title,
            cover_image=cover_image,
            order=order or 0,
            is_active=True,
        )

        raw_orders = request.data.getlist('image_orders')
        parsed_orders = []
        for idx, value in enumerate(raw_orders):
            try:
                parsed_orders.append(int(value))
            except (TypeError, ValueError):
                parsed_orders.append(idx)

        upload_images = images if images else [cover_image]
        for idx, image in enumerate(upload_images):
            GalleryImage.objects.create(
                gallery=item,
                image=image,
                order=parsed_orders[idx] if idx < len(parsed_orders) else idx,
            )

        serializer = GalleryItemSerializer(item, context={'request': request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def bulk_upload(self, request):
        """Upload multiple images at once."""
        images = request.FILES.getlist('images')
        last_order = GalleryItem.objects.count()
        created = []

        for idx, img in enumerate(images):
            item = GalleryItem.objects.create(cover_image=img, order=last_order + idx)
            created.append(item)

        serializer = GalleryItemSerializer(created, many=True, context={'request': request})
        return Response({
            'success': True,
            'message': f"{len(created)} ta rasm qo'shildi",
            'items': serializer.data
        }, status=status.HTTP_201_CREATED)


class ListenerViewSet(viewsets.ModelViewSet):
    """ViewSet for Listener CRUD operations with MO/QT types."""
    queryset = Listener.objects.all()
    serializer_class = ListenerSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Listener.objects.all()
        record_type = self.request.query_params.get('record_type', None)
        if record_type in ['MO', 'QT']:
            queryset = queryset.filter(record_type=record_type)

        search = self.request.query_params.get('search', None)
        if search:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(full_name__icontains=search) |
                Q(record_type__icontains=search) |
                Q(number__icontains=search) |
                Q(workplace__icontains=search) |
                Q(series__icontains=search) |
                Q(course_type__icontains=search) |
                Q(duration__icontains=search)
            )
        return queryset

    def create(self, request, *args, **kwargs):
        payload = request.data.copy()
        record_type = (payload.get('record_type') or 'MO').upper()
        payload['record_type'] = record_type
        payload['series'] = payload.get('series') or record_type
        serializer = self.get_serializer(data=payload)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search listeners by record_type (MO/QT) and number."""
        series = request.query_params.get('series', '').upper().strip()
        number = request.query_params.get('number', '').strip()

        if not number:
            return Response(
                {'error': 'Raqam kiritilishi shart'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.db.models import Q
        
        listener = None
        
        # Convert series to valid record_type
        record_type = None
        if series in ['MO', 'QT']:
            record_type = series
        
        if record_type:
            # Search by exact record_type and number
            listener = Listener.objects.filter(
                record_type=record_type,
                number__iexact=number
            ).first()
            
            # Try number with leading zeros stripped
            if not listener:
                listener = Listener.objects.filter(
                    record_type=record_type,
                    number__endswith=number.lstrip('0') if number.lstrip('0') else number
                ).first()
            
            # Try number containing
            if not listener:
                listener = Listener.objects.filter(
                    record_type=record_type,
                    number__icontains=number
                ).first()
        else:
            # No record_type specified - search across all
            listener = Listener.objects.filter(number__iexact=number).first()
            
            if not listener:
                listener = Listener.objects.filter(number__icontains=number).first()
            
            if not listener:
                listener = Listener.objects.filter(number__endswith=number).first()

        if listener:
            serializer = ListenerSerializer(listener, context={'request': request})
            return Response({'found': True, 'data': serializer.data})
        return Response({'found': False, 'message': "Ma'lumot topilmadi"})

    @action(detail=False, methods=['post'], parser_classes=[MultiPartParser])
    def bulk_import(self, request):
        """Bulk import listeners from Excel file."""
        if pd is None:
            return Response(
                {'error': "Excel import uchun pandas o'rnatilmagan."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        serializer = ListenerBulkImportSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = serializer.validated_data['file']
        record_type = serializer.validated_data['record_type']

        try:
            # Read all columns as strings to preserve leading zeros
            df = pd.read_excel(BytesIO(file.read()), dtype=str)
            found_columns = list(df.columns)
            print(f"Excel ustunlari: {found_columns}")

            # Flexible column mapping
            column_mapping = {
                'full_name': ['Tinglovchi', 'F.I.SH', 'FIO', 'Ism', 'Ismi', 'F.I.O', 'Familiya'],
                'workplace': ['Asosiy ish joyi', 'Ish joyi', 'Lavozimi', 'Tashkilot', 'Muassasa', 
                              'Ta\'lim muassasasi', 'Qayta tayyorlagan muassasa'],
                'course_type': ['Kursi', 'Kurs', 'Yo\'nalishi', 'Yo\'nalish', 
                               'Qayta tayyorlash kursi', 'Kurs nomi'],
                'series': ['Seriyasi', 'Seriya', 'Sertifikat seriyasi', 'Diplom seriyasi'],
                'number': ['Raqami', 'Raqam', '№', 'Sertifikat raqami', 'Diplom raqami'],
                'duration': ["O'qish muddati (davri)", "O'qish muddati", 'Muddat', 'Davri', 
                            'Kurs davri', 'Boshlanish - tugash'],
            }

            def find_column(possible_names, df_columns):
                df_columns_lower = {col.lower().strip(): col for col in df_columns}
                for name in possible_names:
                    name_lower = name.lower().strip()
                    if name_lower in df_columns_lower:
                        return df_columns_lower[name_lower]
                    for col_lower, col_orig in df_columns_lower.items():
                        if name_lower in col_lower or col_lower in name_lower:
                            return col_orig
                return None

            actual_mapping = {}
            for model_field, possible_names in column_mapping.items():
                found_col = find_column(possible_names, df.columns)
                if found_col:
                    actual_mapping[found_col] = model_field
                    print(f"Topildi: '{found_col}' -> {model_field}")

            created_count = 0
            updated_count = 0
            errors = []

            with transaction.atomic():
                for idx, row in df.iterrows():
                    try:
                        listener_data = {'record_type': record_type}

                        for excel_col, model_field in actual_mapping.items():
                            value = row[excel_col]
                            if pd.notna(value):
                                listener_data[model_field] = str(value).strip()

                        if not listener_data.get('full_name'):
                            continue

                        if not listener_data.get('number'):
                            listener_data['number'] = str(idx + 1).zfill(6)

                        if not listener_data.get('series'):
                            listener_data['series'] = record_type

                        existing = Listener.objects.filter(
                            series=listener_data.get('series', record_type),
                            number=listener_data['number']
                        ).first()

                        if existing:
                            for key, value in listener_data.items():
                                setattr(existing, key, value)
                            existing.save()
                            updated_count += 1
                        else:
                            Listener.objects.create(**listener_data)
                            created_count += 1

                    except Exception as e:
                        errors.append(f"Row {idx + 2}: {str(e)}")

            return Response({
                'success': True,
                'message': f"{created_count} ta yangi yozuv qo'shildi, {updated_count} ta yangilandi.",
                'created': created_count,
                'updated': updated_count,
                'errors': errors[:10] if errors else []
            })

        except Exception as e:
            return Response(
                {'error': f"Faylni o'qishda xatolik: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )


class TeacherViewSet(viewsets.ModelViewSet):
    """ViewSet for Teacher CRUD operations."""
    queryset = Teacher.objects.filter(is_active=True).order_by('order', 'full_name')
    serializer_class = TeacherSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Teacher.objects.all().order_by('order', 'full_name')
        if has_admin_access(self.request):
            return queryset
        return queryset.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'uz')
        return context

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class PersonnelViewSet(viewsets.ModelViewSet):
    """ViewSet for Personnel CRUD operations."""
    queryset = Personnel.objects.filter(is_active=True).order_by('order', 'full_name')
    serializer_class = PersonnelSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Personnel.objects.all()
        if not has_admin_access(self.request):
            queryset = queryset.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        if category in ['leadership', 'staff']:
            queryset = queryset.filter(category=category)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'uz')
        return context

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet for Course CRUD operations."""
    queryset = Course.objects.filter(is_active=True).order_by('order', 'title')
    serializer_class = CourseSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Course.objects.all()
        if not has_admin_access(self.request):
            queryset = queryset.filter(is_active=True)
        course_type = self.request.query_params.get('type', None)
        if course_type in [
            'professional_development',
            'retraining',
            'short_professional_development',
            'profession_learning',
        ]:
            queryset = queryset.filter(course_type=course_type)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'uz')
        return context

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class JournalIssueViewSet(viewsets.ModelViewSet):
    """ViewSet for JournalIssue CRUD operations."""
    queryset = JournalIssue.objects.filter(is_active=True).order_by('-year', '-created_at')
    serializer_class = JournalIssueSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = JournalIssue.objects.all().order_by('-year', '-created_at')
        if has_admin_access(self.request):
            return queryset
        return queryset.filter(is_active=True)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'uz')
        return context

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class DocumentViewSet(viewsets.ModelViewSet):
    """ViewSet for Document CRUD operations."""
    queryset = Document.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = DocumentSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = Document.objects.all()
        if not has_admin_access(self.request):
            queryset = queryset.filter(is_active=True)
        category = self.request.query_params.get('category', None)
        if category in ['regulatory', 'plan', 'open_data', 'library']:
            queryset = queryset.filter(category=category)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['lang'] = self.request.query_params.get('lang', 'uz')
        return context

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class StatisticsViewSet(viewsets.ViewSet):
    """ViewSet for Statistics (singleton model)."""
    permission_classes = [IsAdminOrReadOnly]

    def list(self, request):
        stats = Statistics.get_instance()
        serializer = StatisticsSerializer(stats, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        stats = Statistics.get_instance()
        serializer = StatisticsSerializer(stats, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class YearlyStatisticsViewSet(viewsets.ModelViewSet):
    """ViewSet for YearlyStatistics CRUD operations."""
    queryset = YearlyStatistics.objects.all().order_by('-year')
    serializer_class = YearlyStatisticsSerializer
    permission_classes = [IsAdminOrReadOnly]


class AppContentViewSet(viewsets.ViewSet):
    """ViewSet for AppContent (singleton model) - Markaz haqida."""
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request):
        content = AppContent.get_instance()
        serializer = AppContentSerializer(content, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        content = AppContent.get_instance()
        serializer = AppContentSerializer(content, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()

            hero_images = request.FILES.getlist('hero_images')
            raw_orders = request.data.getlist('hero_image_orders')
            if hero_images:
                content.hero_images.all().delete()
                parsed_orders = []
                for idx, value in enumerate(raw_orders):
                    try:
                        parsed_orders.append(int(value))
                    except (TypeError, ValueError):
                        parsed_orders.append(idx)
                for idx, image in enumerate(hero_images):
                    AppHeroImage.objects.create(
                        content=content,
                        image=image,
                        order=parsed_orders[idx] if idx < len(parsed_orders) else idx,
                    )

            serializer = AppContentSerializer(content, context={'request': request})
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class JournalSettingsViewSet(viewsets.ViewSet):
    """ViewSet for JournalSettings (singleton model) - Jurnal sozlamalari."""
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request):
        settings = JournalSettings.get_instance()
        serializer = JournalSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        settings = JournalSettings.get_instance()
        serializer = JournalSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InternationalSettingsViewSet(viewsets.ViewSet):
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def list(self, request):
        settings = InternationalSettings.get_instance()
        serializer = InternationalSettingsSerializer(settings, context={'request': request})
        return Response(serializer.data)

    def create(self, request):
        settings = InternationalSettings.get_instance()
        serializer = InternationalSettingsSerializer(settings, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InternationalPartnerViewSet(viewsets.ModelViewSet):
    queryset = InternationalPartner.objects.all().order_by('order', 'name')
    serializer_class = InternationalPartnerSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = InternationalPartner.objects.all().order_by('order', 'name')
        if has_admin_access(self.request):
            return queryset
        return queryset.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class InternationalProjectViewSet(viewsets.ModelViewSet):
    queryset = InternationalProject.objects.all().order_by('order', '-start_date')
    serializer_class = InternationalProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = InternationalProject.objects.all().order_by('order', '-start_date')
        if has_admin_access(self.request):
            return queryset
        return queryset.filter(is_active=True)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        project = serializer.save(is_active=True)

        images = request.FILES.getlist('images')
        raw_orders = request.data.getlist('image_orders') if hasattr(request.data, 'getlist') else request.data.get('image_orders', [])
        if not isinstance(raw_orders, list):
            raw_orders = [raw_orders] if raw_orders not in [None, ''] else []
        parsed_orders = []
        for idx, value in enumerate(raw_orders):
            try:
                parsed_orders.append(int(value))
            except (TypeError, ValueError):
                parsed_orders.append(idx)

        for idx, image in enumerate(images):
            image_order = parsed_orders[idx] if idx < len(parsed_orders) else idx
            InternationalProjectImage.objects.create(
                project=project,
                image=image,
                order=image_order,
            )

        return Response(
            InternationalProjectSerializer(project, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


class InternationalMediaViewSet(viewsets.ModelViewSet):
    queryset = InternationalMedia.objects.all().order_by('order', '-created_at')
    serializer_class = InternationalMediaSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = InternationalMedia.objects.all().order_by('order', '-created_at')
        if has_admin_access(self.request):
            return queryset
        media_type = self.request.query_params.get('media_type')
        if media_type in ['photo', 'video']:
            queryset = queryset.filter(media_type=media_type)
        return queryset.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class ArtGalleryItemViewSet(viewsets.ModelViewSet):
    queryset = ArtGalleryItem.objects.all().order_by('order', '-created_at')
    serializer_class = ArtGalleryItemSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        queryset = ArtGalleryItem.objects.all().order_by('order', '-created_at')
        if has_admin_access(self.request):
            return queryset
        return queryset.filter(is_active=True)

    def perform_create(self, serializer):
        serializer.save(is_active=True)


class AppealViewSet(viewsets.ModelViewSet):
    queryset = Appeal.objects.all().order_by('-created_at')
    serializer_class = AppealSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [IsAdminOrReadOnly()]


class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all().order_by('-created_at')
    serializer_class = ApplicationSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        return [IsAdminOrReadOnly()]


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_all_data(request):
    """
    Get all data for initial frontend load.
    Returns all active content in a single request.
    """
    logger.info("All data requested from %s", request.META.get('REMOTE_ADDR'))
    lang = request.query_params.get('lang', 'uz')
    ctx = {'request': request, 'lang': lang}
    try:
        data = {
            'news': NewsSerializer(
                News.objects.filter(is_active=True).order_by('-created_at'),
                many=True,
                context=ctx
            ).data,
            'gallery': GalleryItemSerializer(
                GalleryItem.objects.filter(is_active=True).order_by('order', '-created_at'),
                many=True,
                context=ctx
            ).data,
            'artGallery': ArtGalleryItemSerializer(
                ArtGalleryItem.objects.filter(is_active=True).order_by('order', '-created_at'),
                many=True,
                context=ctx
            ).data,
            'appeals': AppealSerializer(
                Appeal.objects.all().order_by('-created_at') if has_admin_access(request) else Appeal.objects.none(),
                many=True,
                context=ctx
            ).data,
            'applications': ApplicationSerializer(
                Application.objects.all().order_by('-created_at') if has_admin_access(request) else Application.objects.none(),
                many=True,
                context=ctx
            ).data,
            'teachers': TeacherSerializer(
                Teacher.objects.filter(is_active=True).order_by('order', 'full_name'),
                many=True,
                context=ctx
            ).data,
            'courses': CourseSerializer(
                Course.objects.filter(is_active=True).order_by('order', 'title'),
                many=True,
                context=ctx
            ).data,
            'personnel': PersonnelSerializer(
                Personnel.objects.filter(is_active=True).order_by('order', 'full_name'),
                many=True,
                context=ctx
            ).data,
            'stats': StatisticsSerializer(
                Statistics.get_instance(),
                context=ctx
            ).data,
            'documents': DocumentSerializer(
                Document.objects.filter(is_active=True).order_by('-created_at'),
                many=True,
                context=ctx
            ).data,
            'listeners': ListenerSerializer(
                Listener.objects.all().order_by('-created_at'),
                many=True,
                context=ctx
            ).data,
            'journalIssues': JournalIssueSerializer(
                JournalIssue.objects.filter(is_active=True).order_by('-year', '-created_at'),
                many=True,
                context=ctx
            ).data,
            'about': AppContentSerializer(
                AppContent.get_instance(),
                context=ctx
            ).data,
            'journalSettings': JournalSettingsSerializer(
                JournalSettings.get_instance(),
                context=ctx
            ).data,
            'internationalSettings': InternationalSettingsSerializer(
                InternationalSettings.get_instance(),
                context=ctx
            ).data,
            'internationalPartners': InternationalPartnerSerializer(
                InternationalPartner.objects.filter(is_active=True).order_by('order', 'name'),
                many=True,
                context=ctx
            ).data,
            'internationalProjects': InternationalProjectSerializer(
                InternationalProject.objects.filter(is_active=True).order_by('order', '-start_date'),
                many=True,
                context=ctx
            ).data,
            'internationalMedia': InternationalMediaSerializer(
                InternationalMedia.objects.filter(is_active=True).order_by('order', '-created_at'),
                many=True,
                context=ctx
            ).data,
        }
        return Response(data)
    except Exception:
        logger.exception("All data endpoint failed")
        return Response(
            {'detail': "Ma'lumotlarni yuklashda xatolik yuz berdi."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def custom_login(request):
    """
    Custom login endpoint for backward compatibility.
    """
    username = request.data.get('username')
    password = request.data.get('password')

    logger.info("Login attempt for username=%s from ip=%s", username, request.META.get('REMOTE_ADDR'))

    from django.conf import settings

    if username == settings.STATIC_ADMIN_USERNAME and password == settings.STATIC_ADMIN_PASSWORD:
        logger.info("Static admin login succeeded for username=%s", username)
        return Response({
            'success': True,
            'token': settings.STATIC_ADMIN_TOKEN,
            'refresh': '',
        })

    from django.contrib.auth import authenticate
    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        from rest_framework_simplejwt.tokens import RefreshToken
        refresh = RefreshToken.for_user(user)
        logger.info("Django admin login succeeded for username=%s", username)
        return Response({
            'success': True,
            'token': str(refresh.access_token),
            'refresh': str(refresh),
        })

    logger.warning("Login failed for username=%s", username)

    return Response(
        {'success': False, 'message': "Login yoki parol noto'g'ri!"},
        status=status.HTTP_401_UNAUTHORIZED
    )
