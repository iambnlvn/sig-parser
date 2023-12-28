export type TokenType =
  | "NUMBER"
  | "STRING"
  | "OPERATOR"
  | "IDENTIFIER"
  | "LPAREN"
  | "RPAREN"
  | "SEMICOLON"
  | "LBRACE"
  | "RBRACE"
  | "ADD_OP"
  | "MUL_OP"
  | "MOD_OP"
  | "COMPARISON_OP"
  | "ASSIGNEMENT"
  | "COMPLEXASSIGNMENT"
  | "COMMA"
  | "LET"
  | "IF"
  | "ELSE";
export type Token = {
  type: TokenType;
  value: string;
};

export type Statement =
  | ExpressionStatement
  | BlockStatement
  | EmptyStatement
  | VariableStatement
  | ConditionalStatement;
export type EmptyStatement = {
  type: "EmptyStatement";
};
export type ExpressionStatement = {
  type: "ExpressionStatement";
  expression: ASTNode;
};
export type BlockStatement = {
  type: "BlockStatement";
  body: Statement[];
};

export type VariableStatement = {
  type: "VariableStatement";
  declarations: ASTNode[];
};

export type ConditionalStatement = {
  type: "ConditionalStatement";
  testCondition: ASTNode;
  consequent: Statement;
  alternate?: Statement | null;
};
export type Program = {
  type: "Program";
  body: Statement[];
};
export type AST = {
  type: string;
  body: { type: string; expression?: ASTNode }[];
};
export type ASTNode =
  | { type: "NumericLiteral"; value: number }
  | { type: "StringLiteral"; value: string }
  | {
      type: "AssignmentExpression" | "BinaryExpression";
      operator: string;
      left: ASTNode;
      right: ASTNode;
    }
  | { type: "EmptyStatement" }
  | { type: "Identifier"; name: string }
  | {
      type: "VariableDeclaration";
      variableName: ASTNode;
      variableInitialValue?: ASTNode | null;
    };

export type ExpressionType =
  | "PrimaryExpression"
  | "MulExpression"
  | "ModExpression"
  | "ComparisonExpression"
  | "AdditiveExpression";

export type Operator = "ADD_OP" | "MUL_OP" | "MOD_OP" | "COMPARISON_OP";
