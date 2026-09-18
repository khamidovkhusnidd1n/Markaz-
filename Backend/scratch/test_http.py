import urllib.request
import urllib.parse
import re

# Enable cookie handling
cookie_processor = urllib.request.HTTPCookieProcessor()
opener = urllib.request.build_opener(cookie_processor)
urllib.request.install_opener(opener)

# Get login page to retrieve CSRF token
login_url = 'http://127.0.0.1:8000/admin/login/'
response = urllib.request.urlopen(login_url)
html = response.read().decode('utf-8')
csrf_token = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', html).group(1)

# Log in
login_data = urllib.parse.urlencode({
    'username': 'admin',
    'password': 'admin123',
    'csrfmiddlewaretoken': csrf_token,
    'next': '/admin/'
}).encode('utf-8')

req = urllib.request.Request(login_url, data=login_data)
req.add_header('Referer', login_url)
login_response = urllib.request.urlopen(req)

# Fetch personnel page
page_url = 'http://127.0.0.1:8000/admin/core/personnel/33/change/'
req_page = urllib.request.Request(page_url)
page_response = urllib.request.urlopen(req_page)
page_html = page_response.read().decode('utf-8')

print('HTTP TCP Response Has ckeditor.js:', 'ckeditor.js' in page_html)
if 'ckeditor.js' not in page_html:
    print('Length of HTML:', len(page_html))
    print('First 500 chars of HTML:', page_html[:500])
