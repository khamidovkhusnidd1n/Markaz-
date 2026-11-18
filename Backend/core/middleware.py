from django.utils.deprecation import MiddlewareMixin

class SecurityHeadersMiddleware(MiddlewareMixin):
    """
    UZCERT & OWASP Security Headers Middleware.
    Adds defense-in-depth security headers and strips server information leak headers.
    """
    def process_response(self, request, response):
        # 1. Strip server disclosure headers
        if response.has_header('X-Powered-By'):
            del response['X-Powered-By']
        if response.has_header('Server'):
            del response['Server']

        # 2. Add HSTS (HTTP Strict Transport Security - 1 year, subdomains, preload)
        if not response.has_header('Strict-Transport-Security'):
            response['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'

        # 3. Add Clickjacking Protection
        if not response.has_header('X-Frame-Options'):
            response['X-Frame-Options'] = 'SAMEORIGIN'

        # 4. Prevent MIME-sniffing
        if not response.has_header('X-Content-Type-Options'):
            response['X-Content-Type-Options'] = 'nosniff'

        # 5. XSS Filter (Legacy browsers)
        if not response.has_header('X-XSS-Protection'):
            response['X-XSS-Protection'] = '1; mode=block'

        # 6. Referrer Policy
        if not response.has_header('Referrer-Policy'):
            response['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        # 7. Device Permissions Policy
        if not response.has_header('Permissions-Policy'):
            response['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), payment=()'

        return response
