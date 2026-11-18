from django.http import JsonResponse
from django.shortcuts import render

def custom_page_not_found_view(request, exception=None):
    """Clean 404 handler. Returns JSON for API requests, HTML for browser requests."""
    if request.path.startswith('/api/'):
        return JsonResponse({'success': False, 'detail': 'Bunday sahifa yoki endpoint topilmadi.'}, status=404)
    return render(request, '404.html', status=404)

def custom_server_error_view(request):
    """Clean 500 handler. Never leaks stack traces or environment secrets."""
    if request.path.startswith('/api/'):
        return JsonResponse({'success': False, 'detail': 'Serverda vaqtinchalik xatolik yuz berdi.'}, status=500)
    return render(request, '500.html', status=500)

def custom_permission_denied_view(request, exception=None):
    """Clean 403 handler."""
    if request.path.startswith('/api/'):
        return JsonResponse({'success': False, 'detail': 'Ruxsat berilmagan.'}, status=403)
    return JsonResponse({'detail': 'Forbidden'}, status=403)

def custom_bad_request_view(request, exception=None):
    """Clean 400 handler."""
    if request.path.startswith('/api/'):
        return JsonResponse({'success': False, 'detail': 'Noto\'g\'ri so\'rov parametrlari.'}, status=400)
    return JsonResponse({'detail': 'Bad Request'}, status=400)
