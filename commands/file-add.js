const colors = require( "colors")
const sqlite3 = require('sqlite3').verbose();

class FileAdd {

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
    if (list) {
      console.log(`This file is exist, Please change name!`.red)
      return
    }
    db.run(`INSERT INTO fileList(name, desc) VALUES(?, ?)`, [this.name, this.desc], (err) => {
      err ? console.log(`Add failed...`.red) : console.log(`Add success!`.blue);
    });
    db.close();
  }
};

const file = new FileAdd(process.argv[3], process.argv[4])
file.make()
