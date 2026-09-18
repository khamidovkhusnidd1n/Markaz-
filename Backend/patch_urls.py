import re

file_path = r"C:\Users\Salohiddin Markaz\Desktop\SAYT\SAYT\Backend\core\urls.py"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

routers_code = """router.register(r'departments', views.DepartmentViewSet, basename='departments')
router.register(r'pedagogues', views.PedagogueViewSet, basename='pedagogues')
router.register(r'pedagogue-projects', views.PedagogueProjectViewSet, basename='pedagogue-projects')
"""

content = re.sub(r"router\.register\(r'news', views\.NewsViewSet, basename='news'\)", routers_code + "router.register(r'news', views.NewsViewSet, basename='news')", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("Urls patched.")
