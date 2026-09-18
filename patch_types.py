import os

with open("frontend/types.ts", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    "department_tasks?: DepartmentTask[];",
    "department_posts?: any[];\n  department_tasks?: DepartmentTask[];"
)

with open("frontend/types.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Updated types.ts")
