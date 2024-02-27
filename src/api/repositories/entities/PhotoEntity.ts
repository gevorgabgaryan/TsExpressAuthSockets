import { Entity, Column, ManyToOne } from 'typeorm';
import { IsUrl, IsString } from 'class-validator';
import { BaseEntity } from './BaseEntity';
import { AutoMap } from '@nartc/automapper';
import { UserEntity } from './UserEntity';

@Entity('photos')
export class PhotoEntity extends BaseEntity {
  @AutoMap()
  @Column({ default: 'Avatar' })
  @IsString()
  name: string;

  @AutoMap()
  @Column()
  @IsUrl()
  url: string;

  @AutoMap()
  @ManyToOne(() => UserEntity, (user) => user.photos)
  user: UserEntity;
}
