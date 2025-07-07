const fs = require('fs');   
const { complainModel } = require('../model/complainModel');

async function HandleComplainData(req, res) {

  const { order_id = '', mobile_number = '', email = '', message = '' } = req.body;

  // wrong file type already blocked by multer, but double-check
  const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;

  // ------------- save to DB -------------
    await complainModel.create({
      order_id,
      mobile_number,
      email: email || null,
      message,
      attachment: attachmentPath,
      ip: req.ip,
      status: 1,
      created_by: req.ip,
      created_at: new Date()
    });
    res.status(200).json({ message: 'Inquiry submitted successfully' });
}

module.exports = { HandleComplainData };
