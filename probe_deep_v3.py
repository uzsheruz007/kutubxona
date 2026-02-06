import requests

def check(url):
    try:
        r = requests.get(url, timeout=5)
        print(f"[{r.status_code}] {url}")
    except Exception as e:
        print(f"[ERR] {url}: {e}")

domain = "student.samduuf.uz"
print("--- DEEP SCANNING FOR CONFIG ---")
check(f"https://{domain}/.well-known/openid-configuration")
check(f"https://{domain}/oauth/.well-known/openid-configuration")
check(f"https://{domain}/api/.well-known/openid-configuration")
check(f"https://{domain}/rest/v1/account/me") # API check
check(f"https://{domain}/api/user")
check(f"https://{domain}/oauth/api/user")
