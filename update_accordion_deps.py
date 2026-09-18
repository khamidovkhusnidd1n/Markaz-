with open("frontend/pages/Departments.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Replace the sections build logic (from department_tasks) with dept.sections
old = """                    let sections: any[] = [];
                    if (target.department_tasks && target.department_tasks.length > 0) {
                      sections = target.department_tasks.map((task: any) => ({
                        title: getLocalizedField(task, 'title') || 'Ma\\'lumot',
                        content: getLocalizedField(task, 'task_text')
                      }));
                    }"""

new = """                    let sections: any[] = [];
                    if (target.sections && target.sections.length > 0) {
                      sections = [...target.sections].sort((a: any, b: any) => a.order - b.order).map((sec: any) => ({
                        title: getLocalizedField(sec, 'title') || 'Ma\\'lumot',
                        content: getLocalizedField(sec, 'content')
                      }));
                    }"""

content = content.replace(old, new)
with open("frontend/pages/Departments.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Departments done:", old in open("frontend/pages/Departments.tsx", encoding="utf-8").read())
