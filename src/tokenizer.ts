import { Token, TokenType } from "./types";

const LangSpec: [RegExp, TokenType | null][] = [
  [/^\s+/, null],
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],
  [/^\d+(\.\d+)?/, "NUMBER"],
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],
  [/^\blet\b/, "LET"],
  [/^;/, "SEMICOLON"],
  [/^\{/, "LBRACE"],
  [/^\}/, "RBRACE"],
  [/^\(/, "LPAREN"],
  [/^\)/, "RPAREN"],
  [/^=/, "ASSIGNEMENT"],
  [/^[\*\/\+\-]=/, "COMPLEXASSIGNMENT"],
  [/^[+\-]/, "ADD_OP"],
  [/^[*\/]/, "MUL_OP"],
  [/^%/, "MOD_OP"],
  [/^,/, "COMMA"],
  [/^"/, null],

  [/^[a-zA-Z_]\w*/, "IDENTIFIER"],
];

export class Tokenizer {
  public cursor: number;
  public str: string;
  private strLength: number;

  constructor() {
    this.cursor = 0;
    this.str = "";
    this.strLength = 0;
  }
  public init(input: string): void {
    this.str = input;
    this.strLength = input.length;
  }

  public isEOF(): boolean {
    return this.strLength === this.cursor;
  }

  public hasNextToken(): boolean {
    return this.cursor < this.strLength;
  }

  private match(regExpr: RegExp, string: string): string | null {
    const matched = regExpr.exec(string);
    if (!matched) return null;
    this.cursor += matched[0].length;
    return matched[0];
  }
  public getNextToken(): Token | null {
    if (!this.hasNextToken()) {
      return null;
    }

    let string = this.str.slice(this.cursor);

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
    throw SyntaxError(`Unexpected token at position ${this.cursor}`);
  }
}
