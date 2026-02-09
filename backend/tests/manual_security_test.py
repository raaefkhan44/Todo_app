"""
Manual security test script for user isolation validation.

Tests that users cannot access each other's tasks through any endpoint.
This validates US1 (Secure Task Data Access).

Usage:
    python -m tests.manual_security_test

Requirements:
    - Backend server running
    - Two test JWT tokens for different users
"""

import requests
import json
from typing import Dict, Any

# Configuration
BASE_URL = "http://localhost:8000"
USER_A_ID = "user-a-uuid-here"
USER_B_ID = "user-b-uuid-here"

# TODO: Generate these tokens using the script in quickstart.md
USER_A_TOKEN = "eyJ..."  # JWT token for User A
USER_B_TOKEN = "eyJ..."  # JWT token for User B


def make_request(
    method: str, endpoint: str, token: str, json_data: Dict[str, Any] = None
) -> requests.Response:
    """Make HTTP request with JWT token."""
    headers = {"Authorization": f"Bearer {token}"}
    url = f"{BASE_URL}{endpoint}"

    if method == "GET":
        return requests.get(url, headers=headers)
    elif method == "POST":
        return requests.post(url, headers=headers, json=json_data)
    elif method == "PUT":
        return requests.put(url, headers=headers, json=json_data)
    elif method == "DELETE":
        return requests.delete(url, headers=headers)
    elif method == "PATCH":
        return requests.patch(url, headers=headers)


def test_cross_user_access():
    """
    Test that User A cannot access User B's tasks.

    Expected behavior:
    - All cross-user access attempts should return 404 (not 403)
    - 404 prevents information leakage about task existence
    """
    print("\n=== Security Test: Cross-User Access Prevention ===\n")

    # Step 1: User A creates a task
    print("Step 1: User A creates a task...")
    response = make_request(
        "POST",
        f"/api/{USER_A_ID}/tasks",
        USER_A_TOKEN,
        {"title": "User A's private task", "tags": ["security-test"]},
    )
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    task_a = response.json()
    task_a_id = task_a["id"]
    print(f"✓ User A created task: {task_a_id}")

    # Step 2: User B creates a task
    print("\nStep 2: User B creates a task...")
    response = make_request(
        "POST",
        f"/api/{USER_B_ID}/tasks",
        USER_B_TOKEN,
        {"title": "User B's private task", "tags": ["security-test"]},
    )
    assert response.status_code == 201, f"Expected 201, got {response.status_code}"
    task_b = response.json()
    task_b_id = task_b["id"]
    print(f"✓ User B created task: {task_b_id}")

    # Step 3: User A tries to GET User B's task (should fail with 404)
    print("\nStep 3: User A tries to GET User B's task...")
    response = make_request("GET", f"/api/{USER_A_ID}/tasks/{task_b_id}", USER_A_TOKEN)
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    print("✓ User A cannot access User B's task (404)")

    # Step 4: User B tries to GET User A's task (should fail with 404)
    print("\nStep 4: User B tries to GET User A's task...")
    response = make_request("GET", f"/api/{USER_B_ID}/tasks/{task_a_id}", USER_B_TOKEN)
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    print("✓ User B cannot access User A's task (404)")

    # Step 5: User A tries to UPDATE User B's task (should fail with 404)
    print("\nStep 5: User A tries to UPDATE User B's task...")
    response = make_request(
        "PUT",
        f"/api/{USER_A_ID}/tasks/{task_b_id}",
        USER_A_TOKEN,
        {"title": "Hacked!"},
    )
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    print("✓ User A cannot update User B's task (404)")

    # Step 6: User B tries to DELETE User A's task (should fail with 404)
    print("\nStep 6: User B tries to DELETE User A's task...")
    response = make_request(
        "DELETE", f"/api/{USER_B_ID}/tasks/{task_a_id}", USER_B_TOKEN
    )
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    print("✓ User B cannot delete User A's task (404)")

    # Step 7: User A tries to TOGGLE User B's task completion (should fail with 404)
    print("\nStep 7: User A tries to TOGGLE User B's task completion...")
    response = make_request(
        "PATCH", f"/api/{USER_A_ID}/tasks/{task_b_id}/complete", USER_A_TOKEN
    )
    assert response.status_code == 404, f"Expected 404, got {response.status_code}"
    print("✓ User A cannot toggle User B's task (404)")

    # Step 8: Verify User A can only see their own tasks
    print("\nStep 8: Verify User A can only see their own tasks...")
    response = make_request("GET", f"/api/{USER_A_ID}/tasks", USER_A_TOKEN)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    tasks = response.json()
    task_ids = [task["id"] for task in tasks]
    assert task_a_id in task_ids, "User A should see their own task"
    assert task_b_id not in task_ids, "User A should NOT see User B's task"
    print(f"✓ User A sees only their tasks ({len(tasks)} tasks)")

    # Step 9: Verify User B can only see their own tasks
    print("\nStep 9: Verify User B can only see their own tasks...")
    response = make_request("GET", f"/api/{USER_B_ID}/tasks", USER_B_TOKEN)
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    tasks = response.json()
    task_ids = [task["id"] for task in tasks]
    assert task_b_id in task_ids, "User B should see their own task"
    assert task_a_id not in task_ids, "User B should NOT see User A's task"
    print(f"✓ User B sees only their tasks ({len(tasks)} tasks)")

    # Cleanup
    print("\nCleanup: Deleting test tasks...")
    make_request("DELETE", f"/api/{USER_A_ID}/tasks/{task_a_id}", USER_A_TOKEN)
    make_request("DELETE", f"/api/{USER_B_ID}/tasks/{task_b_id}", USER_B_TOKEN)
    print("✓ Cleanup complete")

    print("\n=== ✅ All Security Tests Passed ===\n")


if __name__ == "__main__":
    print("Security Test: User Isolation Validation")
    print("=" * 50)
    print("\nIMPORTANT: Update USER_A_TOKEN and USER_B_TOKEN before running!")
    print("See specs/001-backend-api/quickstart.md for token generation.\n")

    try:
        test_cross_user_access()
    except AssertionError as e:
        print(f"\n❌ Test Failed: {e}")
        exit(1)
    except Exception as e:
        print(f"\n❌ Error: {e}")
        exit(1)
