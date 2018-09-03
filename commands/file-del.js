const colors = require( "colors")
const sqlite3 = require('sqlite3').verbose();

class FileDel {

  constructor(name) {
    this.name = name
  }

  async make() {
    let db = new sqlite3.Database(`./data/file.db`);
    db.run(`CREATE TABLE IF NOT EXISTS fileList (name TEXT, desc TEXT)`);
    let list = await new Promise(resolve => {
      db.get(`SELECT * FROM fileList WHERE name=?`, [this.name], (err, row) => {
        err ? resolve(false) : resolve(row);
      });
    });
    if (!list) {
      console.log(`This file is not exist, Please input another name!`.red)
      return
    }
    db.run(`DELETE FROM fileList WHERE name = ?`, [this.name], (err) => {
      err ? console.log(`Delete failed...`.red) : console.log(`Delete success!`.green);
    });
    db.close();
  }
};

const file = new FileDel(process.argv[3]);
file.make();
