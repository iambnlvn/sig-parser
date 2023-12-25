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
  | "MOD_OP";

export type Token = {
  type: TokenType;
  value: string;
};

export type Statement = ExpressionStatement | BlockStatement | EmptyStatement;
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
      type: "BinaryExpression";
      operator: string;
      left: ASTNode;
      right: ASTNode;
    }
  | { type: "EmptyStatement" };

export type ExpressionType =
  | "PrimaryExpression"
  | "MulExpression"
  | "ModExpression";

export type Operator = "ADD_OP" | "MUL_OP" | "MOD_OP";
