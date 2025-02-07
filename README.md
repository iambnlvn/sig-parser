# Sig Parser

## Description

This is a simple parser for the Sig file format. It is used to parse the Sig files and return an AST of the file.

**This uses the Bun runtime**

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Language Syntax](#language-syntax)

## Installation

```bash
# Clone the repo
$ git clone https://github.com/iambnlvn/sig-parser.git && cd sig-parser
$ bun install
```

## Usage

### Direct usage (without executable)

Create a file with a `.sigx` extension and ensure it follows the Sig Syntax.

Command format:

```bash
$ bun ./cli/main.ts [options] <path-to-file | inline-string-input>
```

Example with file input:

```bash
$ bun ./cli/main.ts -f hello.sigx
```

Example with inline string input:

```bash
$ bun ./cli/main.ts -i "class User { let name = "Sig"; }"
```

**Options**

- `-f, --file` : path to the file to be parsed
- `-o, --output` : output the AST to a file
- `-i, --inline` : inline string input to be parsed
- `-s, --spacing` : spacing to be used for the output
- `-h, --help` : display help for command
- `-V, --version` : output the version number

_Note that the CLI prioritizes file inputs when both inline string & file are entered._

### Executable usage

To build an executable (output file = `sig`), run:

```bash
$ bun execute
```

Command format:

```bash
$ ./sig [options] <path-to-file | inline-string-input>
```

Example with file input:

```bash
$ ./sig -f hello.sigx
```

Example with inline input:

```bash
$ ./sig -i "let a = 11;"
```

## Language Syntax

Sig syntax is similar to JavaScript syntax. Refer to parser tests for more details.

### Comments

Sig supports single-line comments and multi-line comments.

```javascript
// Single-line comment
/**
 * Multi-line comment
 */
```

### Variables

Sig supports variable declaration and assignment. Only the `let` keyword is supported for variable declaration. Semicolons are required for every expression.

```javascript
let a, b = 12;
let a = new Thing();
let a = 10;
let b = "hello";
let c = true;
let d = false;
let e = 10.5;
let k = l = 89;
let m = 23 > a; // boolean
let n = 25 < b; // boolean
let q = 77 == a; // boolean
let r = 234 != a; // boolean
let s = 2 || d;
let t = 2 && d;
let u = nill; // that's how you declare null; kinda way cooler than null
let v, w, x, y, z = 10; // multiple declaration
```

### Functions

```rust
fn log(name) {
  return name;
}
log("error");

fn sayHi() {
  return "Hi, mom";
}
sayHi();

fn add(a, b, c) {
  return a + b + c;
}
add(13, 12, 2);
```

### Classes

```javascript
class Person {
  // Properties are declared as variables
  // Methods are declared as functions
}

class User extends Person {
  // Constructor not supported yet so the parser will treat it as a function
  let a = 10;
  this.saySomethingNice() {
  }
  fn method() {
    return nill;
  }
  super();
}

let user = new User();
user.method(); // non-computed values
user["method"](); // computed values
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
  // do something
}
for (;;) {
  // do something
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
  print(x * 2);
} else {
  print(x);
}
```
