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

        # 8. Content-Security-Policy (OWASP & UZCERT)
        # Admin: allow self + inline/eval + assets so Jazzmin/AdminLTE renders properly
        # API endpoints: strict default-src 'none' (JSON API has no rendering need)
        # Frontend / Other views: allow self + essential CDNs
        if not response.has_header('Content-Security-Policy'):
            path = request.path or ''
            path_info = getattr(request, 'path_info', '')
            content_type = response.get('Content-Type', '')

            # Check if this is a Django Admin request
            is_admin = ('admin' in path) or ('admin' in path_info)

            if is_admin:
                response['Content-Security-Policy'] = (
                    "default-src 'self'; "
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; "
                    "style-src 'self' 'unsafe-inline' https:; "
                    "font-src 'self' data: https:; "
                    "img-src 'self' data: https: blob:; "
                    "connect-src 'self' https:; "
                    "frame-ancestors 'self'; "
                    "base-uri 'self'; "
                    "form-action 'self'"
                )
            elif content_type.startswith('application/json') or (path.startswith('/api/') and not content_type.startswith('text/html')):
                response['Content-Security-Policy'] = (
                    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'"
                )
            else:
                response['Content-Security-Policy'] = (
                    "default-src 'self'; "
                    "script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; "
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
                    "font-src 'self' https://fonts.gstatic.com data:; "
                    "img-src 'self' data: https: blob:; "
                    "connect-src 'self' https://uzbamalaka.uz; "
                    "frame-ancestors 'self'; "
                    "base-uri 'self'; "
                    "form-action 'self'"
                )

        return response
