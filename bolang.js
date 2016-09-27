const args = require('command-line-args')([
  { name: 'tree', alias: 't', type: Boolean },
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

  if(args.tree) {
    for(let tree of trees) {
      console.log('\n' + cardinal.highlight(pretty(tree, 2)))
    }
  }

  let compiled = compile(trees.pop())
  if(args.out) fs.writeFileSync(args.out, compiled)
  else process.stdout.write(compiled)
}

function compile(lines) {
  let res = [`/* compiled from bolang on ${(new Date).toLocaleDateString()} */`]
  let indent = 0
  const addLine = code => res.push('  '.repeat(indent) + code.trim())

  let vars = {}
  const gen = (k='$') => k+vars.length

  for(let line of lines) {
    ({
      // TODO
      print: l => addLine(`console.log(${expr(l.which)})`)
    })[line.what](line)
  }

  return res.join('\n')
}

function expr(e) {
  // TODO
  return "'" + e[1].replace(/'/g, "\\'") + "'"
}

bolang(fs.readFileSync(args.src, 'utf8'), args.out)
