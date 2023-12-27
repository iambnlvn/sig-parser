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
  | "ASSIGNEMENT"
  | "COMPLEXASSIGNMENT"
  | "COMMA"
  | "LET";
export type Token = {
  type: TokenType;
  value: string;
};

export type Statement =
  | ExpressionStatement
  | BlockStatement
  | EmptyStatement
  | VariableStatement;
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
  | "ModExpression";

export type Operator = "ADD_OP" | "MUL_OP" | "MOD_OP";
