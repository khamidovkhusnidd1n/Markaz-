import re

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add NewsModal import
if "import { NewsModal }" not in content:
    content = content.replace("import { Link, useLocation } from 'react-router-dom';", 
                              "import { Link, useLocation } from 'react-router-dom';\nimport { NewsModal } from '../components/NewsModal';")
    if "import { PDPlanRecord" in content and "NewsItem" not in content:
        content = content.replace("import { PDPlanRecord", "import { PDPlanRecord, NewsItem")

# Add state
if "const [selectedNews, setSelectedNews]" not in content:
    content = content.replace("const [heroIndex, setHeroIndex] = useState(0);",
                              "const [heroIndex, setHeroIndex] = useState(0);\n  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);")

parts = content.split("newsReveal.ref}")
if len(parts) == 2:
    news_section = parts[1]
    
    # Large card
    news_section = re.sub(r'<Link\s+to={`/news/\$\{mainItem\.id\}`}\s+className="([^"]+)"', 
                          r'<button onClick={() => setSelectedNews(mainItem)} className="\1 text-left block w-full"', 
                          news_section, flags=re.DOTALL)
    # Secondary card
    news_section = re.sub(r'<Link\s+to={`/news/\$\{secondaryItem\.id\}`}\s+className="([^"]+)"', 
                          r'<button onClick={() => setSelectedNews(secondaryItem)} className="\1 text-left block w-full"', 
                          news_section, flags=re.DOTALL)
    # Small cards
    news_section = re.sub(r'<Link\s+to={`/news/\$\{item\.id\}`}\s+key=\{item\.id\}\s+className="([^"]+)"', 
                          r'<button onClick={() => setSelectedNews(item)} key={item.id} className="\1 text-left block w-full flex"', 
                          news_section, flags=re.DOTALL)

    # Convert the first 3 </Link> to </button> in the news section (which correspond to the ones we just replaced)
    # There are exactly 3 closing tags we need to change in the block before `<Link to="/news"`
    split_news_btn = news_section.split('<Link\n                  to="/news"')
    if len(split_news_btn) == 2:
        split_news_btn[0] = split_news_btn[0].replace('</Link>', '</button>')
        news_section = '<Link\n                  to="/news"'.join(split_news_btn)
    
    # Add Modal
    news_section = news_section.replace('</section>', '{selectedNews && <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}\n        </section>')

    content = parts[0] + "newsReveal.ref}" + news_section

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
