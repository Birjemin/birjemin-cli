const cheerio = require('cheerio')
const fs = require('fs')
const request = require('superagent')
const { prompt } = require('inquirer')

class Spider {

  constructor(url) {
    this.url = url
  }

  async dispatch() {
    try {
      let html = await this.request()
      if (!html) {
        throw 'url not correct'
      }
      let list = await this.parseHtml(html)
      let res = await this.writeFile(list)
      console.log('Done...（请查看album.json）')
    } catch(err) {
      console.log('[Error]' + err)
    }
  }

  async request() {
    let res = await new Promise((resolve) => {
        request.get(this.url).end((err, res) => {
          resolve(res.text)
      });
    }).catch(error => {
      resolve('')
    })
    return res
  }

  parseHtml(html) {
    let $ = cheerio.load(html)
    let res = []
    $('#m-pl-container').find('li').map((index, element) => {
      let list = {
        cover: $(element).find('.u-cover img').attr('src'),
        url: 'http://music.163.com' + $(element).find('.u-cover .msk').attr('href'),
        title: $(element).find('.u-cover .msk').attr('title'),
        num: parseInt($(element).find('.u-cover .nb').text().replace('万', '0000')),
        author: $(element).find('.nm').text(),
        author_addr: 'http://music.163.com' + $(element).find('.nm').attr('href')
      }
      res.push(list)
    })
    return res
  }

  async writeFile(list) {
    let res = await new Promise((resolve) => {
        fs.writeFile('./data/album.json', JSON.stringify(list), 'utf-8', err => {
        if (err) throw err
        else resolve('成功')
      });
    }).catch(error => {
      resolve({})
    })
    return res
  }
}

const question = [
  {
    type: 'input',
    name: 'type',
    message: '请输入歌曲风格(默认：民谣):',
    default: '民谣'
  }, {
    type: 'input',
    name: 'order',
    message: '请输入类别序号(默认：1),1 - 热门    2 - 最新:',
    default: 1,
    validate(val) {
      if ([1, 2].includes(parseInt(val))) {
        return true
      }
      return '类别序号不合法'
    }
  }
]

module.exports = prompt(question).then(({ type, order }) => {
  order = order == 1 ? 'hot' : 'new'
  let targetUrl = 'https://music.163.com/discover/playlist/?order=' + order + '&cat=' + encodeURI(type)
  const p = new Spider(targetUrl)
  p.dispatch()
})
