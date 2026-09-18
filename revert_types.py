with open("frontend/types.ts", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove DepartmentSection interface
content = re.sub(r'export interface DepartmentSection \{.*?\}\n', '', content, flags=re.DOTALL)

# Remove from Department
content = content.replace("  sections?: DepartmentSection[];\n", "")

with open("frontend/types.ts", "w", encoding="utf-8") as f:
    f.write(content)
