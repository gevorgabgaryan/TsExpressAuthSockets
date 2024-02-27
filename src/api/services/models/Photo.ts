import { AutoMap } from '@nartc/automapper';
import { IsNotEmpty } from 'class-validator';
import { BaseModel } from './BaseModel';
import { User } from './User';

export class Photo extends BaseModel {
  @AutoMap()
  @IsNotEmpty()
  public name: string;

  @AutoMap()
  @IsNotEmpty()
  public url: string;

  @AutoMap()
  @IsNotEmpty()
  public user: User;
}
