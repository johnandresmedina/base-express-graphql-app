import { Router } from 'express';
import { compare } from 'bcryptjs';

import validateLogin from './validator';
import User from '../../models/User';
import { createAccessToken } from '../../helpers/authHelper';

const router = Router();

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post('/login', validateLogin, async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await compare(password, user.password);

      if (isMatch) {
        const accesstoken = createAccessToken(user.id);

        response.send({
          accesstoken,
          email,
        });
      } else {
        response.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
      }
    } else {
      response.status(400).json({ errors: [{ msg: 'Invalid Credentials' }] });
    }
  } catch (error) {
    console.error(error.message);
    response.status(500).send('Server error');
  }
});

router.post('/logout', (request, response) => {
  response.clearCookie('refreshtoken', { path: '/refresh_token' });

  return response.send({ msg: 'Logged out' });
});

export default router;
