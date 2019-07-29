const mysql = require('mysql');

// DB properties

const database = {
    host: '127.0.0.1',
    port : 3306,
    user : 'root',
    pass : 'password',
    database : 'craftDemo'
}


class DBA {
    
    getConnection() {
        this.connnection = mysql.createConnection( {
            host: '127.0.0.1',
            port : 3306,
            user : 'root',
            pass : 'password',
            database : 'craftDemo'
        }
        );
        this.connnection.connect((result) => console.log(result) );
    }

    constructor() {
      //  this.getConnection();
    }

    getData(sql) {
        if(!this.connnection) {
           this.getConnection();
        }
        return this.connnection.query(sql);
    }
}

module.exports  = DBA;