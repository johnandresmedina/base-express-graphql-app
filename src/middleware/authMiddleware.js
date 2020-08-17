import { verify } from 'jsonwebtoken';

const authMiddleWare = (request, response, next) => {
  const { authorization } = request.headers;

  if (authorization) {
    try {
      const token = authorization.split(' ')[1];
      const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
      request.userId = userId;

      next();
    } catch (error) {
      response.status(401).json({ msg: 'Token is not valid' });
    }
  } else {
    response.status(401).json({ msg: 'Authorization denied' });
  }
};

export default authMiddleWare;
