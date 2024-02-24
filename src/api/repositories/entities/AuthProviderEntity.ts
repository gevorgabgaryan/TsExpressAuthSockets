import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AutoMap } from '@nartc/automapper';
import { IsNotEmpty } from 'class-validator';
import { UserEntity } from './UserEntity';
import { BaseEntity } from './BaseEntity';
@Entity('auth_provider')
export class AuthProviderEntity extends BaseEntity {
  @AutoMap()
  @IsNotEmpty()
  @Column('uuid', { name: 'user_id' })
  public userId: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'provider' })
  public provider: string;

  @AutoMap()
  @IsNotEmpty()
  @Column({ name: 'provider_id' })
  public providerId: string;

  @ManyToOne(() => UserEntity, (user) => user.authProviders)
  @JoinColumn({ name: 'user_id' })
  public user: UserEntity;
}
