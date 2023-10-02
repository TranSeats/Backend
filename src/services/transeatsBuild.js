const crypto = require("crypto")
const { exec } = require("child_process");
const path = require ('path')
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });


async function handleWebhook(req){
    if (!verify_signature(req)) {
        return {
            code : 401,
            message: "Unauthorized"
        }
    }
    build()
}
async function build() {
    console.log(req)
    exec("git pull origin master", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
    return {
        code : 200,
        message: "Build Successful"
    }
  }
function verify_signature (req) {
    const WEBHOOK_SECRET = process.env.key;
    const signature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");
    let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    let untrusted =  Buffer.from(req.headers.get("x-hub-signature-256"), 'ascii');
    return crypto.timingSafeEqual(trusted, untrusted);
  };

module.exports = {
    handleWebhook
};