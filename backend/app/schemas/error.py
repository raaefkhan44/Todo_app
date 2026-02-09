"""
Error response schemas.

Pydantic models for standardized error responses.
"""

from typing import List, Optional, Union
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    """
    Standard error response schema.

    Used for simple error messages (400, 401, 404, 500).
    """

    detail: str


class ValidationErrorDetail(BaseModel):
    """
    Detail for a single validation error.

    Follows FastAPI's default validation error format.
    """

    loc: List[Union[str, int]]  # Location of the error (e.g., ["body", "title"])
    msg: str  # Error message
    type: str  # Error type (e.g., "value_error.missing")


class ValidationErrorResponse(BaseModel):
    """
    Validation error response schema.

    Used for Pydantic validation errors (422).
    Contains detailed information about each validation failure.
    """

    detail: List[ValidationErrorDetail]
