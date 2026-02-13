class ForceHttpsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Kerio Control or other proxies might not send standard headers.
        # Since we know this server is ONLY accessible via HTTPS from the outside,
        # we can safely tell Django to treat every request as secure.
        request.is_secure = lambda: True
        
        # Also patch scheme for good measure
        request.META['wsgi.url_scheme'] = 'https'
        
        return self.get_response(request)
