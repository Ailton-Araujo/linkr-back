import Joi from "joi";

const schemaComment = Joi.object({
  userId: Joi.number().integer().required(),
  postId: Joi.number().integer().required(),
  comment: Joi.string().required(),
});

export default schemaComment;
