#!/usr/bin/env node

process.env.NODE_PATH = __dirname + '/../node_modules/'

const { resolve } = require('path')
const res = (command) => resolve(__dirname, '../commands/', command)
const program = require('commander')
program.version(require('../package').version )
program.usage('<command>')
program
  .command('163')
  .description('爬网易云音乐歌单数据')
  .action(() => {
    require(res('music-163'))
  })
program
  .command('cover')
  .description('合成背景图(鸡肋)')
  .action(() => {
    require(res('cover'))
  })
program
  .command('cover2')
  .description('合成背景图（promotion）')
  .action(() => {
    require(res('cover2'))
  })
program
  .command('list')
  .description('描述每个项目')
  .action(() => {
    require(res('file-list'))
  })
program
  .command('add <dir> <desc>')
  .description('增加每个项目')
  .action(() => {
    require(res('file-add'))
  })
program
  .command('alter <dir> <desc>')
  .description('修改某个项目')
  .action(() => {
    require(res('file-alter'))
  })
program
  .command('del <dir>')
  .description('删除某个项目')
  .action((dir) => {
    require(res('file-del'))
  })

program.parse(process.argv)
if (!program.args.length) {
  program.help()
}