import { Service } from 'typedi';

import { v4 as uuidv4 } from 'uuid';

import { BaseTransactionable } from './base/BaseTransactionTable';
import { BaseModel } from './models/BaseModel';

@Service()
export class BaseService extends BaseTransactionable {
  constructor() {
    super();
  }

  public addIdAndTimestamps(model: BaseModel): void {
    const now = new Date();
    model.id = this.createUuid();
    model.createdAt = now;
    model.updatedAt = now;
  }

  private createUuid(): string {
    return uuidv4();
  }
}
