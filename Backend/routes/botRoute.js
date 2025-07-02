const express=require('express')
const { HandleGeminiResponce } = require('../controller/botController')

const router=express.Router()

router.post('/:website',HandleGeminiResponce)

module.exports= router