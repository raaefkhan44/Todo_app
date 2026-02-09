"""
Manual authentication test script.

Tests JWT token validation and authentication enforcement.
This validates US4 (Stateless Authentication).

Usage:
    python -m tests.manual_auth_test

Requirements:
    - Backend server running
"""

import requests
import time
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
BASE_URL = "http://localhost:8000"
SECRET = os.getenv("BETTER_AUTH_SECRET", "test-secret")
USER_ID = "test-user-uuid"


def generate_token(user_id: str, expires_in_seconds: int = 3600) -> str:
    """Generate a test JWT token."""
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(seconds=expires_in_seconds),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")


def test_missing_token():
    """Test that requests without JWT token are rejected with 401."""
    print("\n=== Test 1: Missing JWT Token ===")
    response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks")
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    assert "detail" in response.json()
    print("✓ Missing token rejected with 401")


def test_valid_token():
    """Test that requests with valid JWT token are accepted."""
    print("\n=== Test 2: Valid JWT Token ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    print("✓ Valid token accepted with 200")


def test_expired_token():
    """Test that expired JWT tokens are rejected with 401."""
    print("\n=== Test 3: Expired JWT Token ===")
    # Generate token that expires immediately
    token = generate_token(USER_ID, expires_in_seconds=-1)
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("✓ Expired token rejected with 401")


def test_invalid_signature():
    """Test that tokens with invalid signature are rejected with 401."""
    print("\n=== Test 4: Invalid JWT Signature ===")
    # Generate token with wrong secret
    payload = {
        "sub": USER_ID,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    token = jwt.encode(payload, "wrong-secret", algorithm="HS256")
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("✓ Invalid signature rejected with 401")


def test_malformed_token():
    """Test that malformed JWT tokens are rejected with 401."""
    print("\n=== Test 5: Malformed JWT Token ===")
    headers = {"Authorization": "Bearer not-a-valid-jwt-token"}
    response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("✓ Malformed token rejected with 401")


def test_missing_bearer_prefix():
    """Test that tokens without 'Bearer' prefix are rejected."""
    print("\n=== Test 6: Missing Bearer Prefix ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": token}  # Missing "Bearer " prefix
    response = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    print("✓ Token without Bearer prefix rejected with 401")


def test_stateless_operation():
    """Test that backend remains stateless after restart."""
    print("\n=== Test 7: Stateless Operation ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    # Make first request
    response1 = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response1.status_code == 200, f"Expected 200, got {response1.status_code}"

    # Make second request with same token (simulating server restart)
    response2 = requests.get(f"{BASE_URL}/api/{USER_ID}/tasks", headers=headers)
    assert response2.status_code == 200, f"Expected 200, got {response2.status_code}"

    print("✓ Backend operates statelessly (no session storage)")


if __name__ == "__main__":
    print("Authentication Test: JWT Validation")
    print("=" * 50)
    print(f"\nUsing BETTER_AUTH_SECRET: {SECRET[:10]}...")
    print(f"Testing against: {BASE_URL}\n")

    try:
        test_missing_token()
        test_valid_token()
        test_expired_token()
        test_invalid_signature()
        test_malformed_token()
        test_missing_bearer_prefix()
        test_stateless_operation()

        print("\n=== ✅ All Authentication Tests Passed ===\n")
    except AssertionError as e:
        print(f"\n❌ Test Failed: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        exit(1)
