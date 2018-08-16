const jimp = require('jimp')

class Image {

  constructor(coverBg, cover, title, author, num) {
    this.coverBg = coverBg
    this.cover = cover
    this.title = title
    this.author = author
    this.num = num
  }

  async make() {
    let info = await jimp.read(this.cover).then( res => { return res }).catch( err => { console.log(err) })
    let titleFont = await jimp.loadFont(jimp.FONT_SANS_16_BLACK).then( font => { return font}).catch( err => { console.log(err) });
    let numFont = await jimp.loadFont(jimp.FONT_SANS_12_BLACK).then( font => { return font}).catch( err => { console.log(err) });
    
    await jimp.read(this.coverBg).then(lenna => {
      lenna.blit(info, 10, 10)
      .print(titleFont, 10, 166, this.title)
      .print(titleFont, 10, 194, this.author)
      .print(numFont, 10, 220, this.num.toString())
      .write('./data/' + this.getImageName())
    }).catch( err => {
      console.log('[Error] ' + err)
    })
    console.log('Done...（请查看data目录）')
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
  'Hello World',
  'Heelo sdfs dkddkdd',
  290000
)
image.make()