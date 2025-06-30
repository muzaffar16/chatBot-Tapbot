const express=require('express')
const { HandleGeminiResponce } = require('../controller/botController')

const router=express.Router()

router.post('/',HandleGeminiResponce)

module.exports= router