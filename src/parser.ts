import { Tokenizer } from "./tokenizer";
import {
  ASTNode,
  ExpressionStatement,
  EmptyStatement,
  BlockStatement,
  Statement,
  Program,
} from "./types";

export class Parser {
  protected str: string;
  protected tokenizer: Tokenizer;
  private lookAhead: ASTNode<string | number> | null;
  constructor() {
    this.str = "";
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;
  }

  public Parse(input: string) {
    this.str = input;
    this.tokenizer.init(this.str);
    this.lookAhead = this.tokenizer.getNextToken();
    return this.Program();
  }

  private Program(): Program {
    return { type: "Program", body: this.StatementList() };
  }
  private StatementList(stopLookAhead: string | null = null): Statement[] {
    const statementList = [this.Statement()];
    while (this.lookAhead?.type !== stopLookAhead && !this.tokenizer.isEOF()) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  private Statement(): Statement {
    switch (this.lookAhead?.type) {
      case "SEMICOLON":
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  private BlockStatement(): BlockStatement {
    this.consume("{");
    const body = this.lookAhead?.type !== "}" ? this.StatementList("}") : [];
    this.consume("}");
    return {
      type: "BlockStatement",
      body,
    };
  }

  private ExpressionStatement(): ExpressionStatement {
    const expression = this.Expression();
    this.consume("SEMICOLON");
    return {
      type: "ExpressionStatement",
      expression,
    };
  }

  private EmptyStatement(): EmptyStatement {
    this.consume("SEMICOLON");
    return {
      type: "EmptyStatement",
    };
  }

  private Expression(): ASTNode<string | number> {
    return this.Literal();
  }

  private Literal(): ASTNode<string | number> {
    if (!this.lookAhead) throw new SyntaxError("Unexpected end of input");
    switch (this.lookAhead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(`Unexpected token type: "${this.lookAhead.type}"`);
  }
  private consume(tokenType: string): ASTNode<string | number> {
    const token = this.lookAhead;
    if (!token) {
      throw new SyntaxError(
        `Unexpected end of input, expected: "${tokenType}"`
      );
    }
    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}", expected: "${tokenType}"`
      );
    }

    this.lookAhead = this.tokenizer.getNextToken();
    return token;
  }

  NumericLiteral(): ASTNode<number> {
    let num: number | string = Number(this.lookAhead?.value);
    this.consume("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(num),
    };
  }
  StringLiteral(): ASTNode<string> {
    let token = this.consume("STRING");
    return {
      type: "StringLiteral",
      value:
        typeof token.value === "string"
          ? token.value.slice(1, -1)
          : String(token.value),
    };
  }
}
