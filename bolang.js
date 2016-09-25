require('get-stdin')().then(bolang).catch(console.error)

function bolang(raw) {
  const lines = raw.split('\n')
  let ctx = {}
  let l = 0

  for(let line of lines) {
    line = line.trim()
    l++

    if(line.length < 1) continue

    // <expression> talks in the third person
    if(line.substr(-26) === ' talks in the third person') {
      let prints = expr(line.substr(0, line.lastIndexOf(' talks in the third person')), ctx, l)
      console.log(prints)
    } else if(line === "he's off script") {
      process.exit(0)
    } else {
      throw `Unknown at line ${l}`
    }
  }
}

function expr(raw, ctx, line) {
  let result = ''
  raw = raw + ' '

  let operators = {
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
    operator: '+',
  }

  for(let i = 0; i < raw.length; i++) {
    let char = raw[i]

    if(is.operator === '?') {
      if(char === ' ') continue
      else if(operators.hasOwnProperty(char)) is.operator = char
      else throw 'Unknown operator: ' + char + ' on line ' + line
    } else if(is.string === false && char === '"') {
      is.string = ''
    } else if(is.string !== false) {
      if(char === '"') {
        result = operators[is.operator](result, is.string)
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
        result = operators[is.operator](result, parseFloat(is.number))
        is.operator = '?'
        is.number = false
        i-- // we should parse this char too, seperately
      }
    } else if(char === ' ') {
      continue
    } else {
      throw 'Unknown char in expression: ' + char + ' on line ' + line
    }
  }

  return result
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
