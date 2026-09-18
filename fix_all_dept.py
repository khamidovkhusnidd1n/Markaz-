
# Fix 1: DepartmentPage.tsx - dangerouslySetInnerHTML for task_text + restore accordion

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix task_text in department_tasks cards
content = content.replace(
    '<p className="text-gray-700 leading-relaxed font-medium">{taskText}</p>',
    '<div className="text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: taskText }} />'
)

# Fix plain text task rendering 
content = content.replace(
    '<p className="text-gray-700 leading-relaxed font-medium">{task}</p>',
    '<div className="text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: task }} />'
)

# Restore accordion after detailText block (find the </div> that closes the "Detail Text" left col)
old_detail_close = '''                      {detailText && (
                        <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: detailText }} />
                      )}
                    </div>'''

new_detail_with_accordion = '''                      {detailText && (
                        <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: detailText }} />
                      )}

                      {dept.department_tasks && dept.department_tasks.filter((t: any) => getLocalizedField(t, 'title')).length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                          {[...dept.department_tasks].filter((t: any) => getLocalizedField(t, 'title')).sort((a: any, b: any) => a.order - b.order).map((task: any, idx: number) => {
                            const isOpen = openSectionIdx === idx;
                            return (
                              <div key={task.id} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 bg-white h-fit">
                                <button
                                  onClick={() => setOpenSectionIdx(isOpen ? null : idx)}
                                  className={`w-full text-left p-5 font-bold text-base md:text-lg flex justify-between items-center transition-colors duration-300 gap-4 ${
                                    isOpen
                                      ? 'bg-blue-50/75 text-blue-900 border-b border-blue-100/50'
                                      : 'bg-white text-slate-800 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{getLocalizedField(task, 'title')}</span>
                                  <span className={`transform transition-transform duration-300 text-blue-600 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} />
                                  </span>
                                </button>
                                {isOpen && (
                                  <div className="p-6 bg-white prose prose-blue max-w-none text-slate-600 leading-relaxed font-normal">
                                    <div dangerouslySetInnerHTML={{ __html: getLocalizedField(task, 'task_text') }} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>'''

content = content.replace(old_detail_close, new_detail_with_accordion)

with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("DepartmentPage done")
