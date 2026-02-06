import requests

def check(url, method='POST'):
    try:
        if method == 'GET':
            r = requests.get(url, allow_redirects=False, timeout=5)
        else:
            r = requests.post(url, data={'grant_type': 'test'}, allow_redirects=False, timeout=5)
        
        status = r.status_code
        print(f"[{status}] {url}")
        
        if status != 404:
            print(f"   ^^^ FOUND POTENTIAL ENDPOINT! (Not 404)")
            
    except Exception as e:
        print(f"[ERR] {url}: {e}")

domains = ["student.samduuf.uz", "hemis.samduuf.uz"]
paths = [
    "/oauth/authorize", # GET
    "/oauth/token",
    "/oauth/access_token",
    "/api/token",
    "/api/oauth/token",
    "/oauth/api/token",
    "/oauth/api/login",
    "/oauth/api/uaa/login"
]

print("--- PROBING HEMIS ENDPOINTS ---")
for d in domains:
    print(f"\nScanning {d}...")
    # Check Authorize (GET)
    check(f"https://{d}/oauth/authorize", 'GET')
    
    # Check Token (POST)
    for p in paths:
        if "authorize" in p: continue
        check(f"https://{d}{p}", 'POST')
