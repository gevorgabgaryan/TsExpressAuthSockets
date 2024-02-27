import { IsNotEmpty } from 'class-validator';
import { AutoMap } from '@nartc/automapper';

export class PhotoResponse {
  @AutoMap()
  @IsNotEmpty()
  public name: string;

  @AutoMap()
  @IsNotEmpty()
  public url: string;
}
