import re
import os

def patch_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add useState
    content = re.sub(r"import React from 'react';", "import React, { useState } from 'react';", content)
    
    # 2. Add X to lucide-react imports
    if 'X' not in content[:500]:
        content = re.sub(r"import { (.*?) } from 'lucide-react';", r"import { \1, X } from 'lucide-react';", content)
    
    # 3. Add selectedTeacher state
    state_code = "  const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);\n\n"
    content = re.sub(r"  const { t } = useTranslation\(\);\n", r"  const { t } = useTranslation();\n" + state_code, content)
    
    # 4. Make card clickable
    card_pattern = r"className=\"group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col\""
    card_replacement = r"""className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col cursor-pointer"
              onClick={() => setSelectedTeacher(teacher)}"""
    content = re.sub(card_pattern, card_replacement, content)
    
    # 5. Add Modal before the last </div>
    modal_code = """
      {/* Teacher Biography Modal */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedTeacher(null)}>
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-2xl font-black text-slate-900">{selectedTeacher.fullName}</h3>
              <button 
                onClick={() => setSelectedTeacher(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-6 mb-8">
                <img 
                  src={selectedTeacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz'} 
                  alt={selectedTeacher.fullName} 
                  className="w-full md:w-1/3 aspect-square object-cover rounded-2xl shadow-sm" 
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.position', 'Lavozimi')}</p>
                    <p className="text-lg font-bold text-blue-600">{selectedTeacher.position_translated || selectedTeacher.position}</p>
                  </div>
                  
                  {selectedTeacher.degree && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.academic_degree', 'Ilmiy darajasi')}</p>
                      <p className="text-slate-900 font-medium">{selectedTeacher.degree_translated || selectedTeacher.degree}</p>
                    </div>
                  )}
                  
                  {selectedTeacher.title && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.academic_title', 'Ilmiy unvoni')}</p>
                      <p className="text-slate-900 font-medium">{selectedTeacher.title_translated || selectedTeacher.title}</p>
                    </div>
                  )}
                  
                  {selectedTeacher.awards && (
                    <div>
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{t('sci_potential.awards', 'Mukofotlari')}</p>
                      <p className="text-slate-900 font-medium">{selectedTeacher.awards_translated || selectedTeacher.awards}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Biography Section */}
              <div>
                <h4 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                  {t('sci_potential.biography', 'Biografiyasi')}
                </h4>
                <div className="prose prose-slate max-w-none">
                  {selectedTeacher.biography_translated || selectedTeacher.biography ? (
                    <div dangerouslySetInnerHTML={{ __html: (selectedTeacher.biography_translated || selectedTeacher.biography).replace(/\\n/g, '<br/>') }} />
                  ) : (
                    <p className="text-slate-400 italic">{t('sci_potential.no_biography', 'Biografiya kiritilmagan.')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
"""
    content = content.replace("    </div>\n  );\n};\n", modal_code + "    </div>\n  );\n};\n")
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"{os.path.basename(filepath)} patched.")

patch_file(r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\ScientificPotential.tsx")
patch_file(r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\frontend\pages\Teachers.tsx")
