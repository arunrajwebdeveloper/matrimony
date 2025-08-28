import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { UploadService } from 'src/modules/upload/upload.service';
import { FOLDER_TYPES } from '../constants/folder.type';

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

    // Handle arrays recursively
    if (Array.isArray(entity)) {
      return Promise.all(
        entity.map((item) => this.addSignedUrls(item, userId)),
      );
    }

    // Convert Mongoose doc to plain object
    if (entity.toObject) {
      entity = entity.toObject();
    }

    // Handle user.profile.profilePicture
    if (entity?.profile?.profilePicture) {
      entity.profile.profilePicture = await this.sign(
        entity.profile.profilePicture,
        userId,
        FOLDER_TYPES.PROFILE_PICTURES,
      );
    }

    // Handle top-level user.profilePicture (if exists)
    if (entity?.profilePicture) {
      entity.profilePicture = await this.sign(
        entity.profilePicture,
        userId,
        FOLDER_TYPES.PROFILE_PICTURES,
      );
    }

    // Cover image (single file)
    if (entity?.coverImage) {
      entity.coverImage = await this.sign(
        entity.coverImage,
        userId,
        FOLDER_TYPES.COVER_IMAGES,
      );
    }

    //  profile Photos (array of files)
    if (entity?.profilePhotos && Array.isArray(entity.profilePhotos)) {
      entity.profilePhotos = await Promise.all(
        entity.profilePhotos.map((img: string) =>
          this.sign(img, userId, FOLDER_TYPES.PROFILE_PHOTOS),
        ),
      );
    }

    // Activity list: actorId.profile.profilePicture
    if (entity?.actorId?.profile?.profilePicture) {
      entity.actorId.profile.profilePicture = await this.sign(
        entity.actorId.profile.profilePicture,
        userId,
        FOLDER_TYPES.PROFILE_PICTURES,
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

// NOTE: entity if condition

// const user1 = { profile: { profilePicture: "image.jpg" } };
// const user2 = { profile: {} };
// const user3 = {};

// console.log(!!(user1?.profile?.profilePicture)); // true
// console.log(!!(user2?.profile?.profilePicture)); // false
// console.log(!!(user3?.profile?.profilePicture)); // false
