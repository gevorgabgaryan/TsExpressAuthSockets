import Jimp from 'jimp';
import { Service } from 'typedi';
import { UserRepository } from '../repositories/UserRepository';
import { BaseService } from './BaseService';
import { User } from './models/User';
import { PhotoService } from './PhotoService';

@Service()
export class UserService extends BaseService {

  constructor(private photoService: PhotoService) {
    super()
  }
  public getUser(userId: string): Promise<User | null> {
    return UserRepository.findById(userId);
  }

  public async makeUserOnline(userId: string): Promise<User> {
    return await UserRepository.makeOnline(userId);
  }

  public async makeUserOffline(userId: string): Promise<User> {
    return await UserRepository.makeOffline(userId);
  }

  public async uploadPhoto(user: User, file: Express.Multer.File): Promise<void> {
    try {
      return await this.transaction(async (unitOfWork) => {
        const savedPhoto = await this.photoService.savePhoto(file, user, unitOfWork);

        const sizes = [
          { suffix: '_icon', width: 100, height: 100 },
          { suffix: '_normal', width: 300, height: 300 },
          { suffix: '_large', width: 500, height: 500 },
        ];

       for (const size of sizes) {
          const resizedFilePath = await this.resizeAndSave(file.path, size.width, size.height, size.suffix);
        }

        if (!user.photos) {
          user.photos = [];
        }
        user.photos.push(savedPhoto);
        await unitOfWork.userRepository.save(user);
      });
    } catch (error: any) {
        throw error;
    }
  }

  private async resizeAndSave(filePath: string, width: number, height: number, suffix: string): Promise<string> {
    const image = await Jimp.read(filePath);
    image.resize(width, height);
    const outputPath = filePath.replace(/(\.[\w\d_-]+)$/i, `${suffix}$1`);
    await image.writeAsync(outputPath);
    return outputPath;
  }

}
