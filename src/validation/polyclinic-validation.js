import Joi from "joi";

const getPolyclinicValidation = Joi.object({
  query: Joi.string().optional(),
  page: Joi.number().positive().min(1).default(1),
  limit: Joi.number().max(10).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().optional(),
});

const createPolyclinicValidation = Joi.object({
  name: Joi.string().max(100).required(),
});

const updatePolyclinicValidation = Joi.object({
  name: Joi.string().max(100).optional(),
});

export { 
  getPolyclinicValidation, 
  createPolyclinicValidation,
  updatePolyclinicValidation, 
};
