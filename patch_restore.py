import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "{true && (\n\n\n        <section",
    "{dept.department_posts && dept.department_posts.length > 0 && (\n        <section"
)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Restored")
