const fs = require('fs');                            // for unlink
const path = require('path');
const { validationResult } = require('express-validator');
const { complainModel } = require('../model/complainModel');

// helper regex
const hasScript = (str = '') => /<[^>]*>|script/i.test(str);
const isDigits  = (str = '') => /^[0-9]+$/.test(str);

async function HandleComplainData(req, res) {
  // built-in validation from express-validator middleware
  const errors = validationResult(req);
  const { order_id = '', mobile_number = '', email = '', message = '' } = req.body;

  const inputErrors = {};
  if (!errors.isEmpty()) {
    errors.array().forEach((err) => (inputErrors[err.param] = err.msg));
  }

  // manual XSS & digit checks
  if (hasScript(order_id))     inputErrors.order_id      = 'HTML/script tags not allowed';
  if (!isDigits(mobile_number))inputErrors.mobile_number = 'Digits only';
  if (hasScript(message))      inputErrors.message       = 'HTML/script tags not allowed';
  if (hasScript(email))        inputErrors.email         = 'HTML/script tags not allowed';

  // wrong file type already blocked by multer, but double-check
  const attachmentPath = req.file ? `/uploads/${req.file.filename}` : null;

  // if any validation failed —> delete file & return 400
  if (Object.keys(inputErrors).length) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({ errors: inputErrors });
  }

  // ------------- save to DB -------------
  try {
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
  } catch (err) {
    console.error('DB Error:', err);
    // clean up file if DB fails
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { HandleComplainData };
