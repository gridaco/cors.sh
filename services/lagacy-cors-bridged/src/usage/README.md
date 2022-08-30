# Usage Logging

## Data we collect

- client ip (for managing x-rate-limit)
- client ua (for malicious usage preventation)
- request url information (only host) (for understanding api usage)
    - we do not collect request query
    - we do not collect request body
    - we do not collect response body
- response result (for collecting success rate) (collection as http status code)
- duration (for tracking x-rate-limit for execution time)
- payload (for tracking x-rate-limit for data transfer)
- app (for identifying the request) (this is determined by api key you are using. pretty obvious)