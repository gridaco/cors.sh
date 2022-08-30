# service layers

- proxy layer
  - contributes only to proxying the request.
  - shards part of the service layer db once a day.
  - uses dynamo db & takes full serverless approach.
  - handles millions of requests every hour.
- service layer
  - contributes to authorization and subscriptions management.
  - uses mongodb
  - uess prisma
  - can be alted to ec2 instalce service.
  - handles few thousand requests every hour.
