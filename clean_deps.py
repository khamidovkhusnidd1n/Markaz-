import re

def main():
    with open("frontend/pages/Departments.tsx", "r", encoding="utf-8") as f:
        content = f.read()

    # Remove detail_image fallback
    content = content.replace("                    if (target.detail_image) allImages.push(getImageUrl(target.detail_image));\n", "")
    
    # Remove detail_video_url fallback
    content = content.replace("                    if (target.detail_video_url) allVideos.push(target.detail_video_url);\n", "")

    # Remove plain text tasks loop
    old_tasks = """                    ) : (
                      getLocalizedField(currentTab, 'tasks').split(/\\r?\\n/).map((task: string, idx: number) => {
                        if (!task.trim()) return null;
                        return (
                          <div
                            key={idx}
                            className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl hover:bg-blue-50 hover:shadow-sm transition-all duration-300 group border border-gray-100"
                          >
                            <div className={`w-8 h-8 bg-gradient-to-r ${currentTab.color_classes || 'from-blue-600 to-blue-800'} rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 group-hover:scale-110 transition-transform`}>
                              {idx + 1}
                            </div>
                            <div className="text-gray-700 leading-relaxed font-medium prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: task }} />
                          </div>
                        );
                      })
                    )}"""
            
    content = content.replace(old_tasks, "                    ) : null}")

    with open("frontend/pages/Departments.tsx", "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    main()
