# Migrate from cors.bridged.cc

If you are a `cors.bridged.cc` user, you will have api key in shape like this `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

You can use the same api key for `cors.sh`, but this will no longer work from October 30, 2022.

To migrate, create new app from cors.sh console and replace the api key from your web app project.

**ACTION REQUIRED:**

- register new app on cors.sh
- replace the existing api key in your web project issued from cors.sh on previous step
- replace `cors.bridged.cc` to `api.cors.sh`

For example with cURL,

Previous

```curl
GET https://cors.bridged.cc/https://google.com
-H 'cors-api-key: xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
```

To..

```curl
GET https://api.cors.sh/https://google.com
-H 'cors-api-key: live_xxxx-xxxx-xxxx-xxxx'
```
