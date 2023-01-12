# API Authorizer for proxy.cors.sh

## Architecture

This layer will use the synced key signatures direcly from the table, then proxy.cors.sh will use this as an authorizer.

> The table is managed by the service layer, this layer only performs GetItem.

Access points are secured by domain, this service's source is safe to be public on github.
