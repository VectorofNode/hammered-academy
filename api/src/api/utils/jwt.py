from datetime import datetime, timedelta, timezone
import os
from typing import Any, Optional, Union

from jose import jwt


def create_access_token(subject: Union[str, Any], exp_delta: timedelta):
    expires = datetime.now(timezone.utc) + exp_delta
    to_encode = {"exp": expires, "sub": str(subject)}

    encoded_jwt = jwt.encode(to_encode, os.getenv("SECRET_KEY", ""), algorithm="EdDSA")

    return encoded_jwt
