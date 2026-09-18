with open("Backend/core/models.py", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove DepartmentSection model
content = re.sub(r'\n+class DepartmentSection\(BaseModel\):.*?(?=\nclass Pedagogue\()', '\n\n', content, flags=re.DOTALL)

with open("Backend/core/models.py", "w", encoding="utf-8") as f:
    f.write(content)
