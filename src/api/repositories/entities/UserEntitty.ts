import 'reflect-metadata';
import { Entity, Column, Index, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { UserRole } from '../../enums/UserRole';
import { UserStatus } from '../../enums/UserStatuses';
import { AutoMap } from '@nartc/automapper';

@Entity('users')
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'first_name', type: 'varchar', length: 25 })
  public firstName: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'last_name', type: 'varchar', length: 25 })
  public lastName: string;

  @AutoMap()
  @IsEmail()
  @Index({ unique: true })
  @Column()
  public email: string;

  @AutoMap()
  @Column({ name: 'password_hash' })
  public passwordHash: string;

  @AutoMap()
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.NEW })
  public status: string;

  @AutoMap()
  @Column({ name: 'verification_token' })
  @IsNotEmpty()
  verificationToken: string;

  @AutoMap()
  @Column({ name: 'is_email_sent', default: false })
  isEmailSent: boolean;

  @AutoMap()
  @Column({ name: 'reset_password_token' })
  @IsNotEmpty()
  resetPasswordToken: string;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
