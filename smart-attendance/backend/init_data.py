import json
import os
from config import USERS_FILE, ATTENDANCE_FILE, LEAVES_FILE
from utils import hash_password

def initialize_data():
    os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
    
    users = [
        {
            "id": 1,
            "name": "Admin User",
            "email": "admin@example.com",
            "password": hash_password("password"),
            "role": "admin",
            "department": "Management"
        },
        {
            "id": 2,
            "name": "John Doe",
            "email": "emp@example.com",
            "password": hash_password("password"),
            "role": "employee",
            "department": "Engineering"
        },
        {
            "id": 3,
            "name": "Jane Smith",
            "email": "jane@example.com",
            "password": hash_password("password"),
            "role": "employee",
            "department": "HR"
        }
    ]
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)
    print(f"Users initialized: {len(users)} users created")
    
    with open(ATTENDANCE_FILE, 'w') as f:
        json.dump([], f, indent=2)
    print("Attendance file initialized")
    
    with open(LEAVES_FILE, 'w') as f:
        json.dump([], f, indent=2)
    print("Leaves file initialized")

if __name__ == "__main__":
    initialize_data()
    print("Data initialized successfully")
