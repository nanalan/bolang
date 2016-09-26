# bolang
> a programming language inspired by [bob urnham](http://www.boburnham.com/)'s lyrics :shipit:

### install
`npm install`

### run
`cat <file>.bo | bolang.js`

### how
one statement per line  
leading and trailing whitepsace on lines are ignored  
strings `"are like this"`  
variables may only contain `A-Za-z0-9_`  
expressions are read right to left  
expressions may only contain `+-*/^% `, variables, or strings. **no brackets**  

below, **expr** is an expression  
below, **var** is a variable reference  
below, **{...}** is a block of code  

statement                                    | does             | reference           
--------------------------------------------:|:---------------- |:-------------------:
**var** talks in the third person            | prints           | words, words, words
he's off script                              | terminates       | Channel 5 News
a[n] **var**                                 | defines          | Country Song
**var**'s whole family thinks it/he/she's **expr** | sets       | My whole family...
**var** isn't real you idiot                 | undefines        | "what." intro
read a book                                  | sleeps for 1s    | "what." intro
frank _(any amount of these characters allowed)_ | debug info   | [fffffffffrrrrrraaaaaaaaannnnnkkkkkkkkk](https://twitter.com/boburnham/status/768205113634586624)
