# Payments with stripe

## About

This subscirption checkout follows instruction from https://stripe.com/docs/billing/quickstart which uses the checkout api, webhooks and customer portal for subscription management. Most of the service relies on stripe's built in features.

## Setting up webhook

**Local testing (manual trigger)**

[Install stripe cli](https://stripe.com/docs/stripe-cli)

```bash
brew install stripe/stripe-cli/stripe
```

Follow the instructions at https://dashboard.stripe.com/webhooks/create?endpoint_location=local

```bash
stripe login
stripe listen --forward-to localhost:4242/webhook
stripe trigger payment_intent.succeeded # or other event as you want
```

**Local testing (production testing)**

Setup ngrok to proxy request & register webhook at https://dashboard.stripe.com/webhooks/create?endpoint_location=hosted
