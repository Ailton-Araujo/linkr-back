import Joi from "joi";

const schemaSignUp = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  pictureUrl: Joi.string().uri().required(),
});

export default schemaSignUp;
