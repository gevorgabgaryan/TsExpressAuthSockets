import { API } from './api';
import { TypeORM } from './db';

(async () => {
  try {
    await TypeORM.init();
    await API.init();
  } catch (e) {
    console.log(e);
  }
})();
