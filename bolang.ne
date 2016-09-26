block[start, end] -> $start ":\n" lines $end {% (d, l, r) => {
  return {
    what: 'block',
    which: { start: d[0], end: d[3] },
    with: d[2]
  }
} %}

main -> lines {% d => d[0].lines %}

lines -> (line "\n"):* {% (d, l, r) => {
  let lines = d[0]

  if(lines) lines = lines.map(line => line[0])
  else return r

  return { lines }
} %}
line  -> block["repeat stuff", "x" int]
       | block["if you want " expr, "lower your expectations" (" a few"|" a lot"):?]
       | "this is " var {% d => {
  return {
    what: 'define',
    which: d[1]
  }
} %}
       | var " is " expr {% d => {
  return {
    what: 'set',
    which: d[0],
    to: d[2]
  }
} %}
       | expr " talks in the third person" {% (d, l, r) => {
  return {
    what: 'call',
    which: 'print',
    with: [d[0]]
  }
} %}
       | var (":" _ (" " expr):+):? {% (d, l, r) => {
  return {
    what: 'call',
    which: d[0],
    with: d[1] ? d[1][2].map(k => k[1]) : []
  }
} %}
       | "bo " var "s" (" " var):+ " like " block["this", "exactly"] {% (d, l, r) => {
  let func = d[1]
  let args = (d[3] || []).map(arg => arg[1])

  return {
    what: 'func',
    which: func,
    with: { args, lines: d[5].with.lines }
  }
} %}
       | null

expr -> _ EQ _       {% d => d[1] %}

B -> "(" _ AS _ ")"  {% d => d[2] %}
    | float          {% d => ['num', d[0]] %}
    | int            {% d => ['num', d[0]] %}
    | var            {% d => ['var', d[0]] %}
    | string         {% d => ['str', d[0]] %}
    | bool           {% d => ['bool', d[0]] %}

I -> B _ "^" _ I     {% d => ['power', d[0], d[4]] %}
   | B               {% id %}

DM -> DM _ "*" _ I   {% d => ['*', d[0], d[4]] %}
    | DM _ "/" _ I   {% d => ['/', d[0], d[4]] %}
    | I              {% id %}

# Addition / Subtraction
AS -> AS _ "+" _ DM  {% d => ['+', d[0], d[4]] %}
    | AS _ "-" _ DM  {% d => ['-', d[0], d[4]] %}
    | DM             {% id %}

# Equality
EQ -> EQ __ "to be" __ AS {% d => ['=', d[0], d[4]] %}
    | AS             {% id %}

float -> int "." int {% d => parseFloat(d[0] + d[1] + d[2]) %}
int   -> [0-9]:+     {% d => parseInt(d[0].join("")) %}

@builtin "string.ne"
string -> dqstring   {% d => d[0] %}
        | sqstring   {% d => d[0] %}
        | btstring   {% d => d[0] %}

bool -> "white"      {% d => true  %}
      | "black"      {% d => false %}

var -> varchar:+     {% (d, l, r) => {
  let i = d[0].join('')
  if(['this'].includes(i)) return r
  return i
} %}
varchar -> .         {% (d, l, r) => ' :()*/+-=."\'`'.indexOf(d[0]) === -1 ? d[0] : r %}

pronoun -> "he"
         | "she"
         | "it"

_  -> " ":*
__ -> " ":+
