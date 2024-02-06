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
import { UserEntity } from './UserEntitty';



@Entity('auth_provider')
export class AuthProviderEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

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

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
