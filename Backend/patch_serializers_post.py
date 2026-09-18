import os

with open("Backend/core/serializers.py", "r", encoding="utf-8") as f:
    content = f.read()

new_serializer = """
class DepartmentPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = DepartmentPost
        fields = '__all__'
"""

if "class DepartmentPostSerializer" not in content:
    # 1. Add model import
    content = content.replace("DepartmentTask,", "DepartmentTask, DepartmentPost,")
    
    # 2. Insert new serializer before DepartmentSerializer
    content = content.replace("class DepartmentSerializer", new_serializer + "\nclass DepartmentSerializer")
    
    # 3. Add to DepartmentSerializer
    field_to_add = "    department_posts = DepartmentPostSerializer(source='posts', many=True, read_only=True)\n"
    content = content.replace("    images = DepartmentImageSerializer", field_to_add + "    images = DepartmentImageSerializer")
    
    with open("Backend/core/serializers.py", "w", encoding="utf-8") as f:
        f.write(content)
    print("Added DepartmentPostSerializer")
else:
    print("Already exists")
