import re
import os

def rewrite_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    start_str = '{/* Detailed Info */}'
    end_str = '          </div>\n        </div>\n      </div>'
    
    start_idx = content.find(start_str)
    end_idx = content.find(end_str, start_idx)
    
    if start_idx == -1 or end_idx == -1:
        print(f"Could not find bounds in {filepath}")
        return

    replacement = """{/* Detailed Info */}
            {(() => {
              const target = typeof dept !== 'undefined' ? dept : currentTab;
              const detailText = getLocalizedField(target, 'detail_text');
              
              // Gather all images
              const allImages: string[] = [];
              if (target.detail_image) allImages.push(getImageUrl(target.detail_image));
              if (target.images && target.images.length > 0) {
                [...target.images].sort((a, b) => a.order - b.order).forEach((img: any) => {
                  if (img.image_url) allImages.push(img.image_url);
                });
              }

              // Gather all videos
              const allVideos: string[] = [];
              if (target.detail_video_url) allVideos.push(target.detail_video_url);
              if (target.videos && target.videos.length > 0) {
                [...target.videos].sort((a, b) => a.order - b.order).forEach((v: any) => {
                  if (v.video_url) allVideos.push(v.video_url);
                });
              }

              let sections: any[] = [];
              if (target.department_tasks && target.department_tasks.length > 0) {
                sections = target.department_tasks.map((task: any) => ({
                  title: getLocalizedField(task, 'title') || 'Ma\\'lumot',
                  content: getLocalizedField(task, 'task_text')
                }));
              }

              const hasMedia = allImages.length > 0 || allVideos.length > 0;

              // Do not render section if there are no sections and no media and no text
              if (sections.length === 0 && !hasMedia && !detailText) return null;

              return (
                <div className="mt-10 pt-10 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Batafsil ma'lumot</h3>
                  <div className={hasMedia ? "grid grid-cols-1 lg:grid-cols-5 gap-8 items-start" : "w-full"}>
                    
                    {/* Detail Text & Accordion */}
                    <div className={hasMedia ? "lg:col-span-3 space-y-4" : "w-full"}>
                      
                      {detailText && (
                        <div className="prose prose-blue max-w-none text-gray-700 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm" dangerouslySetInnerHTML={{ __html: detailText }} />
                      )}

                      {sections.length > 0 && (
                        <div className="grid grid-cols-1 gap-4">
                          {sections.map((section, idx) => {
                            const isOpen = openSectionIdx === idx;
                            return (
                              <div key={idx} className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-all duration-300 bg-white h-fit">
                                <button
                                  onClick={() => setOpenSectionIdx(isOpen ? null : idx)}
                                  className={`w-full text-left p-5 font-bold text-base md:text-lg flex justify-between items-center transition-colors duration-300 gap-4 ${
                                    isOpen 
                                      ? 'bg-blue-50/75 text-blue-900 border-b border-blue-100/50' 
                                      : 'bg-white text-slate-800 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{section.title}</span>
                                  <span className={`transform transition-transform duration-300 text-blue-600 shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
                                    <ChevronDown size={20} />
                                  </span>
                                </button>
                                {isOpen && (
                                  <div className="p-6 bg-white prose prose-blue max-w-none text-slate-600 leading-relaxed font-normal">
                                    <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Media Right Column */}
                    {hasMedia && (
                      <div className="lg:col-span-2 space-y-6 w-full max-w-md mx-auto">
                        
                        {/* Images Carousel */}
                        {allImages.length > 0 && (
                          <div className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-slate-50 p-2 flex items-center justify-center aspect-video lg:aspect-[4/3] w-full">
                            <img
                              src={allImages[currentImgIdx]}
                              alt={`${getLocalizedField(target, 'name')} - ${currentImgIdx + 1}`}
                              className="max-w-full max-h-full object-contain rounded-xl transition-all duration-500"
                            />
                            {allImages.length > 1 && (
                              <>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ChevronLeft size={18} />
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setCurrentImgIdx(prev => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ChevronRight size={18} />
                                </button>
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/35 px-2.5 py-1 rounded-full backdrop-blur-sm">
                                  {allImages.map((_, i) => (
                                    <button
                                      key={i}
                                      onClick={() => setCurrentImgIdx(i)}
                                      className={`w-1.5 h-1.5 rounded-full transition-all ${currentImgIdx === i ? 'bg-white w-3' : 'bg-white/50'}`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {/* Videos List */}
                        {allVideos.length > 0 && (
                          <div className="grid grid-cols-1 gap-4">
                            {allVideos.map((videoUrl, i) => (
                              <a
                                key={i}
                                href={videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block relative rounded-2xl overflow-hidden shadow-md bg-gray-900 aspect-video flex items-center justify-center border border-gray-100"
                              >
                                <img
                                  src={allImages[0] || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop'}
                                  alt={`Video thumbnail - ${i + 1}`}
                                  className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity"
                                />
                                <PlayCircle size={56} className="text-white relative z-10 group-hover:scale-110 transition-transform shadow-sm" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
"""
    
    new_content = content[:start_idx] + replacement + content[end_idx:]
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
    
    print(f"Fixed {filepath}")

rewrite_file("frontend/pages/DepartmentPage.tsx")
rewrite_file("frontend/pages/Departments.tsx")
