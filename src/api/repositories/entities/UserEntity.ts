import 'reflect-metadata';
import { Entity, Column, Index, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { UserRole } from '../../enums/UserRole';

import { AutoMap } from '@nartc/automapper';
import { AuthProviderEntity } from './AuthProviderEntity';
import { UserStatus } from '../../enums/UserStatuses';
import { BaseEntity } from './BaseEntity';
import { PhotoEntity } from './PhotoEntity';

@Entity('users')
export class UserEntity  extends BaseEntity {
  @AutoMap()
  @IsOptional()
  @Column({ name: 'first_name', type: 'varchar', length: 25 })
  public firstName: string;

  @AutoMap()
  @IsOptional()
  @Column({ name: 'last_name', type: 'varchar', length: 25 })
  public lastName: string;

  @AutoMap()
  @IsEmail()
  @Index({ unique: true })
  @Column()
  public email: string;

  @AutoMap()
  @IsOptional()
  @Column({ name: 'password_hash', nullable: true })
  public passwordHash: string;

  @AutoMap()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NEW })
  public status: string;

  @AutoMap()
  @IsOptional()
  @Column({ name: 'verification_token', nullable: true })
  verificationToken: string;

  @AutoMap()
  @Column({ name: 'is_email_sent', default: false })
  isEmailSent: boolean;

  @AutoMap()
  @Column({ name: 'reset_password_token', nullable: true })
  resetPasswordToken: string;

  @OneToMany(() => AuthProviderEntity, (provider) => provider.user)
  public authProviders: AuthProviderEntity[];

  @AutoMap()
  @Column({ name: 'is_online', type: 'boolean', default: false })
  isOnline: boolean;

  @AutoMap()
  @OneToMany(() => PhotoEntity, (photo) => photo.user)
  @ValidateNested({ each: true })
  photos: PhotoEntity[];
}
