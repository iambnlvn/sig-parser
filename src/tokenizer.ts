const LangSpec: [RegExp, string | null][] = [
  [/^\d+/, "NUMBER"], // number
  [/^"[^"]*"/, "STRING"], //double quotes
  [/^'[^']*'/, "STRING"], //single quotes
  [/^\s+/, null], //whitespace
  [/^\/\/.*/, null], //sinle line comments
  [/^\/\*[\s\S]*?\*\//, null], // multi line comments
];
export type ASTNode = {
  type: string;
  value: any;
};
export class Tokenizer {
  cursor: number;
  str: string;

  constructor() {
    this.cursor = 0;
    this.str = "";
  }
  init(input: string) {
    this.cursor = 0;
    this.str = input;
  }

  isEOF(): boolean {
    return this.str.length === this.cursor;
  }
  hasNextToken(): boolean {
    return this.cursor < this.str.length;
  }
  match(regExpr: RegExp, string: string) {
    const matched = regExpr.exec(string);
    if (!matched) return null;
    if (matched) {
      this.cursor = matched[0].length;
      return matched[0];
    }
  }
  getNextToken(): ASTNode | SyntaxError | null {
    if (!this.hasNextToken()) {
      return null;
    }

    const string = this.str.slice(this.cursor);
    for (const [regExpr, tokenType] of LangSpec) {
      const tokenValue = this.match(regExpr, string);
      if (!tokenValue) {
        continue;
      }
      if (!tokenType) {
        return this.getNextToken();
      }
      return {
        type: tokenType,
        value: tokenValue,
      };
    }
    throw new SyntaxError(`Unexpected token: "${string[0]}"`);
  }
}
