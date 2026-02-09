"""
Logging configuration for the backend API.

Provides structured logging with sensitive data filtering.
"""

import logging
import os
from typing import Any


class SensitiveDataFilter(logging.Filter):
    """
    Filter to remove sensitive data from log messages.

    Filters out:
    - Passwords
    - JWT tokens
    - DATABASE_URL connection strings
    - BETTER_AUTH_SECRET
    """

    SENSITIVE_PATTERNS = [
        "password",
        "token",
        "bearer",
        "authorization",
        "database_url",
        "better_auth_secret",
        "secret",
    ]

    def filter(self, record: logging.LogRecord) -> bool:
        """
        Filter log record to remove sensitive data.

        Args:
            record: Log record to filter

        Returns:
            True to allow the record, False to block it
        """
        # Convert message to lowercase for case-insensitive matching
        message_lower = str(record.getMessage()).lower()

        # Check if message contains sensitive patterns
        for pattern in self.SENSITIVE_PATTERNS:
            if pattern in message_lower:
                # Redact the sensitive part
                record.msg = "[REDACTED - Contains sensitive data]"
                record.args = ()
                break

        return True


def configure_logging(log_level: str = "INFO"):
    """
    Configure application logging.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR)
    """
    # Create logger
    logger = logging.getLogger()
    logger.setLevel(getattr(logging, log_level.upper()))

    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(getattr(logging, log_level.upper()))

    # Create formatter
    formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )
    console_handler.setFormatter(formatter)

    # Add sensitive data filter
    console_handler.addFilter(SensitiveDataFilter())

    # Add handler to logger
    logger.addHandler(console_handler)

    return logger
