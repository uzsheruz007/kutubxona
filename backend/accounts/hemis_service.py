import requests
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class HemisService:
    @staticmethod
    def exchange_code_for_token(code):
        """
        Exchanges the authorization code for an access token from Hemis.
        Tries multiple domains and paths to find the correct one.
        Uses Browser Headers to avoid being blocked.
        Retries with Basic Auth if Body Auth fails.
        """
        domains = ["student.samduuf.uz", "hemis.samduuf.uz"]
        # 'access-token' is confirmed to be the correct endpoint
        paths = ["/oauth/access-token", "/oauth/token"]
        
        # Add the one from settings as a priority if not already covered
        settings_host = settings.HEMIS_API_URL.split("://")[-1].split("/")[0]
        if settings_host not in domains:
            domains.insert(0, settings_host)

        print(f"DEBUG: Starting Secure Token Exchange.")
        
        # Payload without credentials (for Basic Auth)
        payload_basic = {
            'grant_type': 'authorization_code',
            'redirect_uri': settings.HEMIS_REDIRECT_URI,
            'code': code
        }
        
        # Payload with credentials (for Body Auth)
        payload_body = payload_basic.copy()
        payload_body.update({
            'client_id': settings.HEMIS_CLIENT_ID,
            'client_secret': settings.HEMIS_CLIENT_SECRET,
        })
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/html, */*'
        }
        
        auth = requests.auth.HTTPBasicAuth(settings.HEMIS_CLIENT_ID, settings.HEMIS_CLIENT_SECRET)

        for domain in domains:
            for path in paths:
                url = f"https://{domain}{path}"
                print(f"DEBUG: Trying {url}...")
                
                # Method 1: POST with Body Credentials
                try:
                    response = requests.post(url, data=payload_body, headers=headers, timeout=5)
                    print(f"DEBUG: [POST Body] {url} -> {response.status_code}")
                    if response.status_code == 200:
                        data = response.json()
                        data['found_domain'] = domain # Inject domain to know where to fetch user info
                        return data
                except Exception as e:
                    print(f"DEBUG: Connect error {url}: {e}")

                # Method 2: POST with Basic Auth Header (Fix for 401 invalid_client)
                try:
                    # Note: We send payload_basic (no credentials in body) + auth header
                    response = requests.post(url, data=payload_basic, auth=auth, headers=headers, timeout=5)
                    print(f"DEBUG: [POST BasicAuth] {url} -> {response.status_code}")
                    if response.status_code == 200:
                         data = response.json()
                         data['found_domain'] = domain # Inject domain
                         return data
                    elif response.status_code == 401:
                         print(f"DEBUG: Basic Auth Failed: {response.text}")
                except Exception:
                    pass
        
        print("DEBUG: All attempts failed.")
        return None

    @staticmethod
    def get_user_info(access_token, base_domain=None):
        """
        Fetches user info using the access token. 
        Uses base_domain to construct the URL if provided.
        """
        # Default to settings if no domain provided (fallback)
        if base_domain:
            info_url = f"https://{base_domain}/oauth/api/user"
        else:
            info_url = f"{settings.HEMIS_API_URL}/user"
            
        print(f"DEBUG: Fetching User Info from {info_url}")
        headers = {'Authorization': f'Bearer {access_token}'}
        
        try:
            response = requests.get(info_url, headers=headers)
            response.raise_for_status()
            data = response.json()
            print(f"DEBUG: Full User Info: {data}") # LOGGING TO SEE KEYS
            return data
        except requests.exceptions.RequestException as e:
            print(f"Hemis User Info Error: {e}")
            return None

    @staticmethod
    def get_or_create_user(hemis_data, user_type='student'):
        """
        Creates or updates a Django User based on Hemis data.
        user_type: 'student' or 'employee' (staff)
        """
        # Determine unique identifier
        # Students usually have 'student_id_number'
        # Staff usually have 'employee_id_number'
        
        hemis_id = None
        
        if user_type == 'student':
            hemis_id = hemis_data.get('student_id_number') or hemis_data.get('login')
            if not hemis_id and 'id' in hemis_data:
                hemis_id = f"student_{hemis_data['id']}"
        else:
             # Staff
            hemis_id = hemis_data.get('employee_id_number') or hemis_data.get('login')
            if not hemis_id and 'id' in hemis_data:
                hemis_id = f"employee_{hemis_data['id']}"
        
        # Fallback
        if not hemis_id:
             hemis_id = str(hemis_data.get('id', ''))
             if user_type:
                 hemis_id = f"{user_type}_{hemis_id}"
        
        if not hemis_id or hemis_id == f"{user_type}_":
            return None
            
        username = hemis_id
        first_name = hemis_data.get('firstname', '') or hemis_data.get('firstName', '')
        last_name = hemis_data.get('lastname', '') or hemis_data.get('surname', '') or hemis_data.get('lastName', '')
        
        email = hemis_data.get('email', '')

        user, created = User.objects.get_or_create(username=username)
        
        # Update fields
        user.first_name = first_name
        user.last_name = last_name
        if email:
            user.email = email
        user.save()
        
        # Create or Update UserProfile with Avatar
        from accounts.models import UserProfile
        profile, _ = UserProfile.objects.get_or_create(user=user)
        
        # Try multiple keys for picture
        picture_url = (
            hemis_data.get('picture') or 
            hemis_data.get('image') or 
            hemis_data.get('avatar') or 
            hemis_data.get('photo') or
            hemis_data.get('avatar_url')
        )
        
        if picture_url:
            profile.avatar_url = picture_url
        
        profile.hemis_id = hemis_id
        profile.user_type = user_type # Check if model has this field, if not it's fine, we primarily needed unique username
        profile.save()
        
        # Create DRF Token
        token, _ = Token.objects.get_or_create(user=user)
        
        return user, token
