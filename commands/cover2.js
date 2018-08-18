const fs = require('fs')
const gm = require('gm')
const request = require('request')
const qr = require('qr-image')

class Image {

  constructor(coverBg, cover, url, title, author, num) {
    this.coverBg = coverBg
    this.cover = cover
    this.url = url
    this.title = title
    this.author = author
    this.num = num
    this.qr = '/data/thumb_qr.png'
    this.head = '/data/thumb_head.png'
  }

  async make() {
    await this.createHead()
    await this.createQr()
    // start
    gm(this.coverBg)
    .draw('image Over 10, 10, 140, 140 "' + this.head + '"')
    .draw('image Over 180, 180, 70, 70 "' + this.qr + '"')
    .font('./font/微软雅黑.ttf')
    .fill('#1B4548')
    .drawText(10, 172, this.title)
    .fontSize(11)
    .drawText(10, 204, '作者: ' + this.author)
    .drawText(10, 230, this.num.toString() + '次播放')
    .fontSize(12)
    .write(this.getImagePath(), err => {
      err && console.log(err.message || '出错了！');
      // delete cover
      fs.unlink(this.head, err => { err && console.log(err.message || '删除失败！') })
      fs.unlink(this.qr, err => { err && console.log(err.message || '删除失败！') })
    })
    console.log('Done...（请查看data目录）')
  }

  async createQr() {
    let qr_svg = qr.image(this.url, { type: 'png' });
    qr_svg.pipe(require('fs').createWriteStream(this.qr));
  }

  async createHead() {
    let state = await new Promise(resolve => {
      fs.exists(this.cover, exists => { resolve(exists ? true : false)})
    }).catch(err => { console.log('image not exist') });
    if (state) { return this.cover }

    let exsist = await new Promise(resolve => {
      gm(request(this.cover)).write(this.head, err => { resolve(err) })
    })
    exsist && console.log('image save fail')
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
  'http://p1.music.126.net/Cl0-NpZ0ESTDjJ1HmZ33KA==/109951163460576279.jpg?param=140y140',
  'http://music.163.com/playlist?id=2312165875',
  '100首华语民谣，因为懂得才有共鸣',
  '情思天鹅',
  240000
)
image.make()