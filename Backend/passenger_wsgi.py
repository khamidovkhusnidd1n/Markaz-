import os
import sys

# Path to the Django project directory
sys.path.insert(0, os.path.dirname(__file__))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'markaz_backend.settings')

# Setup the application for Passenger (cPanel)
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
