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
  TokenType,
} from "./types";

export class Parser {
  protected str: string;
  protected tokenizer: Tokenizer | null;
  protected ExpressionMethods: Map<ExpressionType, Function>;
  private lookAhead: Token | null;
  protected assignmentOperators = new Set(["ASSIGNEMENT", "COMPLEXASSIGNMENT"]);
  protected literals = new Set(["NUMBER", "STRING"]);
  constructor() {
    this.str = "";
    this.tokenizer = null;
    this.lookAhead = null;
    this.ExpressionMethods = new Map([
      ["PrimaryExpression", this.PrimaryExpression],
      ["MulExpression", this.MulExpression],
      ["ModExpression", this.ModExpression],
    ]);
  }

  private AdditiveExpression = this.createBinaryExpressionMethod(
    "MulExpression",
    "ADD_OP"
  );
  private MulExpression = this.createBinaryExpressionMethod(
    "ModExpression",
    "MUL_OP"
  );
  private ModExpression = this.createBinaryExpressionMethod(
    "PrimaryExpression",
    "MOD_OP"
  );
  public Parse(input: string) {
    this.str = input;
    if (!this.tokenizer) this.tokenizer = new Tokenizer();
    this.tokenizer.init(this.str);
    this.lookAhead = this.tokenizer.getNextToken();
    return this.Program();
  }

  private Program(): Program {
    return { type: "Program", body: this.StatementList() };
  }
  private StatementList(stopLookAhead: string | null = null): Statement[] {
    const statementList = [this.Statement()];
    while (this.lookAhead?.type !== stopLookAhead && !this.tokenizer!.isEOF()) {
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
    return this.AssignmentExpression();
  }

  private AssignmentExpression(): ASTNode {
    const left = this.AdditiveExpression();
    if (!this.isAssignmentOperator(this.lookAhead!.type)) {
      return left;
    }
    return {
      type: "AssignmentExpression",
      operator: this.AssignmentOperator(this.lookAhead!.type),
      left: this.checkValidAssignmentTarget(left),
      right: this.AssignmentExpression(),
    };
  }

  private checkValidAssignmentTarget(node: ASTNode): ASTNode {
    if (node.type === "Identifier") return node;
    throw new SyntaxError(`Invalid left-hand side in assignment expression`);
  }

  private AssignmentOperator(tokenType: TokenType): string {
    switch (tokenType) {
      case "ASSIGNEMENT":
        return this.consume("ASSIGNEMENT").value;
      case "COMPLEXASSIGNMENT":
        return this.consume("COMPLEXASSIGNMENT").value;
      default:
        throw new SyntaxError(`Unexpected token type: "${tokenType}"`);
    }
  }

  private isAssignmentOperator(tokenType: TokenType): boolean {
    return this.assignmentOperators.has(tokenType);
  }
  private LeftHandSideExpression(): ASTNode {
    return this.Identifier();
  }

  private Identifier(): ASTNode {
    return {
      type: "Identifier",
      name: this.consume("IDENTIFIER").value,
    };
  }

  protected BinaryExpression(expType: ExpressionType, op: Operator): ASTNode {
    const exprMethod = this.ExpressionMethods.get(expType);
    if (!exprMethod)
      throw new SyntaxError(`Unexpected expression type: "${expType}"`);
    let left: ASTNode = exprMethod.call(this);
    while (this.lookAhead?.type === op) {
      left = this.createBinaryExpression(left, op, exprMethod);
    }
    return left;
  }

  private createBinaryExpression(
    left: ASTNode,
    op: Operator,
    exprMethod: Function
  ): ASTNode {
    const operator = this.consume(op).value;
    const right: ASTNode = exprMethod.call(this);
    return {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
  }
  private createBinaryExpressionMethod(
    nextMethod: ExpressionType,
    op: Operator
  ): () => ASTNode {
    return () => this.BinaryExpression(nextMethod, op);
  }
  private PrimaryExpression(): ASTNode {
    if (this.isLiteral(this.lookAhead!.type)) return this.Literal();

    switch (this.lookAhead?.type) {
      case "LPAREN":
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }
  private ParenthesizedExpression(): ASTNode {
    this.consume("LPAREN");
    const expression = this.Expression();
    this.consume("RPAREN");
    return expression;
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

    this.lookAhead = this.tokenizer!.getNextToken();
    return token;
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
  private isLiteral(tokenType: TokenType): boolean {
    return this.literals.has(tokenType);
  }

  NumericLiteral(): ASTNode {
    let num = Number(this.lookAhead?.value);
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
