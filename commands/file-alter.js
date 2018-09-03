const colors = require( "colors")
const sqlite3 = require('sqlite3').verbose();

class FileAlter {

  constructor(name, desc) {
    this.name = name
    this.desc = desc
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
    db.run(`UPDATE fileList SET desc = ? WHERE name = ?`, [this.desc, this.name], (err) => {
      err ? console.log(`Alter failed...`.red) : console.log(`Alter success!`.blue);
    });
    db.close();
  }
};

const file = new FileAlter(process.argv[3], process.argv[4]);
file.make();