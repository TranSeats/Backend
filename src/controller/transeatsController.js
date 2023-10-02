const transeatsService = require("../services/transeatsServices");
const transeatsBuild   = require("../services/transeatsBuild")

async function register(req, res) {
  try {
    const result = await transeatsService.register(req.body);
    res.json(result);
  } catch (err) {
    if(err.code == 23505){
      const message = { message: "Email Already Registered",}
      res.status(400).json(message)
    }
    else{
      res.json(err.detail);
    }
    }
}

async function login(req, res) {
  try {
    const result = await transeatsService.login(req.body);
    if (!result.idUser){
      res.status(401).json(result)
    }
    res.json(result);
  } catch (err) {
    res.json(err.detail);
  }
}

async function testProtected(req,res){
  try {
    const result = await transeatsService.testProtected(req.body);
    res.json(result);
  } catch (err) {
    res.json(err.detail);
  }
}

async function build(req,res){
  try {
    const result = await transeatsBuild.handleWebhook(req);
    if (result.code == 401){
      res.status(code).json(result)
    }
    res.json(result);
  } catch (err) {
    res.json(err.detail);
  }
}

module.exports = {
  register,
  login,
  testProtected,
  build
};