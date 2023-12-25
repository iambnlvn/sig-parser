import { Tokenizer } from "./tokenizer";
import {
  ASTNode,
  ExpressionStatement,
  EmptyStatement,
  BlockStatement,
  Statement,
  Program,
  Token,
  ExpressionType,
  Operator,
} from "./types";

export class Parser {
  protected str: string;
  protected tokenizer: Tokenizer;
  protected ExpressionMethods: Map<ExpressionType, Function>;
  private lookAhead: Token | null;

  constructor() {
    this.str = "";
    this.tokenizer = new Tokenizer();
    this.lookAhead = null;
    this.ExpressionMethods = new Map([
      ["PrimaryExpression", this.PrimaryExpression],
      ["MulExpression", this.MulExpression],
      ["ModExpression", this.ModExpression],
    ]);
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
      case "LBRACE":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  private BlockStatement(): BlockStatement {
    this.consume("LBRACE");
    const body =
      this.lookAhead?.type !== "RBRACE" ? this.StatementList("RBRACE") : [];
    this.consume("RBRACE");
    return {
      type: "BlockStatement",
      body,
    };
  }

  private EmptyStatement(): EmptyStatement {
    this.consume("SEMICOLON");
    return {
      type: "EmptyStatement",
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

  private Expression(): ASTNode {
    return this.AdditiveExpression();
  }
  private AdditiveExpression(): ASTNode {
    return this.BinaryExpression("MulExpression", "ADD_OP");
  }
  private MulExpression(): ASTNode {
    return this.BinaryExpression("ModExpression", "MUL_OP");
  }
  private ModExpression(): ASTNode {
    return this.BinaryExpression("PrimaryExpression", "MOD_OP");
  }
  protected BinaryExpression(expType: ExpressionType, op: Operator): ASTNode {
    const exprMethod = this.ExpressionMethods.get(expType);
    if (!exprMethod)
      throw new SyntaxError(`Unexpected expression type: "${expType}"`);
    let left: ASTNode = exprMethod.call(this);
    while (this.lookAhead?.type === op) {
      const operator = this.consume(op).value;
      const right: ASTNode = exprMethod.call(this);
      left = {
        type: "BinaryExpression",
        operator,
        left,
        right,
      };
    }
    return left;
  }
  private PrimaryExpression(): ASTNode {
    switch (this.lookAhead?.type) {
      case "LPAREN":
        return this.ParenthesizedExpression();
      default:
        return this.Literal();
    }
  }
  private ParenthesizedExpression(): ASTNode {
    this.consume("LPAREN");
    const expression = this.Expression();
    this.consume("RPAREN");
    return expression;
  }
  private Literal(): ASTNode {
    if (!this.lookAhead) throw new SyntaxError("Unexpected end of input");
    switch (this.lookAhead.type) {
      case "NUMBER":
        return this.NumericLiteral();
      case "STRING":
        return this.StringLiteral();
    }
    throw new SyntaxError(`Unexpected token type: "${this.lookAhead.type}"`);
  }
  private consume(tokenType: Token["type"]): Token {
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
      value:
        typeof token.value === "string"
          ? token.value.slice(1, -1)
          : String(token.value),
    };
  }
}
