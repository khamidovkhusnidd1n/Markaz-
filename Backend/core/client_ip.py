"""
Ishonchli mijoz IP manzilini aniqlash (OWASP A07/A06: X-Forwarded-For spoofing himoyasi).

Engintron (nginx) so'rovni Apache/Passenger'ga uzatayotganda haqiqiy mijoz IP'sini
X-Forwarded-For ro'yxatining OXIRIGA qo'shadi. Ro'yxat boshidagi qiymatlarni mijoz
o'zi yozishi mumkin, shuning uchun ularga ishonib bo'lmaydi.
"""
from django.conf import settings


def get_client_ip(request) -> str:
    num_proxies = int(getattr(settings, 'NUM_TRUSTED_PROXIES', 1))
    xff = request.META.get('HTTP_X_FORWARDED_FOR', '')
    if xff and num_proxies > 0:
        parts = [p.strip() for p in xff.split(',') if p.strip()]
        if len(parts) >= num_proxies:
            return parts[-num_proxies]
    return request.META.get('HTTP_X_REAL_IP') or request.META.get('REMOTE_ADDR') or 'unknown'
