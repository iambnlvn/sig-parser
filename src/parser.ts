import { ASTNode, Tokenizer } from "./tokenizer";

export class Parser {
  str: string;
  tokenizer: Tokenizer;
  lookAhead: any;
  constructor() {
    this.str = "";
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;
  }

  parse(input: string) {
    this.str = input;
    this.tokenizer.init(this.str);
    this.lookAhead = this.tokenizer.getNextToken();
    return this.Program();
  }

  Program() {
    return { type: "Program", body: this.Literal() };
  }
  Literal() {
    switch (this.lookAhead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
  }
  consume(tokenType: string): ASTNode {
    const token = this.lookAhead;
    if (!token) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`,
      );
    }
    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`,
      );
    }

    this.lookAhead = this.tokenizer.getNextToken();
    return token;
  }

  NumericLiteral(): ASTNode {
    return {
      type: "NumericLiteral",
      value: Number(this.str),
    };
  }
  StringLiteral(): ASTNode {
    const token = this.consume("STRING");
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1),
    };
  }
}
