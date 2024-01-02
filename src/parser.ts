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
  IterationStatement,
  FunctionDeclaration,
  FunctionReturn,
  ClassDeclaration,
  StatementTrigger,
} from "./types";

export class Parser {
  private readonly assignmentOperators = new Set([
    "ASSIGNEMENT",
    "COMPLEXASSIGNMENT",
  ]);
  private readonly literals = new Set([
    "NUMBER",
    "STRING",
    "TRUE",
    "FALSE",
    "NILL",
  ]);

  private readonly statementHandlers: Record<StatementTrigger, Function> = {
    SEMICOLON: this.EmptyStatement,
    LBRACE: this.BlockStatement,
    LET: this.VariableStatement,
    IF: this.ConditionalStatement,
    WHILE: this.IterationStatement,
    DO: this.IterationStatement,
    FOR: this.IterationStatement,
    FUNCTION: this.FunctionDeclaration,
    RETURN: this.FunctionReturn,
    CLASS: this.ClassDeclaration,
  };

  private readonly tokenTypeToLiteralType: Record<TokenLiterals, LiteralType> =
    {
      NUMBER: "NumericLiteral",
      STRING: "StringLiteral",
      TRUE: "BooleanLiteral",
      FALSE: "BooleanLiteral",
      NILL: "NillLiteral",
    };
  private binaryMemo = new Map<string, ASTNode>();
  private lookAhead: Token | null;
  private str: string;
  private tokenizer: Tokenizer | null;
  private readonly ExpressionMethods: Map<ExpressionType, Function>;
  constructor() {
    this.lookAhead = null;
    this.str = "";
    this.tokenizer = null;

    this.ExpressionMethods = new Map([
      ["PrimaryExpression", this.PrimaryExpression],
      ["MulExpression", this.MulExpression],
      ["ModExpression", this.ModExpression],
      ["AdditiveExpression", this.AdditiveExpression],
      ["ComparisonExpression", this.ComparisonExpression],
      ["EqualityExpression", this.EqualityExpression],
      ["LogicalAndExpression", this.LogicalAndExpression],
      ["LogicalOrExpression", this.LogicalOrExpression],
      ["UnaryExpression", this.UnaryExpression],
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
    "UnaryExpression",
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

  private UnaryExpression(): ASTNode {
    if (["ADD_OP", "NOT_OP"].includes(this.lookAhead!.type)) {
      return {
        type: "UnaryExpression",
        operator: this.consume(this.lookAhead!.type).value,
        argument: this.UnaryExpression(),
      };
    }

    return this.LeftHandSideExpression();
  }
  public Parse(input: string) {
    if (!input) throw new SyntaxError("Empty input");
    this.str = input;
    this.tokenizer ||= new Tokenizer();
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
    const handler =
      this.statementHandlers[this.lookAhead!.type as StatementTrigger];
    if (handler) {
      return handler.call(this);
    }
    return this.ExpressionStatement();
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

  private ClassDeclaration(): ClassDeclaration {
    this.consume("CLASS");
    const name = this.Identifier();
    const childClass =
      this.lookAhead?.type === "EXTENDS" ? this.ChildClassExpression() : null;

    const body = this.BlockStatement();
    return {
      type: "ClassDeclaration",
      name,
      childClass,
      body,
    };
  }
  private ChildClassExpression(): ASTNode {
    this.consume("EXTENDS");
    return this.Identifier();
  }

  private IterationStatement(): IterationStatement {
    switch (this.lookAhead?.type) {
      case "WHILE":
        return this.WhileStatement();
      case "DO":
        return this.WhileStatement(true);
      case "FOR":
        return this.ForStatement();
    }
    throw new SyntaxError("Unexpected token");
  }

  private WhileStatement(DoWhileFlag: boolean = false): IterationStatement {
    let body: Statement;
    if (DoWhileFlag) {
      this.consume("DO");
      body = this.Statement();
    }
    this.consume("WHILE");
    const iterationCondition = this.ParenthesizedExpression();
    body ??= this.Statement();
    DoWhileFlag && this.consume("SEMICOLON");
    return {
      type: DoWhileFlag ? "DoWhileStatement" : "WhileStatement",
      iterationCondition,
      body,
    };
  }
  private ForStatement(): IterationStatement {
    this.consume("FOR");
    this.consume("LPAREN");

    let init =
      this.lookAhead?.type !== "SEMICOLON"
        ? this.consume("LET") && this.VariableDeclaration()
        : null;
    this.consume("SEMICOLON");

    let testCondition =
      this.lookAhead?.type !== "SEMICOLON" ? this.Expression() : null;
    this.consume("SEMICOLON");

    let update = this.lookAhead?.type !== "RPAREN" ? this.Expression() : null;
    this.consume("RPAREN");

    const body = this.Statement();

    return {
      type: "ForStatement",
      init,
      testCondition,
      update,
      body,
    };
  }

  private FunctionDeclaration(): FunctionDeclaration {
    this.consume("FUNCTION");
    let name = this.Identifier();
    this.consume("LPAREN");
    let params =
      this.lookAhead?.type !== "RPAREN" ? this.FunctionParamsList() : [];

    this.consume("RPAREN");
    const body = this.BlockStatement();
    return {
      type: "FunctionDeclaration",
      name,
      params,
      body,
    };
  }

  private FunctionParamsList(): ASTNode[] {
    const params = [];
    do {
      params.push(this.Identifier());
    } while (this.lookAhead?.type === "COMMA" && this.consume("COMMA"));

    return params;
  }
  //TODO: implement a function return
  private FunctionReturn(): FunctionReturn {
    this.consume("RETURN");
    const argument =
      this.lookAhead?.type !== "SEMICOLON" ? this.Expression() : null;
    this.consume("SEMICOLON");
    return {
      type: "ReturnStatement",
      argument,
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

  private VariableDeclarationList(): ASTNode[] {
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

  private VariableInitializer(): ASTNode {
    this.consume("ASSIGNEMENT");
    return this.AssignmentExpression();
  }

  private Expression(): ASTNode {
    return this.AssignmentExpression();
  }

  private MemberExpression(): ASTNode {
    let object = this.PrimaryExpression();
    while (["DOT", "LSBRACKET"].includes(this.lookAhead!.type)) {
      const computed = this.lookAhead!.type === "LSBRACKET";
      const property = this.getProperty(computed);
      object = this.createMemberExpression(object, property, computed);
    }
    return object;
  }

  private getProperty(computedFlag: boolean): ASTNode {
    if (computedFlag) {
      this.consume("LSBRACKET");
      const property = this.Expression();
      this.consume("RSBRACKET");
      return property;
    } else {
      this.consume("DOT");
      return this.Identifier();
    }
  }

  private createMemberExpression(
    object: ASTNode,
    property: ASTNode,
    computed: boolean
  ): ASTNode {
    return {
      type: "MemberExpression",
      computed,
      object,
      property,
    };
  }

  private CallMemberExpression(): ASTNode {
    if (this.lookAhead?.type === "SUPER") {
      return this.CallExpresion(this.Super());
    }
    const member = this.MemberExpression();
    if (this.lookAhead?.type === "LPAREN") {
      return this.CallExpresion(member);
    }
    return member;
  }

  private CallExpresion(callee: ASTNode): ASTNode {
    let callExpression: ASTNode = {
      type: "CallExpression",
      callee,
      arguments: this.Arguments(),
    };

    return this.lookAhead?.type === "LPAREN"
      ? this.CallExpresion(callExpression)
      : callExpression;
  }
  private Arguments(): ASTNode[] {
    this.consume("LPAREN");
    const argumentList =
      this.lookAhead?.type !== "RPAREN" ? this.ArgumentList() : [];
    this.consume("RPAREN");
    return argumentList;
  }

  private ArgumentList(): ASTNode[] {
    let argumentList: ASTNode[] = [];
    do {
      argumentList.push(this.AssignmentExpression());
    } while (this.lookAhead?.type === "COMMA" && this.consume("COMMA"));
    return argumentList;
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
    if (["Identifier", "MemberExpression"].includes(node.type)) return node;
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
    return this.CallMemberExpression();
  }

  private Identifier(): ASTNode {
    return {
      type: "Identifier",
      name: this.consume("IDENTIFIER").value,
    };
  }

  private MainExpression(
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
    const expression: ASTNode = {
      type,
      operator,
      left,
      right,
    };
    binaryMemo.set(binaryKey, expression);
    return expression;
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
      case "IDENTIFIER":
        return this.Identifier();
      case "THIS":
        return this.ThisExpression();
      case "NEW":
        return this.NewExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }
  private ThisExpression(): ASTNode {
    this.consume("THIS");
    return {
      type: "ThisExpression",
    };
  }

  private Super(): ASTNode {
    this.consume("SUPER");
    return {
      type: "SuperExpression",
    };
  }
  private NewExpression(): ASTNode {
    this.consume("NEW");
    return {
      type: "NewExpression",
      callee: this.MemberExpression(),
      arguments: this.Arguments(),
    };
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
