import json
import os
from config import USERS_FILE, ATTENDANCE_FILE, LEAVES_FILE
from utils import hash_password

def initialize_data():
    os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
    
    if not os.path.exists(USERS_FILE):
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
    
    if not os.path.exists(ATTENDANCE_FILE):
        with open(ATTENDANCE_FILE, 'w') as f:
            json.dump([], f, indent=2)
    
    if not os.path.exists(LEAVES_FILE):
        with open(LEAVES_FILE, 'w') as f:
            json.dump([], f, indent=2)

if __name__ == "__main__":
    initialize_data()
    print("Data initialized successfully")
