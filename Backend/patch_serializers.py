import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\serializers.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_serializers = """
from .models import Department, Pedagogue, PedagogueProject, PedagogueProjectImage

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class PedagogueProjectImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = PedagogueProjectImage
        fields = '__all__'

class PedagogueProjectSerializer(serializers.ModelSerializer):
    images = PedagogueProjectImageSerializer(many=True, read_only=True)
    
    class Meta:
        model = PedagogueProject
        fields = '__all__'

class PedagogueSerializer(serializers.ModelSerializer):
    projects = PedagogueProjectSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pedagogue
        fields = '__all__'
"""

content += new_serializers

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Serializers appended.")
