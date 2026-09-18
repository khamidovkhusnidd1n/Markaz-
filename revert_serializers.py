with open("Backend/core/serializers.py", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove DepartmentSection import
content = content.replace(", DepartmentSection, Pedagogue", ", Pedagogue")

# Remove DepartmentSectionSerializer class
content = re.sub(r'class DepartmentSectionSerializer\(.*?fields = \'__all__\'', '', content, flags=re.DOTALL)

# Remove from DepartmentSerializer
content = content.replace("    sections = DepartmentSectionSerializer(many=True, read_only=True)\n", "")

with open("Backend/core/serializers.py", "w", encoding="utf-8") as f:
    f.write(content)
