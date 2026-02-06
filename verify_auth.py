import requests
import os
import django
from django.conf import settings

# Setup Django standalone (optional, but easier to just use requests on running server)
BASE_URL = "http://127.0.0.1:8000/api/accounts"

def test_auth():
    print("Testing Authentication...")
    
    # 1. Login with invalid credentials
    print("\n1. Testing Invalid Login:")
    res = requests.post(f"{BASE_URL}/login/", json={"username": "wrong", "password": "wrong"})
    print(f"Status: {res.status_code}, Response: {res.json()}")
    assert res.status_code == 400

    # 2. Create a test user (need to do this via shell script really, or assume 'student' exists if I created it)
    # Since I cannot easily create a user via API (no register endpoint), I will assume 'admin' exists or create one via shell command.
    
    # Let's create a user via Django shell first using a subprocess
    import subprocess
    create_user_script = """
import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
from django.contrib.auth.models import User
if not User.objects.filter(username='testuser').exists():
    User.objects.create_user('testuser', 'test@example.com', 'oldpassword123')
    print("User 'testuser' created.")
else:
    u = User.objects.get(username='testuser')
    u.set_password('oldpassword123')
    u.save()
    print("User 'testuser' reset.")
"""
    with open("create_test_user.py", "w") as f:
        f.write(create_user_script)
        
    subprocess.run("cd backend && source venv/bin/activate && python ../create_test_user.py", shell=True, executable='/bin/zsh')

    # 3. Login with correct credentials
    print("\n3. Testing Valid Login ('testuser' / 'oldpassword123'):")
    res = requests.post(f"{BASE_URL}/login/", json={"username": "testuser", "password": "oldpassword123"})
    print(f"Status: {res.status_code}")
    if res.status_code != 200:
        print(res.text)
        return
    
    data = res.json()
    token = data['token']
    print(f"Token received: {token}")

    # 4. Access Profile (Protected)
    print("\n4. Testing Protected Profile Endpoint:")
    headers = {"Authorization": f"Token {token}"}
    res = requests.get(f"{BASE_URL}/profile/", headers=headers)
    print(f"Status: {res.status_code}, User: {res.json().get('username')}")
    assert res.status_code == 200
    assert res.json()['username'] == 'testuser'

    # 5. Change Password
    print("\n5. Testing Change Password:")
    res = requests.post(f"{BASE_URL}/change-password/", json={
        "old_password": "oldpassword123",
        "new_password": "newpassword456"
    }, headers=headers)
    print(f"Status: {res.status_code}, Response: {res.json()}")
    assert res.status_code == 200

    # 6. Login with new password
    print("\n6. Verifying Login with New Password:")
    res = requests.post(f"{BASE_URL}/login/", json={"username": "testuser", "password": "newpassword456"})
    print(f"Status: {res.status_code}")
    assert res.status_code == 200
    print("SUCCESS: Authentication flow verified.")

if __name__ == "__main__":
    test_auth()
