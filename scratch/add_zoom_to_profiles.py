import re
import os

files_to_patch = [
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/ScientificPotential.tsx",
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/DepartmentPage.tsx",
    "c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Departments.tsx",
]

for file_path in files_to_patch:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Import ImageModal and ZoomIn
    if "import { ImageModal }" not in content:
        content = content.replace("import { useTranslation } from 'react-i18next';", "import { useTranslation } from 'react-i18next';\nimport { ImageModal } from '../components/ImageModal';")
        content = content.replace("import { ArrowLeft, Users, X } from 'lucide-react';", "import { ArrowLeft, Users, X, ZoomIn } from 'lucide-react';")
        content = content.replace("import { ArrowLeft, Users, Briefcase, Eye, ChevronRight, Download, Book, Mail, Phone, Clock, FileText, ChevronDown, ChevronUp, X } from 'lucide-react';", 
                                  "import { ArrowLeft, Users, Briefcase, Eye, ChevronRight, Download, Book, Mail, Phone, Clock, FileText, ChevronDown, ChevronUp, X, ZoomIn } from 'lucide-react';")

    # Add state
    if "const [zoomedImage, setZoomedImage]" not in content:
        content = content.replace("const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);",
                                  "const [selectedTeacher, setSelectedTeacher] = useState<any | null>(null);\n  const [zoomedImage, setZoomedImage] = useState<string | null>(null);")
        content = content.replace("const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);",
                                  "const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null);\n  const [zoomedImage, setZoomedImage] = useState<string | null>(null);")

    # Replace img with zoomable container
    # For ScientificPotential
    if "selectedTeacher.photoUrl" in content:
        img_tag = r'<img\s+src=\{selectedTeacher\.photoUrl \|\| [^\}]+\}\s+alt=\{selectedTeacher\.fullName\}\s+className="w-full md:w-1/3 aspect-square object-cover rounded-2xl shadow-sm"\s+/>'
        replacement = """<div 
                  className="w-full md:w-1/3 relative group cursor-pointer"
                  onClick={() => setZoomedImage(selectedTeacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz')}
                >
                  <img 
                    src={selectedTeacher.photoUrl || 'https://via.placeholder.com/400x400?text=Ustoz'} 
                    alt={selectedTeacher.fullName} 
                    className="w-full aspect-square object-cover rounded-2xl shadow-sm transition-transform group-hover:scale-[1.02]" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                    <div className="bg-white/90 text-slate-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-xl">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>"""
        content = re.sub(img_tag, replacement, content)

    # For DepartmentPage / Departments
    if "selectedPerson.photoUrl" in content:
        img_tag2 = r'<img\s+src=\{selectedPerson\.photoUrl \|\| [^\}]+\}\s+alt=\{selectedPerson\.fullName(?:_ru|_en)?\}\s+className="w-full md:w-1/3 aspect-square object-cover rounded-2xl shadow-sm"\s+/>'
        replacement2 = """<div 
                  className="w-full md:w-1/3 relative group cursor-pointer shrink-0"
                  onClick={() => setZoomedImage(selectedPerson.photoUrl || 'https://via.placeholder.com/400x400?text=Xodim')}
                >
                  <img 
                    src={selectedPerson.photoUrl || 'https://via.placeholder.com/400x400?text=Xodim'} 
                    alt={selectedPerson.fullName} 
                    className="w-full aspect-square object-cover rounded-2xl shadow-sm transition-transform group-hover:scale-[1.02]" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                    <div className="bg-white/90 text-slate-900 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all transform scale-90 group-hover:scale-100 shadow-xl">
                      <ZoomIn size={24} />
                    </div>
                  </div>
                </div>"""
        content = re.sub(img_tag2, replacement2, content)

    # Add Modal at the end
    if "<ImageModal" not in content:
        content = content.replace("    </div>\n  );\n};",
                                  "      <ImageModal \n        imageUrl={zoomedImage || ''}\n        isOpen={!!zoomedImage}\n        onClose={() => setZoomedImage(null)}\n      />\n    </div>\n  );\n};")

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Done profiles")
