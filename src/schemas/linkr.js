import Joi from "joi";

const schemaLinkr = Joi.object({
  link: Joi.string().uri().required(),
  description: Joi.string().allow("").optional(),
  hashtags: Joi.array().items(Joi.string()),
});

export default schemaLinkr;
