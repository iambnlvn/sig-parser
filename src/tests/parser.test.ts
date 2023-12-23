import { beforeEach, describe, expect, test } from "bun:test";
import { Parser } from "../parser";
import { AST, Program } from "../types";

describe("Parser", () => {
  let parser: Parser;
  let program: string;
  let getExpr = (ast: AST<string | number>, opt: "value" | "type") => {
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
    let astNums = parser.Parse(`11;`) as AST<number>;
    expect(astNums).toBeDefined();
    expect(getExpr(astNums, "type")).toBe("NumericLiteral");
    expect(getExpr(astNums, "value")).toBeNumber();
    expect(getExpr(astNums, "value")).toBe(11);
  });
  test("should parse string correctly", () => {
    let astStr = parser.Parse(`"Hello, world";`) as AST<string>;
    expect(astStr).toBeDefined();
    expect(getExpr(astStr, "type")).toBe("StringLiteral");
    expect(getExpr(astStr, "value")).toBeString();
    expect(getExpr(astStr, "value")).toBe("Hello, world");
  });
  test("should parse comments correctly", () => {
    let astComments = parser.Parse(`
        /**
         * comment
         */
        "hello, world";
        `) as AST<string>;

    let expectedComments = {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "StringLiteral",
            value: "hello, world",
          },
        },
      ],
    };
    expect(astComments).toBeDefined();
    expect(JSON.stringify(astComments)).toEqual(
      JSON.stringify(expectedComments)
    );
    expect(getExpr(astComments, "type")).toBeString();
    expect(getExpr(astComments, "value")).toBe("hello, world");
  });
  test("should parse a expression statements correctly", () => {
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
    let expected: Program = {
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
  test("should parse empty statements correctly", () => {
    let emptyStatement = parser.Parse(`;`) as AST<string>;
    let expectedStatement: AST<string> = {
      type: "Program",
      body: [
        {
          type: "EmptyStatement",
        },
      ],
    };
    expect(JSON.stringify(emptyStatement)).toEqual(
      JSON.stringify(expectedStatement)
    );
  });

  test("should throw an error when parsing an invalid input", () => {
    expect(() => {
      parser.Parse(`"hello, world`);
    }).toThrow(SyntaxError);
  });
  test("should parse block statements correctly", () => {
    let parsedBlock = parser.Parse(`{"hello,world";11;}`);
    let expectedBlock = {
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello,world",
              },
            },
            {
              type: "ExpressionStatement",
              expression: {
                type: "NumericLiteral",
                value: 11,
              },
            },
          ],
        },
      ],
    };

    expect(JSON.stringify(parsedBlock)).toEqual(JSON.stringify(expectedBlock));
  });
});
