require('get-stdin')().then(bolang).catch(console.error)

function bolang(raw) {
  const lines = raw.split('\n')
  let ctx = {}
  let l = 0

  for(let line of lines) {
    line = line.trim()
    l++

    if(line.length < 1) continue

    if(line.substr(-26) === ' talks in the third person') {
      let prints = expr(line.substr(0, line.lastIndexOf(' talks in the third person')), ctx, l)
      console.log(prints)
    } else if(line === "he's off script") {
      process.exit(0)
    } else if(line.substr(0, 4) === 'and ' && line.substr(-9, 5) === ' is a') {
      let varname = line.substr(4, line.lastIndexOf(' is a') -4)
      let type = line.substr(-3)

      ctx[varname] = [type, undefined]
    } else if(line.match(/^(\w+)'s whole family thinks (it|he|she)'s (.*)$/)) {
      let matches = line.match(/^(\w+)'s whole family thinks (it|he|she)'s (.*)$/)
      let varname = matches[1]
      let value = expr(matches[3], ctx, l)

      if(ctx[varname]) {
        // TODO type checks
        ctx[varname][1] = value
      } else throw `Variable "${varname}" does not exist on line ${l}`
    } else if(line.substr(-21) === " isn't real you idiot") {
      let varname = line.substr(0, line.lastIndexOf(" isn't real you idiot"))
      delete ctx[varname]
    } else {
      throw `Syntax error on line ${l}`
    }
  }
}

function expr(raw, ctx, line) {
  let result = ''
  raw = raw + ' '

  let operators = {
    // TODO type checks
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '^': (a, b) => Math.pow(a, b),
    '%': (a, b) => a % b,
  }

  let is = {
    string: false,
    number: false,
    variable: false,
    operator: '+',
  }

  for(let i = 0; i < raw.length; i++) {
    let char = raw[i]

    if(is.variable === false && is.string === false && is.number === false && char.match(/\w/)) {
      is.variable = char
    } else if(is.variable) {
      if(char.match(/\w/)) is.variable += char
      else {
        if(!ctx[is.variable]) throw `Variable "${is.variable}" does not exist on line ${line}:${i}`
        result = operators[is.operator || '+'](result, ctx[is.variable][1])
        is.operator = '?'
        is.variable = false
      }
    } else if(is.operator === '?') {
      if(char === ' ') continue
      else if(operators.hasOwnProperty(char)) is.operator = char
      else throw 'Unknown operator "' + char + '" on line ' + line + ':' + i
    } else if(is.string === false && char === '"') {
      is.string = ''
    } else if(is.string !== false) {
      if(char === '"') {
        result = operators[is.operator || '+'](result, is.string)
        is.operator = '?'
        is.string = false
      } else {
        is.string += char
      }
    } else if(is.number === false && isNumeric(char)) {
      is.number = char
    } else if(is.number !== false) {
      if(isNumeric(char)) {
        is.number += char
      } else if(char === '.') {
        is.number += '.'
      } else {
        result = operators[is.operator || '+'](result, parseFloat(is.number))
        is.operator = '?'
        is.number = false
        i-- // we should parse this char too, seperately
      }
    } else if(char === ' ') {
      continue
    } else {
      throw 'Unknown expression char "' + char + '" on line ' + line + ':' + i
    }
  }

  return result
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
