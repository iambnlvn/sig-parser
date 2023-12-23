export type Statement = ExpressionStatement | BlockStatement | EmptyStatement;
export type EmptyStatement = {
  type: "EmptyStatement";
};
export type ExpressionStatement = {
  type: "ExpressionStatement";
  expression: ASTNode<any>;
};
export type BlockStatement = {
  type: "BlockStatement";
  body: Statement[];
};
export type Program = {
  type: "Program";
  body: Statement[];
};
export type AST<T> = {
  type: string;
  body: { type: string; expression?: ASTNode<T> }[];
};
export type ASTNode<T> = {
  type: string;
  value?: T;
};
