const crypto = require("crypto")
const path = require ('path')
const util = require("util");
const exec = util.promisify(require("child_process").exec);
require('dotenv').config({ path: path.resolve(__dirname, '../config/.env') });


async function handleWebhook(req){
    if (!req.headers['x-hub-signature-256']) {
        return {
            code : 401,
            message: "Unauthorized"
        }
    }
    if (!verify_signature(req)) {
        return {
            code : 401,
            message: "Unauthorized"
        }
    }
    console.log("test2")
    return build()
}
async function build() {
    try {
        const { stdout, stderr } = await exec("git pull origin master && npm install");
        console.log(`output: ${stdout}`);
        return {
            code: 200,
            message: "Build Successful"
        };
    } catch (error) {
        console.error(`error: ${error.message}`);
        return {
            code: 400,
            message: "Build Error"
        };
    }
  }
function verify_signature (req) {
    const WEBHOOK_SECRET = process.env.key;
    const signature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");
    let trusted = Buffer.from(`sha256=${signature}`, 'ascii');
    let untrusted =  Buffer.from(req.headers['x-hub-signature-256'], 'ascii');
    return crypto.timingSafeEqual(trusted, untrusted);
  };

module.exports = {
    handleWebhook
};