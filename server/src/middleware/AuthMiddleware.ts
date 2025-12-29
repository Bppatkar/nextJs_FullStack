import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Params:', req.params);
  console.log('Query:', req.query);

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: 401, message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  const jwtSecret = process.env.JWT_SECRET as string;

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(401).json({ status: 401, message: 'Unauthorized' });
    }
    req.user = user as AuthUser;
    next();
  });
};

export default authMiddleware;
