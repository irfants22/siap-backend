import Joi from "joi";

const registerUserValidation = Joi.object({
  name: Joi.string().max(100).required(),
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
  phone: Joi.string().max(20).required(),
  nik: Joi.string().max(20).required(),
  gender: Joi.string().valid("LAKI_LAKI", "PEREMPUAN").required(),
  address: Joi.string().optional(),
});

// skema login
const loginUserValidation = Joi.object({
  email: Joi.string().max(100).email().required(),
  password: Joi.string().max(100).required(),
});

export { 
  registerUserValidation,
  loginUserValidation 
};

