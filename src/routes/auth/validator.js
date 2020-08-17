import { check, validationResult } from 'express-validator';

const validate = (request, response, next) => {
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    next();
  } else {
    response.status(400).json({ errors: errors.array() });
  }
};

const validateLogin = async (request, response, next) => {
  await Promise.all([
    check('email', 'Please include a valid email').isEmail().run(request),
    check('password', 'Password is required').exists().run(request),
  ]);

  validate(request, response, next);
};

export default validateLogin;
