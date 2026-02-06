import requests
import sys

def check_endpoint(method, url, data=None):
    try:
        if method == 'GET':
            response = requests.get(url, timeout=5, allow_redirects=False)
        else:
            response = requests.post(url, data=data, timeout=5, allow_redirects=False)
        
        print(f"[{response.status_code}] {url}")
        if response.status_code in [200, 400, 401, 403, 405]:
            print(f"   >>> FOUND! (Status indicates service exists)")
            return True
        elif response.status_code in [301, 302]:
            print(f"   >>> REDIRECT to {response.headers.get('Location')}")
            return False
        return False
    except requests.exceptions.RequestException as e:
        print(f"[ERR] {url}: {e}")
        return False

def main():
    domains = [
        "student.samduuf.uz",
        "hemis.samduuf.uz",
        "sys.samduuf.uz",
        "samduuf.uz"
    ]
    
    # Check Authorize URL (GET)
    print("\n--- CHECKING AUTHORIZE URLS (Browser Redirect) ---")
    for d in domains:
        check_endpoint('GET', f"https://{d}/oauth/authorize")

    # Check Token URL (POST)
    print("\n--- CHECKING TOKEN URLS (Back-channel) ---")
    payload = {'grant_type': 'test'}
    for d in domains:
        # Common Hemis patterns
        check_endpoint('POST', f"https://{d}/oauth/token", payload)
        check_endpoint('POST', f"https://{d}/oauth/access_token", payload)
        check_endpoint('POST', f"https://{d}/oauth/api/uaa/login", payload)
        check_endpoint('POST', f"https://{d}/api/token", payload)

if __name__ == "__main__":
    main()
