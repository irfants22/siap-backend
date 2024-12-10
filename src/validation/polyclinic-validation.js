import Joi from "joi";

const getPolyclinicValidation = Joi.object({
  query: Joi.string().optional(),
  page: Joi.number().positive().min(1).default(1),
  limit: Joi.number().max(10).default(10),
});

export { getPolyclinicValidation };