/**
 * STUDENT ASSIGNMENT: Implement the 10 Validation Rules here.
 * You can use Manual JS, Zod, or Joi.
 */
const { z } = require('zod');

function validateUser(req, res, next) {
    // TODO: Implement validation for R01 through R10
    const userSchema = z.object({
      username: z.string().trim().min(3).max(30),
      email: z.string().trim().toLowerCase().email(),
      age: z.number().min(18),
      role: z.enum(["user", "admin"]),
      website: z.string().optional(),
      password: z.string().regex(/[a-zA-Z]/).regex(/[0-9]/)
    })
  
    // If validation fails, return 400 immediately with an array of errors.
    // return res.status(400).json({ error: "Validation failed", details: [...] });
    
    console.log("Validation middleware triggered, but no rules are enforced yet!");
    
    // If validation passes, hand off to the controller
    next(); 
  }
  
  module.exports = validateUser;