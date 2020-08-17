import { check, validationResult } from 'express-validator';

const validate = (request, response, next) => {
  const errors = validationResult(request);

  if (errors.isEmpty()) {
    next();
  } else {
    response.status(400).json({ errors: errors.array() });
  }
};

const validateUser = async (request, response, next) => {
  await Promise.all([
    check('name', 'Name is required').not().isEmpty().run(request),
    check('email', 'Please include a valid email').isEmail().run(request),
    check('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
      .run(request),
  ]);

  validate(request, response, next);
};

export default validateUser;
