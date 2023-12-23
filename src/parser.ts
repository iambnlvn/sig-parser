import { ASTNode, Tokenizer } from "./tokenizer";

export type AST = {
  type: string;
  body: { type: string; expression: ASTNode | undefined }[];
};
export class Parser {
  protected str: string;
  protected tokenizer: Tokenizer;
  private lookAhead: ASTNode | null;
  constructor() {
    this.str = "";
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;
  }

  public Parse(input: string): AST {
    this.str = input;
    this.tokenizer.init(this.str);
    this.lookAhead = this.tokenizer.getNextToken();
    return this.Program();
  }

  private Program() {
    return { type: "Program", body: this.StatementList() };
  }
  private StatementList(): { type: string; expression: ASTNode | undefined }[] {
    const statementList = [this.Statement()];
    while (this.lookAhead && !this.tokenizer.isEOF()) {
      statementList.push(this.Statement());
    }
    return statementList;
  }

  private Statement(): { type: string; expression: ASTNode | undefined } {
    return this.ExpressionStatement();
  }
  private ExpressionStatement() {
    const expression = this.Expression();
    this.consume("SEMICOLON");

    return {
      type: "ExpressionStatement",
      expression,
    };
  }
  private Expression(): ASTNode {
    return this.Literal();
  }

  private Literal(): ASTNode {
    if (!this.lookAhead) throw new SyntaxError("Unexpected end of input");
    switch (this.lookAhead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
      default:
        throw new SyntaxError(
          `Unexpected token type: "${this.lookAhead.type}"`
        );
    }
  }
  private consume(tokenType: string): ASTNode {
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

  NumericLiteral(): ASTNode {
    let num: number | string = Number(this.lookAhead?.value);
    this.consume("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(num),
    };
  }
  StringLiteral(): ASTNode {
    let token = this.consume("STRING");
    return {
      type: "StringLiteral",
      value: token.value?.slice(1, -1),
    };
  }
}
