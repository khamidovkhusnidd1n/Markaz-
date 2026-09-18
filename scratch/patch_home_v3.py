import re

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Fix the tags for news items
content = re.sub(r'<Link\s+to={`/news/\$\{mainItem\.id\}`}.*?>', 
                 r'<button onClick={() => setSelectedNews(mainItem)} className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-100 h-full w-full text-left block">', 
                 content, flags=re.DOTALL)
content = re.sub(r'</Link>(\s*\);\s*\}\)\(\)\}\s*\{news\.length > 1)', 
                 r'</button>\1', 
                 content)

content = re.sub(r'<Link\s+to={`/news/\$\{secondaryItem\.id\}`}.*?>', 
                 r'<button onClick={() => setSelectedNews(secondaryItem)} className="group grid overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-md transition-all duration-500 hover:shadow-xl md:grid-cols-[280px_1fr] text-left w-full block">', 
                 content, flags=re.DOTALL)
content = re.sub(r'</Link>(\s*\);\s*\}\)\(\)\}\s*</div>)', 
                 r'</button>\1', 
                 content)

content = re.sub(r'<Link\s+to={`/news/\$\{item\.id\}`}.*?>', 
                 r'<button onClick={() => setSelectedNews(item)} key={item.id} className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-slate-100 text-left w-full flex flex-col">', 
                 content, flags=re.DOTALL)
content = re.sub(r'</Link>(\s*\)\);\s*\}\)\(\)\})', 
                 r'</button>\1', 
                 content)


with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
