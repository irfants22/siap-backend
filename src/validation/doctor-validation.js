import Joi from "joi";

const getDoctorValidation = Joi.object({
  query: Joi.string().optional(),
  page: Joi.number().positive().min(1).default(1),
  limit: Joi.number().max(10).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().optional(),
});

const createDoctorValidation = Joi.object({
  name: Joi.string().max(100).required(),
  phone: Joi.string().max(20).required(),
  email: Joi.string().max(100).email().required(),
  gender: Joi.string().valid("LAKI_LAKI", "PEREMPUAN").required(),
  address: Joi.string().optional(),
  description: Joi.string().optional(),
  schedule: Joi.object({
    senin: Joi.string().optional(),
    selasa: Joi.string().optional(),
    rabu: Joi.string().optional(),
    kamis: Joi.string().optional(),
    jumat: Joi.string().optional(),
    sabtu: Joi.string().optional(),
    minggu: Joi.string().optional(),
  }).optional(),
  social_media: Joi.object({
    linkedin: Joi.string().optional(),
    instagram: Joi.string().optional(),
    x: Joi.string().optional(),
    telegram: Joi.string().optional(),
  }).optional(),
});

const updateDoctorValidation = Joi.object({
  name: Joi.string().max(100).optional(),
  phone: Joi.string().max(20).optional(),
  email: Joi.string().max(100).email().optional(),
  gender: Joi.string().valid("LAKI_LAKI", "PEREMPUAN").optional(),
  address: Joi.string().optional(),
  description: Joi.string().optional(),
  schedule: Joi.object({
    senin: Joi.string().optional(),
    selasa: Joi.string().optional(),
    rabu: Joi.string().optional(),
    kamis: Joi.string().optional(),
    jumat: Joi.string().optional(),
    sabtu: Joi.string().optional(),
    minggu: Joi.string().optional(),
  }).optional(),
  social_media: Joi.object({
    linkedin: Joi.string().optional(),
    instagram: Joi.string().optional(),
    x: Joi.string().optional(),
    telegram: Joi.string().optional(),
  }).optional(),
});

export { getDoctorValidation, createDoctorValidation, updateDoctorValidation };
