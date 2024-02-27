import { CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { AutoMap } from '@nartc/automapper';

export class BaseEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @AutoMap()
  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @AutoMap()
  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
