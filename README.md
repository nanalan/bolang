# bolang
> a programming language inspired by [bob urnham](http://www.boburnham.com/)'s lyrics :shipit:

### install
`npm install`

### run
`node bolang <src.bo> -o <out.js>`
use `--tree` or `-t` to also output the parse-tree.

### how
ONE, TWO, **ONE, TWO, THREE, FOUR! *LET'S ROCK!!!***

Bolang syntax is weird. (tell me about it!)
To help you out, here's a little guide:

##### VALUES
numbers have obvious syntax. `23`, `293.5` or `99999.9994`
strings are some chars enclosed in `"`, `'` or \`. you can use `\\` to escape chars. `"Hello, World!"` or `"Hello, \"World\"!"`
booleans are `white` for `true`, `black` for `false` and `asian` for `maybe` (randomly either `true` or `false`).

##### LOOPS, CONTROL STATEMENTS
```
repeat stuff:
  <body : code>
x<number : n>
```
executes `code` `n` times
in reference to Repeat Stuff (what.)

```
if you want <boolean : if>:
  <body : code>
lower your expectations <"a lot" or "a few">
```
executes `code` if and only if `if` is `white`.
in reference to Lower Your Expectations (Make Happy)

##### FUNCTION DEFINITIONS
```
bo <identifier : name>s <...identifier ","ch : args> like this:
  <body : code>
exactly
```
defines the function `name` as taking `args` and executing `body`.
in reference to intro (what.) and What's Funny (Words Words Words)

`<identifier : fn>: <...expression : args>`
calls the user-defined function `fn` with the arguments `args`
not a reference to anything LOL

##### OTHER
`<string : str> talks in the third person`
prints `str`. reference to words, words, words (Words Words Words)

`this is <identifier : var>`
defines the new variable `var`. reference to intro (what.)


`<variable : var> is <expression : value>`
sets `var` to be equal to `value`.
