import mysql = require('mysql');

export class MySqlService {

  constructor(private config: DatabaseConfig) {}
  
  private dbCredentials = {
        host: this.config.host,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database
      }
  
  public storedProcedure(proc: string): Promise<any> {
    return new Promise((resolve, reject) => {
        var connection = mysql.createConnection(this.dbCredentials);
        connection.query(`CALL ${proc}`, true, (error, results, fields) => {
            if (error) return reject(console.error(error.message));
        
            resolve(results[0]);
        });

        connection.end();
    });
  }
}