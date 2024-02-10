import { AutoMap } from '@nartc/automapper';

export class User {
  @AutoMap()
  public id: string;

  @AutoMap()
  public firstName: string;

  @AutoMap()
  public lastName: string;

  @AutoMap()
  public email: string;

  @AutoMap()
  public passwordHash: string;

  @AutoMap()
  public status: string;

  @AutoMap()
  public role: string;

  @AutoMap()
  verificationToken: string;

  @AutoMap()
  isEmailSent: boolean;

  @AutoMap()
  resetPasswordToken: string;

  @AutoMap()
  isOnline: boolean;

  @AutoMap()
  public createdAt: Date;

  @AutoMap()
  public updatedAt: Date;

  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
