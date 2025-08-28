import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UploadService } from 'src/modules/upload/upload.service';

@Injectable()
export class SignedUrlInterceptor implements NestInterceptor {
  constructor(private readonly uploadService: UploadService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const userId = request.user?._id;

    return next
      .handle()
      .pipe(mergeMap((data) => from(this.addSignedUrls(data, userId))));
  }

  private async addSignedUrls(entity: any, userId: string) {
    if (!entity) return entity;

    // Handle arrays
    if (Array.isArray(entity)) {
      return Promise.all(
        entity.map((item) => this.addSignedUrls(item, userId)),
      );
    }

    // Convert mongoose doc to plain object if needed
    if (entity.toObject) {
      entity = entity.toObject();
    }

    // Handle user.profile.profilePicture
    if (entity?.profile?.profilePicture) {
      entity.profile.profilePicture = await this.sign(
        entity.profile.profilePicture,
        userId,
        'profile-pictures',
      );
    }

    // Handle top-level user.profilePicture (if exists)
    if (entity?.profilePicture) {
      entity.profilePicture = await this.sign(
        entity.profilePicture,
        userId,
        'profile-pictures',
      );
    }

    // Cover image (single file)
    if (entity?.coverImage) {
      entity.coverImage = await this.sign(
        entity.coverImage,
        userId,
        'cover-images',
      );
    }

    // Profile images (array of files)
    if (entity?.profileImages && Array.isArray(entity.profileImages)) {
      entity.profileImages = await Promise.all(
        entity.profileImages.map((img: string) =>
          this.sign(img, userId, 'profile-images'),
        ),
      );
    }

    return entity;
  }

  private async sign(filePath: string, userId: string, folder: string) {
    const { signedUrl } = await this.uploadService.generateSignedUrl(
      userId,
      filePath,
      folder,
    );
    return signedUrl;
  }
}
