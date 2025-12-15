from fastapi import APIRouter, HTTPException, status, Depends, Header
from config import USERS_FILE
from utils import read_json_file, verify_token

router = APIRouter()

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

@router.get("")
async def get_all_users(current_user: dict = Depends(get_current_user)):
    users = read_json_file(USERS_FILE)
    return [
        {
            "id": u['id'],
            "name": u['name'],
            "email": u['email'],
            "role": u['role'],
            "department": u['department']
        }
        for u in users
    ]

@router.get("/{user_id}")
async def get_user(user_id: int, current_user: dict = Depends(get_current_user)):
    users = read_json_file(USERS_FILE)
    user = next((u for u in users if u['id'] == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user['id'],
        "name": user['name'],
        "email": user['email'],
        "role": user['role'],
        "department": user['department']
    }
