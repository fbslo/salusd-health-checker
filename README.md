Start salusd process with name `salusd`: `bash -c "exec -a salusd ./salusd"` (must be kept running, e.g in a screen session)

Set up the app: 

`git clone https://github.com/fbslo/salusd-health-checker && cd salusd-health-checker`

`npm i`

Update the .env file (endpoint must include port), e.g.:

```
NATIVE_RPC_ENDPOINT=http://127.0.0.1:22530
NATIVE_RPC_USERNAME=username
NATIVE_RPC_PASSWORD=password
```

Start the app:

`pm2 start index.js --name salusd-health-checker`

NOTE: salusd must be one directory higher, ../salusd, so the path will match, e.g.

```
salusd
salusd-health-checker/
    index.js
```

