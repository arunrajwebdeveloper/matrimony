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
import { FOLDER_TYPES } from 'src/common/constants/folder.type';
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseGuards(JwtAuthGuard) // require authentication
  @Post('profile-picture')
  @UseInterceptors(
    FileInterceptor('file', multerConfig(FOLDER_TYPES.PROFILE_PICTURES)),
  )
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    return {
      success: true,
      filename: file.filename,
      path: `uploads/${FOLDER_TYPES.PROFILE_PICTURES}/${file.filename}`,
    };
  }

  @UseGuards(JwtAuthGuard) // require authentication
  @Post('cover-image')
  @UseInterceptors(
    FileInterceptor('file', multerConfig(FOLDER_TYPES.COVER_IMAGES)),
  )
  async uploadCoverImages(@UploadedFile() file: Express.Multer.File) {
    return {
      success: true,
      filename: file.filename,
      path: `uploads/${FOLDER_TYPES.COVER_IMAGES}/${file.filename}`,
    };
  }

  @UseGuards(JwtAuthGuard) // require authentication
  @Post('profile-photos')
  @UseInterceptors(
    FilesInterceptor('files', 6, multerConfig(FOLDER_TYPES.PROFILE_PHOTOS)),
  )
  async uploadProfileImages(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      success: true,
      files: files.map((file) => ({
        filename: file.filename,
        path: `uploads/${FOLDER_TYPES.PROFILE_PHOTOS}/${file.filename}`,
      })),
    };
  }

  @UseGuards(JwtAuthGuard) // require authentication
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
    const payload = await this.uploadService.validateSignedUrl(token);

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
