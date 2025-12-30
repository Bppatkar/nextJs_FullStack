import { Router, Response, Request, NextFunction } from 'express';

import { ZodError } from 'zod';
import { clashSchema } from '../validations/clashValidation.js';
import { formatError, imageValidator, removeImage } from '../helper.js';
import logger from '../lib/logger.js';
import { singleUpload, clashItemsUpload } from '../lib/multer.js';
import prisma from '../lib/prisma.js';
import authMiddleware from '../middleware/AuthMiddleware.js';
const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`=== CLASH ROUTE HIT ===`);
  console.log(`Time: ${new Date().toISOString()}`);
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.originalUrl}`);
  console.log(`Path: ${req.path}`);
  console.log(
    `Full URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
  );
  console.log('Params:', JSON.stringify(req.params));
  console.log('Query:', JSON.stringify(req.query));

  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    console.log('Body keys:', Object.keys(req.body || {}));
  } else {
    console.log('Body: (not logged for GET/DELETE)');
  }

  // Fix: Check if req.body exists before calling Object.keys
  if (req.body && typeof req.body === 'object') {
    console.log('Body keys:', Object.keys(req.body));
  } else {
    console.log('Body:', req.body);
  }

  console.log(`=======================`);
  next();
});

router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const clashs = await prisma.clash.findMany({
      where: { user_id: req.user?.id },
    });
    return res.json({ message: 'Data Fetched', data: clashs });
  } catch (error) {
    logger.error({ type: 'Clash Post Error', body: error });
    res
      .status(500)
      .json({ error: 'Something went wrong.please try again!', data: error });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    console.log('Request params:', req.params);
    console.log('Request query:', req.query);

    const { id } = req.params;

    console.log('ID from params:', id);
    console.log('ID as number:', Number(id));

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    const clash = await prisma.clash.findUnique({
      where: { id: Number(id) },
      include: {
        ClashItem: {
          select: {
            image: true,
            id: true,
            count: true,
          },
        },
        ClashComments: {
          select: {
            id: true,
            comment: true,
            created_at: true,
          },
          orderBy: {
            id: 'desc',
          },
        },
      },
    });

    if (!clash) {
      return res.status(404).json({ message: 'Clash not found' });
    }

    const data = {
      id: clash.id,
      user_id: clash.user_id,
      title: clash.title,
      description: clash.description,
      image: clash.image,
      created_at: clash.created_at,
      expire_at: clash.expire_at,
      ClashItem: clash.ClashItem || [],
      ClashComments: clash.ClashComments || [],
    };

    console.log('Found clash:', data);
    return res.json({ message: 'Data Fetched', data: clash });
  } catch (error) {
    logger.error({ type: 'Clash get Error', body: error });
    res
      .status(500)
      .json({ error: 'Something went wrong.please try again!', data: error });
  }
});

router.put(
  '/:id',
  authMiddleware,
  singleUpload,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'Invalid ID parameter' });
      }

      const body = req.body;
      const payload = clashSchema.parse(body);
      if (req.file) {
        const image = req.file;
        const validMsg = imageValidator(image?.size, image?.mimetype);
        if (validMsg) {
          return res.status(422).json({ errors: { image: validMsg } });
        }

        // * Delete Old Image
        const clash = await prisma.clash.findUnique({
          select: { id: true, image: true },
          where: { id: Number(id) },
        });
        if (clash?.image) removeImage(clash.image);
        payload.image = req.file.filename.trim();
      }
      await prisma.clash.update({
        data: payload,
        where: { id: Number(id) },
      });
      return res.json({ message: 'Clash updated successfully!' });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        res.status(422).json({ message: 'Invalid data', errors });
      } else {
        logger.error({ type: 'Clash Post Error', body: error });
        res.status(500).json({
          error: 'Something went wrong.please try again!',
          data: error,
        });
      }
    }
  }
);

router.post(
  '/',
  authMiddleware,
  singleUpload,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = clashSchema.parse(body);

      if (req.file) {
        const image = req.file;
        const validMsg = imageValidator(image?.size, image?.mimetype);
        if (validMsg) {
          return res.status(422).json({ errors: { image: validMsg } });
        }
        payload.image = req.file.filename.trim();
      } else {
        return res
          .status(422)
          .json({ errors: { image: 'Image field is required.' } });
      }

      await prisma.clash.create({
        data: {
          title: payload.title,
          description: payload?.description,
          image: payload?.image,
          user_id: req.user?.id!,
          expire_at: new Date(payload.expire_at),
        },
      });
      return res.json({ message: 'Clash created successfully!' });
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = formatError(error);
        res.status(422).json({ message: 'Invalid data', errors });
      } else {
        logger.error({ type: 'Clash Post Error', body: error });
        res.status(500).json({
          error: 'Something went wrong.please try again!',
          data: error,
        });
      }
    }
  }
);

router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: 'Invalid ID parameter' });
    }

    const clash = await prisma.clash.findUnique({
      select: { image: true, user_id: true },
      where: { id: Number(id) },
    });

    if (!clash) {
      return res.status(404).json({ message: 'Clash not found' });
    }

    if (clash.user_id !== req.user?.id) {
      return res.status(401).json({ message: 'Un Authorized' });
    }
    if (clash.image) removeImage(clash.image);

    const clashItems = await prisma.clashItem.findMany({
      select: {
        image: true,
      },
      where: {
        clash_id: Number(id),
      },
    });

    // * Remove Clash items images
    if (clashItems.length > 0) {
      clashItems.forEach((item) => {
        removeImage(item.image);
      });
    }

    await prisma.clash.delete({
      where: { id: Number(id) },
    });
    return res.json({ message: 'Clash Deleted successfully!' });
  } catch (error) {
    logger.error({ type: 'Clash Error', error });
    return res.status(500).json({ message: 'Something went wrong' });
  }
});

//  To add items
router.post(
  '/items',
  authMiddleware,
  clashItemsUpload,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.body;

      if (!id || isNaN(Number(id))) {
        return res
          .status(400)
          .json({ error: 'Invalid ID parameter in request body' });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length < 2) {
        return res
          .status(422)
          .json({ message: 'Please select at least 2 images for clashing.' });
      }
      const images = req.files as Express.Multer.File[];
      let imgErrors: string[] = [];

      images.forEach((img) => {
        const validMsg = imageValidator(img?.size, img?.mimetype);
        if (validMsg) {
          imgErrors.push(validMsg);
        }
      });

      if (imgErrors.length > 0) {
        return res.status(422).json({ errors: imgErrors });
      }

      const uploadedImages: string[] = images.map((img) => img.filename.trim());

      // Create clash items in database
      for (const imageName of uploadedImages) {
        await prisma.clashItem.create({
          data: {
            image: imageName,
            clash_id: Number(id),
          },
        });
      }

      return res.json({ message: 'Clash Items updated successfully!' });
    } catch (error) {
      logger.error({ type: 'Clash Item', body: JSON.stringify(error) });
      return res
        .status(500)
        .json({ message: 'Something went wrong.please try again' });
    }
  }
);

export default router;
