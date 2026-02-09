"""
Manual validation test script.

Tests that invalid data is rejected with clear error messages.
This validates US3 (Data Validation and Error Handling).

Usage:
    python -m tests.manual_validation_test

Requirements:
    - Backend server running
    - Valid JWT token
"""

import requests
from jose import jwt
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

# Configuration
BASE_URL = "http://localhost:8000"
SECRET = os.getenv("BETTER_AUTH_SECRET", "test-secret")
USER_ID = "test-user-uuid"


def generate_token(user_id: str) -> str:
    """Generate a test JWT token."""
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET, algorithm="HS256")


def test_empty_title():
    """Test that empty title is rejected with 400."""
    print("\n=== Test 1: Empty Title ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    # Test empty string
    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": ""},
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    error = response.json()
    assert "detail" in error
    print(f"✓ Empty title rejected: {error['detail']}")

    # Test whitespace-only
    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": "   "},
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    print("✓ Whitespace-only title rejected")


def test_title_too_long():
    """Test that title exceeding 255 characters is rejected."""
    print("\n=== Test 2: Title Too Long ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    long_title = "a" * 256  # 256 characters
    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": long_title},
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    error = response.json()
    print(f"✓ Title too long rejected: {error['detail']}")


def test_invalid_priority():
    """Test that invalid priority value is rejected."""
    print("\n=== Test 3: Invalid Priority ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": "Test task", "priority": "urgent"},  # Invalid: not low/medium/high
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    error = response.json()
    assert "detail" in error
    print(f"✓ Invalid priority rejected: {error['detail']}")


def test_invalid_due_date():
    """Test that invalid due_date format is rejected."""
    print("\n=== Test 4: Invalid Due Date Format ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    # Test invalid date format
    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": "Test task", "due_date": "2024-13-45"},  # Invalid date
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    error = response.json()
    print(f"✓ Invalid date format rejected: {error['detail']}")

    # Test wrong format (MM/DD/YYYY instead of YYYY-MM-DD)
    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": "Test task", "due_date": "12/31/2024"},
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    print("✓ Wrong date format rejected")


def test_invalid_tags_type():
    """Test that invalid tags type is rejected."""
    print("\n=== Test 5: Invalid Tags Type ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    # Test tags as string instead of array
    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": "Test task", "tags": "not-an-array"},
    )
    assert response.status_code == 400, f"Expected 400, got {response.status_code}"
    error = response.json()
    print(f"✓ Invalid tags type rejected: {error['detail']}")


def test_valid_data():
    """Test that valid data is accepted."""
    print("\n=== Test 6: Valid Data ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={
            "title": "Valid task",
            "description": "This is a valid task",
            "priority": "high",
            "due_date": "2024-12-31",
            "tags": ["test", "validation"],
            "recurrence_pattern": "weekly",
        },
    )
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    task = response.json()
    assert task["title"] == "Valid task"
    print(f"✓ Valid data accepted: Task {task['id']} created")

    # Cleanup
    task_id = task["id"]
    requests.delete(
        f"{BASE_URL}/api/{USER_ID}/tasks/{task_id}",
        headers=headers,
    )
    print("✓ Cleanup complete")


def test_error_messages_are_clear():
    """Test that error messages are actionable and don't expose sensitive info."""
    print("\n=== Test 7: Error Message Quality ===")
    token = generate_token(USER_ID)
    headers = {"Authorization": f"Bearer {token}"}

    response = requests.post(
        f"{BASE_URL}/api/{USER_ID}/tasks",
        headers=headers,
        json={"title": ""},
    )
    error = response.json()

    # Check that error message exists
    assert "detail" in error, "Error response should have 'detail' field"

    # Check that error doesn't expose sensitive information
    error_str = str(error).lower()
    assert "database" not in error_str, "Error should not expose database details"
    assert "connection" not in error_str, "Error should not expose connection details"
    assert "secret" not in error_str, "Error should not expose secrets"

    print("✓ Error messages are clear and safe")


if __name__ == "__main__":
    print("Validation Test: Data Validation and Error Handling")
    print("=" * 50)
    print(f"\nTesting against: {BASE_URL}\n")

    try:
        test_empty_title()
        test_title_too_long()
        test_invalid_priority()
        test_invalid_due_date()
        test_invalid_tags_type()
        test_valid_data()
        test_error_messages_are_clear()

        print("\n=== ✅ All Validation Tests Passed ===\n")
    except AssertionError as e:
        print(f"\n❌ Test Failed: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        exit(1)
