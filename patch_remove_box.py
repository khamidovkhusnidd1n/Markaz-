import os
import re

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

giant_box_pattern = r'<div style={{ backgroundColor: \'red\'[\s\S]*?</div>'

content = re.sub(giant_box_pattern, '', content)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Giant box removed")
