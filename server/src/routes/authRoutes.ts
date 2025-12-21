import { Router, Response, Request } from 'express';
import {
  forgetPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
} from '../validations/authValidation.js';
import { formatError, ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authLimiter } from '../lib/rate.limit.js';
import logger from '../lib/logger.js';
import prisma from '../lib/prisma.js';
import { generateRandomNum, renderEmailEjs } from '../helper.js';
import { emailQueue, emailQueueName } from '../jobs/EmailJob.js';
// import authMiddleware from '../middleware/AuthMiddleware.js';

const router = Router();

router.post('/register', authLimiter, async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = registerSchema.parse(body);

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (user) {
      return res.status(422).json({
        errors: {
          email: 'Email already taken.please use another one.',
        },
      });
    }
    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);

    const id = generateRandomNum();
    const token = await bcrypt.hash(id, salt);
    const url = `${process.env.APP_URL}/verify/email/?email=${payload.email}&token=${token}`;
    console.log('🔗 Verification URL:', url);

    const html = await renderEmailEjs('verify-email', {
      name: payload.name,
      url: url,
    });

    console.log('📧 Generated HTML length:', html.length);
    console.log('📧 HTML preview (first 200 chars):', html.substring(0, 200));

    await emailQueue.add(emailQueueName, {
      to: payload.email,
      subject: 'Please verify your email Clash',
      html: html,
    });

    await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: payload.password,
        email_verify_token: token,
      },
    });
    return res.status(200).json({
      message: 'User Registered Successfully',
    });
  } catch (error) {
    console.log('The error is:', error);

    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: 'Invalid data', errors });
    } else {
      logger.error({ type: 'Register Error', body: JSON.stringify(error) });
      res
        .status(500)
        .json({ error: 'Something went wrong.please try again!', data: error });
    }
  }
});

// router.post('/login', authLimiter, async (req: Request, res: Response) => {
//   try {
//   } catch (error) {
//     if (error instanceof ZodError) {
//       const errors = formatError(error);
//       res.status(422).json({ message: 'Invalid data', errors });
//     } else {
//       logger.error({ type: 'Auth Error', body: error });
//       res
//         .status(500)
//         .json({ error: 'Something went wrong.please try again!', data: error });
//     }
//   }
// });

// router.post(
//   '/check/login',
//   authLimiter,
//   async (req: Request, res: Response) => {
//     try {
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errors = formatError(error);
//         res.status(422).json({ message: 'Invalid login data', errors });
//       } else {
//         logger.error({ type: 'Auth Error', body: error });
//         res.status(500).json({
//           error: 'Something went wrong.please try again!',
//           data: error,
//         });
//       }
//     }
//   }
// );

// router.post(
//   '/forget-password',
//   authLimiter,
//   async (req: Request, res: Response) => {
//     try {
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errors = formatError(error);
//         return res.status(422).json({ message: 'Invalid data', errors });
//       } else {
//         logger.error({ type: 'Auth Error', body: error });
//         return res.status(500).json({
//           error: 'Something went wrong.please try again!',
//           data: error,
//         });
//       }
//     }
//   }
// );

// router.post(
//   '/reset-password',
//   authLimiter,
//   async (req: Request, res: Response) => {
//     try {
//     } catch (error) {
//       if (error instanceof ZodError) {
//         const errors = formatError(error);
//         return res.status(422).json({ message: 'Invalid data', errors });
//       } else {
//         logger.error({ type: 'Auth Error', body: error });
//         return res.status(500).json({
//           error: 'Something went wrong.please try again!',
//           data: error,
//         });
//       }
//     }
//   }
// );

// router.get('/user', authMiddleware, async (req: Request, res: Response) => {
//   const user = req.user;
//   await testQueue.add(testQueueName, user);
//   return res.json({ message: 'Fetched', user });
// });

export default router;
