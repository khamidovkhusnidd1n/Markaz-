import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

log_str = "  console.log('DEPARTMENT:', dept?.name, 'POSTS:', dept?.department_posts);\n"
if "console.log('DEPARTMENT:'" not in content:
    content = content.replace("  if (!dept) {", log_str + "  if (!dept) {")
    with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
        f.write(content)
print("Log added")
