

const validate = (schema) => (req, res, next) => {
  try {
    const {error} = schema.validate(req.body);
    if(error){
      // console.log(error)
      return res.status(200).json(error.details[0].message)
    }
    next();
  } catch (error) {
    // Handle validation errors. You can customize this based on your needs.
    res.status(400).json({ error: error.errors }); // Example: sending a 400 error with validation errors.
  }
};
    
  
module.exports = validate;
