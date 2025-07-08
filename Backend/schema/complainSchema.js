const Joi = require('joi');

// Helper to detect <script> tags
const noScript = (value, helpers) => {
  if (/<[^>]*>|script/gi.test(value)) {
    return helpers.message('Field must not contain <script> tags');
  }
  return value;
};

const complainSchema = Joi.object({
  order_id: Joi.string()
    .trim()
    .max(30)
    .required()
    .custom(noScript)
    .messages({
      'string.empty': 'Order ID is required',
      'string.max': 'Order ID must be at most 30 characters',
    }),

  mobile_number: Joi.string()
    .pattern(/^\d+$/)
    .max(11)
    .required()
    .custom(noScript)
    .messages({
      'string.empty': 'Mobile number is required',
      'string.pattern.base': 'Mobile number must start with 03 and be exactly 11 digits',
    }),

  email: Joi.string()
    .email()
    .optional()
    .custom(noScript)
    .messages({
      'string.email': 'Invalid email format',
    }),

  message: Joi.string()
    .trim()
    .max(200)
    .required()
    .custom(noScript)
    .messages({
      'string.empty': 'Message is required',
      'string.max': 'Message must be at most 200 characters',
    }),


});

module.exports = complainSchema;
