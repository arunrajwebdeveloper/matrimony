// src/files/files.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import * as fs from 'fs';
import * as jwt from 'jsonwebtoken';

@Controller('files')
export class FilesController {
  private secret = 'super-secret-key'; // ⚠️ move to ENV in prod

  @Get('sign/:filename')
  getSignedUrl(@Param('filename') filename: string) {
    const token = jwt.sign({ filename }, this.secret, { expiresIn: '5m' });
    return { url: `/files/view/${filename}?token=${token}` };
  }

  @Get('view/:filename')
  async viewFile(
    @Param('filename') filename: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    try {
      const payload = jwt.verify(token, this.secret) as any;
      if (payload.filename !== filename) throw new UnauthorizedException();

      const filePath = join(__dirname, '..', '..', 'uploads', filename);
      if (!fs.existsSync(filePath)) return res.status(404).send('Not found');

      return res.sendFile(filePath);
    } catch {
      throw new UnauthorizedException('Invalid/expired token');
    }
  }
}
