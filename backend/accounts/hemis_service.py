import requests
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class HemisService:
    @staticmethod
    def exchange_code_for_token(code):
        # Prioritize student.samduuf.uz as requested
        domains = ["student.samduuf.uz", "hemis.samduuf.uz"]
        paths = ["/oauth/access-token", "/oauth/token"]
        
        try:
            settings_host = settings.HEMIS_API_URL.split("://")[-1].split("/")[0]
            if settings_host not in domains:
                domains.insert(0, settings_host)
        except Exception:
            pass

        print(f"DEBUG: Starting Secure Token Exchange. Code: {code[:5]}...")
        
        payload_basic = {
            'grant_type': 'authorization_code',
            'redirect_uri': settings.HEMIS_REDIRECT_URI,
            'code': code
        }
        
        payload_body = payload_basic.copy()
        payload_body.update({
            'client_id': settings.HEMIS_CLIENT_ID,
            'client_secret': settings.HEMIS_CLIENT_SECRET,
        })
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Compatible; KutubxonaBot/1.0)',
            'Accept': 'application/json'
        }
        
        auth = requests.auth.HTTPBasicAuth(settings.HEMIS_CLIENT_ID, settings.HEMIS_CLIENT_SECRET)

        for domain in domains:
            for path in paths:
                url = f"https://{domain}{path}"
                print(f"DEBUG: Trying {url}...")
                
                # Method 1: Body Auth
                try:
                    response = requests.post(url, data=payload_body, headers=headers, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        data['found_domain'] = domain
                        return data
                    print(f"DEBUG: [POST Body] {url} -> {response.status_code} {response.text[:100]}")
                except Exception as e:
                    print(f"DEBUG: Connect error {url}: {e}")

                # Method 2: Basic Auth
                try:
                    response = requests.post(url, data=payload_basic, auth=auth, headers=headers, timeout=10)
                    if response.status_code == 200:
                         data = response.json()
                         data['found_domain'] = domain
                         return data
                    print(f"DEBUG: [POST BasicAuth] {url} -> {response.status_code} {response.text[:100]}")
                except Exception:
                    pass
        
        print("DEBUG: All attempts failed.")
        return None

    @staticmethod
    def get_user_info(access_token, base_domain=None):
        if base_domain:
            info_url = f"https://{base_domain}/oauth/api/user"
        else:
            info_url = f"{settings.HEMIS_API_URL}/user"
            
        print(f"DEBUG: Fetching User Info from {info_url}")
        headers = {'Authorization': f'Bearer {access_token}'}
        
        try:
            response = requests.get(info_url, headers=headers)
            if response.status_code != 200:
                print(f"HemisService: get_user_info failed. URL: {info_url}, Status: {response.status_code}, Body: {response.text}")
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"HemisService: get_user_info Exception: {e}")
            return None

    @staticmethod
    def get_or_create_user(hemis_data, user_type='student', found_domain=None):
        hemis_id = None
        
        # Logic from user snippet
        if user_type == 'student':
            hemis_id = hemis_data.get('student_id_number') or hemis_data.get('login')
            if not hemis_id and 'id' in hemis_data:
                hemis_id = f"student_{hemis_data['id']}"
        else:
            # Staff logic
            hemis_id = hemis_data.get('employee_id_number') or hemis_data.get('login')
            if not hemis_id and 'id' in hemis_data:
                hemis_id = f"employee_{hemis_data['id']}"
        
        # Fallback if specific ID missing
        if not hemis_id:
             hemis_id = str(hemis_data.get('id', ''))
             if user_type:
                 hemis_id = f"{user_type}_{hemis_id}"
        
        if not hemis_id or hemis_id == f"{user_type}_":
            return None
            
        username = hemis_id
        
        first_name = hemis_data.get('firstname') or hemis_data.get('firstName') or hemis_data.get('name', '')
        last_name = hemis_data.get('lastname') or hemis_data.get('surname') or hemis_data.get('lastName', '')
        email = hemis_data.get('email', '')

        user, created = User.objects.get_or_create(username=username)
        
        if first_name: user.first_name = first_name
        if last_name: user.last_name = last_name
        if email: user.email = email
        user.save()
        
        from accounts.models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        
        picture_path = (
            hemis_data.get('picture') or 
            hemis_data.get('image') or 
            hemis_data.get('avatar') or 
            hemis_data.get('photo') or
            hemis_data.get('avatar_url')
        )
        
        if picture_path:
            if picture_path.startswith("http"):
                 profile.avatar_url = picture_path
            else:
                 # Re-adding domain logic for robustness, though user didn't have it, it's safer
                 base_domain = found_domain or ("student.samduuf.uz" if user_type == 'student' else "hemis.samduuf.uz")
                 if not picture_path.startswith("/"):
                     picture_path = f"/{picture_path}"
                 profile.avatar_url = f"https://{base_domain}{picture_path}"
        
        profile.hemis_id = hemis_id
        profile.user_type = user_type
        profile.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return user, token
