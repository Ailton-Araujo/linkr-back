import Joi from "joi";

const schemaLike = Joi.object({
  userId: Joi.number().integer().required(),
  postId: Joi.number().integer().required(),
  type: Joi.any().valid("like", "dislike").required(),
});

export default schemaLike;
