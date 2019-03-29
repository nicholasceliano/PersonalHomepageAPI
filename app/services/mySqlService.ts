import mysql = require('mysql');
import { Logger } from 'winston';

export class MySqlService {

  private dbCredentials = {
    database: this.config.database,
    host: this.config.host,
    password: this.config.password,
    user: this.config.user,
  };

  constructor(private config: DatabaseConfig,
              private logger: Logger) {}

  public storedProcedure(proc: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.logger.info(`Connection Open: ${this.dbCredentials.database} storedProcedure ${proc}`);
      const connection = mysql.createConnection(this.dbCredentials);
      connection.query(`CALL ${proc}`, true, (error, results, fields) => {
          if (error) return reject(error.message);

          resolve(results[0]);
      });

      connection.end();
      this.logger.info(`Connection Closed: ${this.dbCredentials.database} storedProcedure ${proc}`);
    });
  }
}
