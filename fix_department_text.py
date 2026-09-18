import re
import os

files = [
    "frontend/pages/DepartmentPage.tsx",
    "frontend/pages/Departments.tsx"
]

for filepath in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove parseDetailText completely
    content = re.sub(r'const parseDetailText =.*?};\n', '', content, flags=re.DOTALL)
    
    # In DepartmentPage.tsx:
    content = re.sub(
        r'let sections = \[\];\s*if \(dept\.department_tasks && dept\.department_tasks\.length > 0\) \{.*?\} else if \(detailText\) \{\s*sections = parseDetailText\(detailText\);\s*\}',
        r'''let sections: any[] = [];
              if (dept.department_tasks && dept.department_tasks.length > 0) {
                sections = dept.department_tasks.map(task => ({
                  title: getLocalizedField(task, 'title') || 'Ma\\'lumot',
                  content: getLocalizedField(task, 'task_text')
                }));
              }''',
        content, flags=re.DOTALL
    )

    # In Departments.tsx:
    content = re.sub(
        r'let sections = \[\];\s*if \(currentTab\.department_tasks && currentTab\.department_tasks\.length > 0\) \{.*?\} else if \(detailText\) \{\s*sections = parseDetailText\(detailText\);\s*\}',
        r'''let sections: any[] = [];
                    if (currentTab.department_tasks && currentTab.department_tasks.length > 0) {
                      sections = currentTab.department_tasks.map((task: any) => ({
                        title: getLocalizedField(task, 'title') || 'Ma\\'lumot',
                        content: getLocalizedField(task, 'task_text')
                      }));
                    }''',
        content, flags=re.DOTALL
    )

    # In DepartmentPage.tsx:
    content = content.replace(
        '{/* Accordion List */}\n                    <div className={hasMedia ? "lg:col-span-3 space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>',
        '{/* Detail Text */}\n                    <div className={hasMedia ? "lg:col-span-3 space-y-4" : "w-full"}>\n                      {detailText && (\n                        <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: detailText }} />\n                      )}\n                      {/* Accordion List */}\n                      {sections.length > 0 && (\n                        <div className="grid grid-cols-1 gap-4">'
    )
    content = content.replace(
        '</div>\n                    </div>\n\n                    {/* Media Gallery */}',
        '</div>\n                      )}\n                    </div>\n\n                    {/* Media Gallery */}'
    )

    # In Departments.tsx:
    content = content.replace(
        '{/* Accordion List */}\n                          <div className={hasMedia ? "lg:col-span-3 space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-4"}>',
        '{/* Detail Text */}\n                          <div className={hasMedia ? "lg:col-span-3 space-y-4" : "w-full"}>\n                            {detailText && (\n                              <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: detailText }} />\n                            )}\n                            {/* Accordion List */}\n                            {sections.length > 0 && (\n                              <div className="grid grid-cols-1 gap-4">'
    )
    content = content.replace(
        '</div>\n                          </div>\n\n                          {/* Media Gallery */}',
        '</div>\n                            )}\n                          </div>\n\n                          {/* Media Gallery */}'
    )
    
    # Fix the condition `if (sections.length === 0 && !hasMedia) return null;` to include detailText
    content = content.replace(
        'if (sections.length === 0 && !hasMedia) return null;',
        'if (sections.length === 0 && !hasMedia && !detailText) return null;'
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

print("Fixed department text")
