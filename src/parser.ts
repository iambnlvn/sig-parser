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
  VariableStatement,
  ConditionalStatement,
  TokenLiterals,
  LiteralType,
} from "./types";

export class Parser {
  protected str: string;
  protected tokenizer: Tokenizer | null;
  protected ExpressionMethods: Map<ExpressionType, Function>;
  private lookAhead: Token | null;
  protected assignmentOperators = new Set(["ASSIGNEMENT", "COMPLEXASSIGNMENT"]);
  protected literals = new Set(["NUMBER", "STRING", "TRUE", "FALSE", "NILL"]);
  protected binaryMemo = new Map<string, ASTNode>();
  protected tokenTypeToLiteralType: Record<TokenLiterals, LiteralType> = {
    NUMBER: "NumericLiteral",
    STRING: "StringLiteral",
    TRUE: "BooleanLiteral",
    FALSE: "BooleanLiteral",
    NILL: "NillLiteral",
  };
  constructor() {
    this.str = "";
    this.tokenizer = null;
    this.lookAhead = null;
    this.ExpressionMethods = new Map([
      ["PrimaryExpression", this.PrimaryExpression],
      ["MulExpression", this.MulExpression],
      ["ModExpression", this.ModExpression],
      ["AdditiveExpression", this.AdditiveExpression],
      ["ComparisonExpression", this.ComparisonExpression],
      ["EqualityExpression", this.EqualityExpression],
      ["LogicalAndExpression", this.LogicalAndExpression],
      ["LogicalOrExpression", this.LogicalOrExpression],
    ]);
  }

  private AdditiveExpression = this.createExpressionMethod(
    "MulExpression",
    "ADD_OP",
    "BinaryExpression"
  );
  private MulExpression = this.createExpressionMethod(
    "ModExpression",
    "MUL_OP",
    "BinaryExpression"
  );
  private ModExpression = this.createExpressionMethod(
    "PrimaryExpression",
    "MOD_OP",
    "BinaryExpression"
  );
  private ComparisonExpression = this.createExpressionMethod(
    "AdditiveExpression",
    "COMPARISON_OP",
    "BinaryExpression"
  );

  private EqualityExpression = this.createExpressionMethod(
    "ComparisonExpression",
    "EQUALITY_OP",
    "BinaryExpression"
  );

  private LogicalAndExpression = this.createExpressionMethod(
    "EqualityExpression",
    "AND_OP",
    "LogicalExpression"
  );

  private LogicalOrExpression = this.createExpressionMethod(
    "LogicalAndExpression",
    "OR_OP",
    "LogicalExpression"
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
      case "LET":
        return this.VariableStatement();
      case "IF":
        return this.ConditionalStatement();
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

  private ConditionalStatement(): ConditionalStatement {
    this.consume("IF");
    const testCondition = this.ParenthesizedExpression();
    const consequent = this.Statement();
    let alternate =
      this.lookAhead != null && this.lookAhead.type === "ELSE"
        ? this.consume("ELSE") && this.Statement()
        : null;

    return {
      type: "ConditionalStatement",
      testCondition,
      consequent,
      alternate,
    };
  }

  private VariableStatement(): VariableStatement {
    this.consume("LET");
    const declarations = this.VariableDeclarationList();
    this.consume("SEMICOLON");
    return {
      type: "VariableStatement",
      declarations,
    };
  }

  protected VariableDeclarationList(): ASTNode[] {
    let declarations: ASTNode[] = [];
    do {
      declarations.push(this.VariableDeclaration());
    } while (this.lookAhead?.type === "COMMA" && this.consume("COMMA"));
    return declarations;
  }
  private VariableDeclaration(): ASTNode {
    const variableName = this.Identifier();
    const variableInitialValue = !["COMMA", "SEMICOLON"].includes(
      this.lookAhead!.type
    )
      ? this.VariableInitializer()
      : null;

    return {
      type: "VariableDeclaration",
      variableName,
      variableInitialValue,
    };
  }
  protected VariableInitializer(): ASTNode {
    this.consume("ASSIGNEMENT");
    return this.AssignmentExpression();
  }
  private Expression(): ASTNode {
    return this.AssignmentExpression();
  }

  private AssignmentExpression(): ASTNode {
    const left = this.LogicalOrExpression();
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

  protected MainExpression(
    expType: ExpressionType,
    op: Operator,
    type: "BinaryExpression" | "LogicalExpression"
  ): ASTNode {
    const exprMethod = this.ExpressionMethods.get(expType);
    if (!exprMethod)
      throw new SyntaxError(`Unexpected expression type: "${expType}"`);
    let left: ASTNode = exprMethod.call(this);
    while (this.lookAhead?.type === op) {
      left = this.createMainExpression(left, op, exprMethod, type);
    }
    return left;
  }

  private createMainExpression(
    left: ASTNode,
    op: Operator,
    exprMethod: Function,
    type: "BinaryExpression" | "LogicalExpression"
  ): ASTNode {
    let binaryKey = `${left.type}${op}${exprMethod.name}`;
    let binaryMemo = this.binaryMemo;
    if (binaryMemo.has(binaryKey))
      return this.binaryMemo.get(binaryKey) as ASTNode;
    const operator = this.consume(op).value;
    const right: ASTNode = exprMethod.call(this);
    const binaryExpression: ASTNode = {
      type: "BinaryExpression",
      operator,
      left,
      right,
    };
    binaryMemo.set(binaryKey, binaryExpression);
    return binaryExpression;
  }
  private createExpressionMethod(
    nextMethod: ExpressionType,
    op: Operator,
    type: "BinaryExpression" | "LogicalExpression"
  ): () => ASTNode {
    return () => this.MainExpression(nextMethod, op, type);
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
    let lookAheadType = this.lookAhead.type as TokenLiterals;
    const literalType: LiteralType = this.tokenTypeToLiteralType[lookAheadType];
    if (!literalType)
      throw new SyntaxError(`Unexpected token: "${this.lookAhead.value}"`);
    const value =
      lookAheadType === "TRUE"
        ? true
        : lookAheadType === "FALSE"
        ? false
        : null;

    return this.CreateLiteral(literalType, value);
  }
  private isLiteral(tokenType: TokenType): boolean {
    return this.literals.has(tokenType);
  }

  private CreateLiteral(
    literalType: LiteralType,
    value?: boolean | null
  ): ASTNode {
    let token: Token;
    switch (literalType) {
      case "StringLiteral": {
        token = this.consume("STRING");
        return {
          type: "StringLiteral",
          value:
            typeof token.value === "string"
              ? token.value.slice(1, -1)
              : String(token.value),
        };
      }
      case "NumericLiteral": {
        token = this.consume("NUMBER");
        return {
          type: "NumericLiteral",
          value: Number(Number(token.value)),
        };
      }
      case "BooleanLiteral": {
        if (value == null) throw new TypeError("missing Boolean literal value");
        token = this.consume(String(value).toUpperCase() as TokenType);
        return {
          type: "BooleanLiteral",
          value: value,
        };
      }
      case "NillLiteral":
        token = this.consume("NILL");
        return {
          type: "NillLiteral",
          value: null,
        };
    }
  }
}
