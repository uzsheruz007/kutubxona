import requests
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class HemisService:
    @staticmethod
    def exchange_code_for_token(code):
        # Prioritize hemis.samduuf.uz for employees
        domains = ["hemis.samduuf.uz", "student.samduuf.uz"]
        
        try:
            settings_host = settings.HEMIS_API_URL.split("://")[-1].split("/")[0]
            if settings_host not in domains:
                domains.insert(0, settings_host)
        except Exception:
            pass

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
            paths = ["/oauth/access-token", "/oauth/token"]
            
            for path in paths:
                full_url = f"https://{domain}{path}"
                
                # Method 1: Body Auth
                try:
                    response = requests.post(full_url, data=payload_body, headers=headers, timeout=10)
                    if response.status_code == 200:
                        data = response.json()
                        data['found_domain'] = domain
                        return data
                    else:
                        print(f"HemisService: Attempt 1 (Body) failed for {domain}{path}. Status: {response.status_code}, Body: {response.text}")
                except Exception as e:
                    print(f"HemisService: Attempt 1 (Body) Exception for {domain}{path}: {e}")

                # Method 2: Basic Auth
                try:
                    response = requests.post(full_url, data=payload_basic, auth=auth, headers=headers, timeout=10)
                    if response.status_code == 200:
                         data = response.json()
                         data['found_domain'] = domain
                         return data
                    else:
                        print(f"HemisService: Attempt 2 (Basic) failed for {domain}{path}. Status: {response.status_code}, Body: {response.text}")
                except Exception as e:
                    print(f"HemisService: Attempt 2 (Basic) Exception for {domain}{path}: {e}")
        
        return None

    @staticmethod
    def get_user_info(access_token, base_domain=None):
        if base_domain:
            info_url = f"https://{base_domain}/oauth/api/user"
        else:
            info_url = f"{settings.HEMIS_API_URL}/user"
            
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
        # 1. Username logic
        username = (
            hemis_data.get('login') or 
            hemis_data.get('username') or 
            hemis_data.get('student_id_number') or 
            hemis_data.get('employee_id_number')
        )
        
        if not username:
             hemis_id = str(hemis_data.get('id', ''))
             if hemis_id:
                 username = f"{user_type}_{hemis_id}"
        
        if not username:
            return None
            
        # 2. Name logic
        first_name = hemis_data.get('firstname') or hemis_data.get('first_name') or hemis_data.get('name', '')
        last_name = hemis_data.get('surname') or hemis_data.get('last_name') or hemis_data.get('lastname', '')
        email = hemis_data.get('email', '')

        user, created = User.objects.get_or_create(username=username)
        
        if first_name: user.first_name = first_name
        if last_name: user.last_name = last_name
        if email: user.email = email
        user.save()
        
        # 3. Profile & Avatar logic
        from accounts.models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        
        picture_path = (
            hemis_data.get('picture') or 
            hemis_data.get('picture_link') or
            hemis_data.get('image') or 
            hemis_data.get('avatar') or 
            hemis_data.get('photo') or
            hemis_data.get('avatar_url')
        )
        
        if picture_path:
            if picture_path.startswith("http"):
                 profile.avatar_url = picture_path
            else:
                 base_domain = found_domain or ("hemis.samduuf.uz" if user_type == 'employee' else "student.samduuf.uz")
                 if not picture_path.startswith("/"):
                     picture_path = f"/{picture_path}"
                 profile.avatar_url = f"https://{base_domain}{picture_path}"
        
        if user_type == 'student':
            profile.hemis_id = hemis_data.get('student_id_number', username)
        else:
            profile.hemis_id = hemis_data.get('employee_id_number', username)

        profile.user_type = user_type
        profile.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return user, token
