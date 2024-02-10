import { Service } from 'typedi';
import { validate, ValidationError } from 'class-validator';

@Service()
export class WsValidator {
  async validate(object: Object): Promise<string[]> {
    const errors: ValidationError[] = await validate(object);

    if (errors.length > 0) {
      return errors.reduce((acc, error) => {
        const constraints = error.constraints;
        if (constraints) {
          acc.push(...Object.values(constraints));
        }
        return acc;
      }, [] as string[]);
    }

    return [];
  }
}
