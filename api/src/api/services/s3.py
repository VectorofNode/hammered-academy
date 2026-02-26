import boto3
from botocore.config import Config

s3_conf = Config(signature_version="s3")
access_key = ""
secret_key = ""
endpoint_url = ""

s3_client = boto3.client(
    "s3",
    aws_access_key_id=access_key,
    aws_secret_access_key=secret_key,
    endpoint_url=endpoint_url,
)
s3_resourse = boto3.resource()
