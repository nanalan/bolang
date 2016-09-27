const args = require('command-line-args')([
  { name: 'out', alias: 'o', type: String },
  { name: 'src', type: String, defaultOption: true }
])

const chalk = require('chalk')
const cardinal = require('cardinal')
const pretty = require('js-object-pretty-print').pretty

const make = require('nearley-make')
const fs = require('fs')
let parser = make(fs.readFileSync(`${__dirname}/bolang.ne`, 'utf8'))

function bolang(raw, out) {
  let lines = raw.split('\n')
    .map(line => line/*.substr(0, line.lastIndexOf('--'))*/.trim())
    .filter(line => line.length > 0)
    .join('\n')
    + '\n'

  let trees = parser.feed(lines).results
  for(let tree of trees) {
    console.log('\n' + cardinal.highlight(pretty(tree, 2)))
  }
}

bolang(fs.readFileSync(args.src, 'utf8'), args.out)
