import { diskStorage, FileFilterCallback } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { FolderType } from 'src/common/constants/folder.type';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export interface MulterValidationOptions {
  allowedMimeTypes?: string[];
  maxSize?: number; // in bytes
}

export const multerConfig = (
  folder: FolderType,
  options: MulterValidationOptions = {},
) => ({
  storage: diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const uploadPath = join(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname));
    },
  }),
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    if (
      options.allowedMimeTypes &&
      !options.allowedMimeTypes.includes(file.mimetype)
    ) {
      throw new BadRequestException('Invalid file type');
    }
    cb(null, true);
  },
  limits: {
    fileSize: options.maxSize || 1 * 1024 * 1024, // default 1MB
  },
});
