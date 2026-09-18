import re

file_path = r'C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\Portfolio.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add state
content = content.replace(
    "const [selectedPedagogue, setSelectedPedagogue] = useState<any>(null);",
    "const [selectedPedagogue, setSelectedPedagogue] = useState<any>(null);\n  const [selectedProject, setSelectedProject] = useState<any>(null);"
)

# Add onClick to project card in selectedPedagogue
content = content.replace(
    '''                    <div 
                      key={project.id} 
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all 
duration-300 flex flex-col"
                      onMouseEnter={() => handleView(project.id)}
                    >''',
    '''                    <div 
                      key={project.id} 
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                      onMouseEnter={() => handleView(project.id)}
                      onClick={() => setSelectedProject(fullProject)}
                    >'''
)

# Add onClick to project card in all projects
content = content.replace(
    '''                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all 
duration-300 flex flex-col"
                    onMouseEnter={() => handleView(project.id)}
                  >''',
    '''                  <div 
                    key={project.id} 
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
                    onMouseEnter={() => handleView(project.id)}
                    onClick={() => setSelectedProject(project)}
                  >'''
)

# Add ProjectModal
# I will append it before the final closing div (or just before return end)
modal_jsx = '''
      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProject(null)}>
          <div 
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b flex justify-between items-center bg-gray-50 sticky top-0 z-10">
              <h3 className="text-xl font-bold">{getLocalizedField(selectedProject, 'title')}</h3>
              <button 
                onClick={() => setSelectedProject(null)}
                className="text-gray-500 hover:text-red-500 transition-colors p-2"
              >
                Yopish (X)
              </button>
            </div>
            <div className="p-0">
              {/* Reuse ImageCarousel but make it larger */}
              {selectedProject.images && selectedProject.images.length > 0 ? (
                <div className="h-96 w-full relative bg-black">
                  <ImageCarousel images={selectedProject.images} />
                </div>
              ) : (
                <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                  <Briefcase size={64} className="text-gray-300" />
                </div>
              )}
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 border-b pb-4">
                <div className="flex items-center gap-1 text-gray-500">
                  <Eye size={20} />
                  <span className="font-medium">{selectedProject.views_count}</span>
                </div>
                <button 
                  onClick={(e) => handleVote(e, selectedProject.id)}
                  className={`flex items-center gap-2 font-semibold px-4 py-2 rounded-full transition-colors ${
                    votedProjects.has(selectedProject.id)
                      ? 'bg-violet-100 text-violet-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <ThumbsUp size={20} className={votedProjects.has(selectedProject.id) ? 'fill-current' : ''} />
                  <span>{selectedProject.votes_count}</span>
                </button>
              </div>
              
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Loyiha tavsifi:</h4>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {getLocalizedField(selectedProject, 'description') || 'Tavsif kiritilmagan.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
'''

content = content.replace("    </div>\n  );\n};\n\nexport default Portfolio;", modal_jsx + "\n    </div>\n  );\n};\n\nexport default Portfolio;")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Portfolio.tsx updated')
