import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace condition safely
content = content.replace(
    "{dept.department_posts && dept.department_posts.length > 0 && (",
    "{true && (\n"
)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Condition forced to true")
