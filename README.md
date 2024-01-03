# Sig Parser

## Description

This is a simple parser for the Sig file format. It is used to parse the Sig files and return an ast of the file.

**This uses the Bun runtime**

## Table of Contents

-[Installation](#installation) <br> -[Usage](#usage) <br> -[Language Syntax](#language-syntax) <br>

## Installation

```bash
//clone the repo
$ git clone https://github.com/iambnlvn/sig-parser.git && cd sig-parser
$ bun install
```

## Usage

### Direct usage (without executable)

Create a file with .sigx extension and ensure it follows the Sig Syntax.

Command format:

```bash
$ bun ./cli/main.ts [options] <path-to-file | inline-string-input>
```

Example: with file input:

```bash
$ bun ./cli/main.ts -f hello.sigx
```

Example: with inline string input:

```bash
$ bun ./cli/main.ts -i "class User { let name = "Sig"; }"
```

**Options**

-f, --file : path to the file to be parsed <br>
-i, --inline : inline string input to be parsed <br>
-s, --spacing : spacing to be used for the output <br>
-h, --help : display help for command <br>
-V, --version : output the version number <br>

_Note that the cli prioritizes file inputs when both inline string & file are entered_

### Executables usage

To build an executable(outputFile = sig), run:

```bash
$ bun exec
```

Command format:

```bash
$ ./sig [options] <path-to-file | inline-string-input>
```

Example: with file input:

```bash
$ ./sig -f hello.sigx
```

Example: with inline input:

```bash
$ ./sig -i "let a =11;"
```

## Language Syntax

Sig syntax is a similar to javascript syntax.
Refer to parser tests for more details.

### Comments

Sig supports single line comments and multi line comments.

```javascript
// hey mom, got borred so i decided to write a parser
/**
 * dang it, this is cool
 */
```

### Variables

Sig supports variable declaration and assignment.
only `let` keyword is supported for variable declaration (cuz why not).
Semicolons are required for every expression;

```javascript
let a = 10;
let b = "hello";
let c = true;
let d= false;
let e = 10.5;
let f +=11; //not correctly working
let g -=1; // not correctly working
let h *=90; // not correctly working
let i /=69; //not correctly working
let j %=132; //this is not supported neither will be implemented cuz that's just weird n uhgly
let k=l=89;
let m = 23>a; //boolean
let n = 25<b; //boolean
let o = 200>=a; //boolean
let p = 289<=a; //boolean
let q = 77==a; //boolean
let r = 234!=a; //boolean
let s = 2 ||d; //boolean
let t = 2 &&d; //boolean
let u = nill;// that's how you declare null; kinda way cooler than null
let v,w,x,y,z = 10;//multiple declaration
```

### Functions

```rust
fn log(name) {
return name;
}

sayHi("hi,mom");

```

### Classes

```javascript
class Person {
    //properties are declared as variables
    // methods are declared as functions
}
class User extends Person{
//constructor not supported yet so the parser will treat it as a function
let a = 10;
    this.saySomethingNice() {
    }
    fn method(){
        return nill;
    }
super();
}
let user = new User();
user.method();// non computed values
user["method"]();// computed values
```

### Comparisons

```javascript
x > y;
x < y;
x >= y;
x <= y;
x == y;
x != y;
```

### Loops

```javascript
for (let i = 0; i < 10; ++i) {
  //do something
}
for (;;) {
  //do something
}
while (x > 1) {
  print(x);
  ++x;
}
do {
  print(x);
  ++x;
} while (x > 1);
```

### Conditionals

```javascript
if (x > 1) {
  print(x);
} else if (x < 1) {
  print(x);
} else {
  print(x);
}
```
