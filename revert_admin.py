with open("Backend/core/admin.py", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove DepartmentSection import
content = content.replace(", DepartmentSection, Pedagogue", ", Pedagogue")

# Remove DepartmentSectionInline class
content = re.sub(r'class DepartmentSectionInline\(.*?return super\(\)\.formfield_for_dbfield\(db_field, request, \*\*kwargs\)', '', content, flags=re.DOTALL)

# Remove from inlines
content = content.replace("DepartmentTaskInline, DepartmentSectionInline, DepartmentImageInline", "DepartmentTaskInline, DepartmentImageInline")

with open("Backend/core/admin.py", "w", encoding="utf-8") as f:
    f.write(content)
