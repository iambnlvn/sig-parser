import { beforeEach, describe, expect, test } from "bun:test";
import { AST, Parser } from "../parser";
import { ASTNode } from "../tokenizer";

describe("Parser", () => {
  let parser: Parser;
  let program: string;
  const getInfo = (ast: AST, opt: "value" | "type"): string | number => {
    return ast.body[0].expression?.[opt];
  };
  beforeEach(() => {
    parser = new Parser();
    program = `11;
        /**
         * comment
         */
        "hello, world";
        `;
  });
  test("should be defined", () => {
    expect(parser).toBeDefined();
  });
  test("should parse the program without errors", () => {
    let ast = parser.Parse(program);
    expect(ast).toBeDefined();
    expect(ast.type).toBe("Program");
  });
  test("should parse numbers correctly", () => {
    let astNums = parser.Parse(`11;`);
    expect(astNums).toBeDefined();
    expect(getInfo(astNums, "type")).toBe("NumericLiteral");
    expect(getInfo(astNums, "value")).toBeNumber();
    expect(getInfo(astNums, "value")).toBe(11);
  });
  test("should parse string correctly", () => {
    let astStr = parser.Parse(`"Hello, world";`);
    expect(astStr).toBeDefined();
    expect(getInfo(astStr, "type")).toBe("StringLiteral");
    expect(getInfo(astStr, "value")).toBeString();
    expect(getInfo(astStr, "value")).toBe("Hello, world");
  });
  test("should parse comments correctly", () => {
    let astComments = parser.Parse(`
        /**
         * comment
         */
        "hello, world";
        `);
    expect(astComments).toBeDefined();
    expect(getInfo(astComments, "type")).toBe("StringLiteral");
    expect(getInfo(astComments, "value")).toBeString();
    expect(getInfo(astComments, "value")).toBe("hello, world");
  });
  test("should parse a series of inputs", () => {
    let astSerie = parser.Parse(`
"hello internet";
        /**
         * number
         */
11;
        /**
         * string
         */
"Working input series";
`);
    let expected: AST = {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "hello internet",
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "NumericLiteral",
            value: 11,
          },
        },
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "Working input series",
          },
        },
      ],
    };
    expect(astSerie).toBeDefined();
    expect(JSON.stringify(astSerie)).toEqual(JSON.stringify(expected));
  });
  test("should throw an error when parsing an invalid input", () => {
    expect(() => {
      parser.Parse(`"hello, world`);
    }).toThrow(SyntaxError);
  });
});
