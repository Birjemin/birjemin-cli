const colors = require( "colors")
const sqlite3 = require('sqlite3').verbose();

class FileList {
  async make() {
    let db = new sqlite3.Database(`./data/file.db`);
    db.run(`CREATE TABLE IF NOT EXISTS fileList (name TEXT, desc TEXT)`);
    let list = await new Promise(resolve => {
      db.all(`SELECT * FROM fileList`, (err, row) => {
        err ? resolve(false) : resolve(row);
      });
    });
    db.close();
    if (!list) {
      console.log(`Empty file!`.red);
      return
    }
    let res = await new Promise(resolve => {
      let str = '';
      list.forEach(el => {
        str += el.name.red + ' -> ' + el.desc.green + '\t';
      });
      resolve(str);
    });
    console.log(res);
  }
};

const file = new FileList();
file.make();
