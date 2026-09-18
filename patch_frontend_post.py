import os

with open("frontend/pages/DepartmentPage.tsx", "r", encoding="utf-8") as f:
    content = f.read()

import_news_modal = "import { NewsModal } from '../components/NewsModal';\n"
if "NewsModal" not in content:
    content = content.replace("import { ImageModal }", import_news_modal + "import { ImageModal }")

posts_state = """  const [selectedPost, setSelectedPost] = React.useState<any | null>(null);
"""
if "selectedPost" not in content:
    content = content.replace("const [zoomedImage, setZoomedImage]", posts_state + "  const [zoomedImage, setZoomedImage]")

posts_render = """
      {/* Qilingan ishlar / Posts Section */}
      {dept.department_posts && dept.department_posts.length > 0 && (
        <section className="container mx-auto px-6 py-16">
          <div className="mb-8 border-l-4 border-blue-600 pl-4">
            <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">Qilingan ishlar / Hamkorliklar</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dept.department_posts.map((post: any) => (
              <button
                key={post.id}
                onClick={() => setSelectedPost({
                  id: post.id,
                  title: getLocalizedField(post, 'title'),
                  date: post.date,
                  content: getLocalizedField(post, 'content'),
                  image: post.image || null,
                  images: post.image ? [{ id: 1, imageUrl: post.image }] : []
                })}
                className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition-transform hover:-translate-y-1 hover:shadow-xl text-left flex flex-col"
              >
                <div className="h-40 overflow-hidden bg-slate-200 w-full relative">
                  {post.image ? (
                      <img
                        src={post.image}
                        alt={getLocalizedField(post, 'title')}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                  ) : (
                      <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">Rasm yo'q</div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-sm text-slate-400 mb-2">{post.date}</p>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 line-clamp-2">
                    {getLocalizedField(post, 'title')}
                  </h3>
                  <div className="mt-3 text-sm text-slate-600 line-clamp-3 flex-1 prose prose-sm" 
                       dangerouslySetInnerHTML={{ __html: getLocalizedField(post, 'content') }} />
                  <div className="mt-4 font-bold text-blue-600 text-sm">
                    Batafsil o'qish &rarr;
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {selectedPost && (
        <NewsModal item={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
"""

if "Qilingan ishlar / Posts Section" not in content:
    # Look for the end of the page container, perhaps before </div></div>
    if "{/* Footer padding */}" in content:
        content = content.replace("      {/* Footer padding */}", posts_render + "\n      {/* Footer padding */}")
    else:
        # Just insert before the last closing divs of the main section
        content = content.replace("    </div>\n  );\n};\n\nexport default DepartmentPage;", posts_render + "\n    </div>\n  );\n};\n\nexport default DepartmentPage;")
        
    with open("frontend/pages/DepartmentPage.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Patched DepartmentPage.tsx")
else:
    print("Already patched")
