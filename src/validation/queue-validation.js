import Joi from "joi";

const getQueueValidation = Joi.object({
  query: Joi.string().optional(),
  status: Joi.alternatives()
    .try(
      Joi.string()
        .valid("menunggu", "diperiksa", "selesai", "terlewat")
        .allow(""),
      Joi.array().items(
        Joi.string().valid("menunggu", "diperiksa", "selesai", "terlewat")
      )
    )
    .optional(),
  page: Joi.number().positive().min(1).default(1),
  limit: Joi.number().max(10).default(10),
  sortBy: Joi.string().optional(),
  sortOrder: Joi.string().optional(),
});

const getQueueStatusValidation = Joi.string().optional();

const deleteQueueValidation = Joi.boolean().optional();

export { getQueueValidation, getQueueStatusValidation, deleteQueueValidation };
