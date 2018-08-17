const fs = require('fs')
const gm = require('gm')
const request = require('request')

class Image {

  constructor(coverBg, cover, title, author, num) {
    this.coverBg = coverBg
    this.cover = cover
    this.title = title
    this.author = author
    this.num = num
  }

  async make() {
    this.cover = await this.getImage(this.cover)
    // start
    gm(this.coverBg)
    .draw('image Over 10, 10, 140, 140 "' + this.cover + '"')
    .font('./font/微软雅黑.ttf')
    .drawText(10, 186, this.title)
    .fontSize(12)
    .drawText(10, 214, this.author)
    .drawText(10, 240, this.num.toString() + '次播放')
    .fontSize(18)
    .fill('#000')
    .write(this.getImagePath(), err => {
      err && console.log(err.message || '出错了！');
      // delete cover
      fs.unlink(this.cover, err => {
        err && console.log(err.message || '删除失败！')
      })
    })
    console.log('Done...（请查看data目录）')
  }

  async getImage(url) {
    let state = await new Promise((resolve) => {
      fs.exists(url, exists => {
        resolve(exists ? true : false)
      })
    }).catch(err => {
      console.log('image not exist')
    });
    if (state) {
      return url
    }

    let name = this.getImagePath()
    let exsist = await new Promise(resolve => {
      gm(request(url)).write(name, err => {
        resolve(err)
      })
    })
    if (!exsist) {
      return name
    } else {
      console.log('image save fail')
    }
  }

  getImagePath() {
    return './data/' + this.getImageName()
  }
  getImageName() {
    return Date.now() + this.getRandomInt(1000) + '.png'
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

}

const image = new Image(
  './images/cover.png',
  'http://p1.music.126.net/eMAnm5YCLJfCTLl5cHxAGg==/109951163460988989.jpg?param=140y140',
  'Hello World哈哈',
  'Heelo sdfs 哇咔咔',
  290000
)
image.make()