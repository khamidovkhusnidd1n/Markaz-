with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import re

# Remove the sections block initialization
content = re.sub(r'              let sections: any\[\] = \[\];.*?              \}\n', '', content, flags=re.DOTALL)

# Remove the sections check in hasMedia/return null
content = content.replace("if (sections.length === 0 && !hasMedia && !detailText) return null;", "if (!hasMedia && !detailText) return null;")

# Remove the accordion rendering
content = re.sub(r'                      \{sections\.length > 0 && \(.*?                      \)\}\n', '', content, flags=re.DOTALL)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
