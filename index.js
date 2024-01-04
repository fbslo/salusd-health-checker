require("dotenv").config()
const request = require('request');
const killProcess = require('kill-process-by-name');
const { exec } = require('child_process');

let options = {
    url: process.env.NATIVE_RPC_ENDPOINT,
    method: "post",
    headers: {
        "content-type": "text/plain"
    },
    auth: {
        user: process.env.NATIVE_RPC_USERNAME,
        pass: process.env.NATIVE_RPC_PASSWORD
    }
};

let errorCount = 0

main()
setInterval(() => {
    main()
}, 1000 * 60 * 15) //15 minutes


async function main(){
    let headBlock = await getHeadBlock()

    if (headBlock != false) {
      console.log(`Head block: ${headBlock}`)
    }

    if (headBlock == false) {
      errorCount++
      console.log("Error getting head block! errorCount: " + errorCount)
    }

    if (errorCount >= 3) {
        errorCount = 0
        killProcess("salusd")

        exec('bash -c "exec -a salusd ./salusd"', (err, stdout, stderr) => {
            if (err) {
                console.log(err)
            } else {
                console.log(`stdout: ${stdout}`);
                console.log(`stderr: ${stderr}`);
            }
        });
    }
}

async function getHeadBlock(){
    return (await rpcCall({
      "jsonrpc": "1.0",
      "id": new Date().getTime(),
      "method": "getblockcount",
      "params": []
    })).result
  }

async function rpcCall(body){
  return new Promise((resolve, reject) => {
    if (typeof body != 'string') body = JSON.stringify(body)

    options.body = body

    request(options, (error, response, resBody) => {
      if (error) {
        resolve({result: false})
      } else {
        try {
          resolve(JSON.parse(response.body))
        } catch (e){
          resolve({result: false})
        }
      }
    });
  })
}