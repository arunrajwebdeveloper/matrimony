import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Delete,
  Param,
  Req,
  Get,
  UseGuards,
  Res,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './upload.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UploadService } from './upload.service';
import { Response } from 'express';
import * as fs from 'fs';

@Controller('upload')
@UseGuards(JwtAuthGuard) // require authentication
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('profile-picture')
  @UseInterceptors(FileInterceptor('file', multerConfig('profile-pictures')))
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    return {
      success: true,
      filename: file.filename,
      path: `uploads/profile-pictures/${file.filename}`,
    };
  }

  @Post('cover-image')
  @UseInterceptors(FileInterceptor('file', multerConfig('cover-images')))
  async uploadCoverImages(@UploadedFiles() file: Express.Multer.File) {
    return {
      success: true,
      filename: file.filename,
      path: `uploads/cover-images/${file.filename}`,
    };
  }

  @Post('profile-images')
  @UseInterceptors(FilesInterceptor('files', 6, multerConfig('profile-images')))
  async uploadProfileImages(
    @Req() req: any,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return {
      success: true,
      files: files.map((file) => ({
        filename: file.filename,
        path: `uploads/profile-images/${file.filename}`,
      })),
    };
  }

  @Get('signed/:folder/:filename')
  async getSignedUrl(
    @Req() req: any,
    @Param('folder') folder: string,
    @Param('filename') filename: string,
  ) {
    return this.uploadService.generateSignedUrl(req.user._id, filename, folder);
  }

  @Get('file/:folder/:filename')
  async serveFile(
    @Param('folder') folder: string,
    @Param('filename') filename: string,
    @Query('token') token: string,
    @Res() res: Response,
  ) {
    const payload = this.uploadService.validateSignedUrl(token);

    if (payload.folder !== folder || payload.filename !== filename) {
      throw new UnauthorizedException('Invalid signed URL payload');
    }

    const filePath = this.uploadService.getFilePath(folder, filename);

    if (!fs.existsSync(filePath)) {
      throw new UnauthorizedException('File not found');
    }

    return res.sendFile(filePath);
  }
}
