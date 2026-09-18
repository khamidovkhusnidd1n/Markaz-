import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\views.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add viewsets
viewsets_code = """
from .models import Department, Pedagogue, PedagogueProject
from .serializers import DepartmentSerializer, PedagogueSerializer, PedagogueProjectSerializer
from rest_framework.decorators import action

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all().order_by('order', '-created_at')
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.AllowAny]

class PedagogueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pedagogue.objects.all().order_by('order', '-created_at')
    serializer_class = PedagogueSerializer
    permission_classes = [permissions.AllowAny]

class PedagogueProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PedagogueProject.objects.all().order_by('-votes_count', '-created_at')
    serializer_class = PedagogueProjectSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=True, methods=['post'])
    def view(self, request, pk=None):
        project = self.get_object()
        project.views_count += 1
        project.save(update_fields=['views_count'])
        return Response({'views_count': project.views_count})

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        project = self.get_object()
        project.votes_count += 1
        project.save(update_fields=['votes_count'])
        return Response({'votes_count': project.votes_count})
"""
content = re.sub(r'class NewsViewSet', viewsets_code + '\nclass NewsViewSet', content, count=1)

# Add to get_all_data
all_data_code = """            'departments': DepartmentSerializer(
                Department.objects.all().order_by('order', '-created_at'),
                many=True,
                context=ctx
            ).data,
            'pedagogues': PedagogueSerializer(
                Pedagogue.objects.all().order_by('order', '-created_at'),
                many=True,
                context=ctx
            ).data,
            'pedagogueProjects': PedagogueProjectSerializer(
                PedagogueProject.objects.all().order_by('-votes_count', '-created_at'),
                many=True,
                context=ctx
            ).data,
            'internationalMedia': InternationalMediaSerializer"""
content = re.sub(r"            'internationalMedia': InternationalMediaSerializer", all_data_code, content, count=1)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Views patched.")
