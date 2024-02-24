import { Service } from 'typedi';
import { EntityManager } from 'typeorm';
import appDataSource from '../../../db/appDataSource';
import { UnitOfWork } from '../../repositories/UnitOfWork/UnitOfWork';



@Service()
export abstract class BaseTransactionable {
  protected async transaction<T>(runInTransaction: (unitOfWork: UnitOfWork) => Promise<T>): Promise<T> {
    const result = await appDataSource.transaction(async (manager: EntityManager) => {
      return runInTransaction(UnitOfWork.create(manager));
    });
    return result;
  }
}
