import os

with open("frontend/services/backend.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "department_tasks: (item.department_tasks || []).map((t: any) => ({",
    "department_posts: item.department_posts || [],\n      department_tasks: (item.department_tasks || []).map((t: any) => ({"
)

with open("frontend/services/backend.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Added department_posts to transformDepartment")
