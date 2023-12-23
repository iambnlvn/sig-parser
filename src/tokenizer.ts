import { ASTNode } from "./types";

const LangSpec: [RegExp, string | null][] = [
  [/^\s+/, null],
  [/^\/\/.*/, null],
  [/^\/\*[\s\S]*?\*\//, null],
  [/^\d+/, "NUMBER"],
  [/^"[^"]*"/, "STRING"],
  [/^'[^']*'/, "STRING"],
  [/^;/, "SEMICOLON"],
  [/^\{/, "{"],
  [/^\}/, "}"],
];

export class Tokenizer {
  cursor: number;
  str: string;

  constructor() {
    this.cursor = 0;
    this.str = "";
  }
  public init(input: string) {
    this.str = input;
  }

  public isEOF(): boolean {
    return this.str.length === this.cursor;
  }

  public hasNextToken(): boolean {
    return this.cursor < this.str.length;
  }

  private match(regExpr: RegExp, string: string): string | null {
    const matched = regExpr.exec(string);
    if (!matched) return null;
    this.cursor += matched[0].length;
    return matched[0];
  }
  public getNextToken(): ASTNode<string | number> | null {
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
    return null;
  }
}
