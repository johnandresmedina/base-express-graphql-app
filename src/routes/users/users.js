import { Router } from 'express';
import { genSalt, hash } from 'bcryptjs';

import validateUser from './validator';
import User from '../../models/User';
import authMiddleWare from '../../middleware/authMiddleware';

const router = Router();

// @route POST api/users/register
// @desc Register User
// @access Public
router.post('/register', validateUser, async (request, response) => {
  const { name, email, password } = request.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      response.status(400).json({ errors: [{ msg: 'User already exists' }] });
    } else {
      const user = new User({
        name,
        email,
        password,
      });

      const salt = await genSalt(10);
      user.password = await hash(password, salt);
      await user.save();

      response.json({ user });
    }
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server error');
  }
});

router.get('/protected', authMiddleWare, async (request, response) => {
  const { userId } = request;

  if (userId !== null) {
    response.send({ data: 'This is protected data.' });
  }
});

export default router;
