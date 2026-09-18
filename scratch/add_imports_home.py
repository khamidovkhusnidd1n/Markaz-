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

# Add modal rendering
if "selectedNews && <NewsModal" not in content:
    content = content.replace("Hozircha yangiliklar mavjud emas</p>\n          </div>\n        )}",
                              "Hozircha yangiliklar mavjud emas</p>\n          </div>\n        )}\n      {selectedNews && <NewsModal newsItem={selectedNews} onClose={() => setSelectedNews(null)} />}")

with open("c:/Users/Salohiddin Markaz/Desktop/SAYT/SAYT/frontend/pages/Home.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Added imports")
