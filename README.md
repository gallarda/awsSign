# awsSign
Add AWSv4 Signature to proxied requests

First, add AWS credentials to `nginx.conf` and update region and apiHost if needed.

**Usage:**
 
List all buckets:
 
`curl localhost/s3/`
 
List all objects in the “my-bucket" S3 bucket:
 
`curl -H "bucket: my-bucket" localhost/s3/?list-type=2`
 
The same command piped to an XML pretty printer:
 
`curl -H "bucket: my-bucket" localhost/s3/?list-type=2 |xmllint --format –`
 
Upload a new file to the S3 bucket:
 
`curl -v -X PUT -H "bucket: my-bucket" -H "Content-Type: text/plain" -d 'This is a test' localhost/s3/foo2.txt`
 
*Notice that I passed a Content-Type header here.  With `curl` the default content type for PUT is application/x-www-form-urlencoded*
 
Download a file from S3:
 
`curl -v -H "bucket: my-bucket" localhost/s3/foo2.txt`
 
Delete a file from the bucket:  (Normal HTTP status code is 204: No Content)
 
`curl -v -H "bucket: my-bucket" -X DELETE localhost/s3/foo2.txt`
