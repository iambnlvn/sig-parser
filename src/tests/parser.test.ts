import { beforeEach, describe, expect, test } from "bun:test";
import { Parser } from "../parser";
import { AST, Program } from "../types";

let expectations = {
  comment: {
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
  },
  expression: {
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
  },
  block: {
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
  },
  additiveAddExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "NumericLiteral",
            value: 7,
          },
        },
      },
    ],
  },
  additiveSubExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "NumericLiteral",
            value: 7,
          },
        },
      },
    ],
  },

  additiveExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "BinaryExpression",
            operator: "+",
            left: {
              type: "NumericLiteral",
              value: 11,
            },
            right: {
              type: "NumericLiteral",
              value: 11,
            },
          },
          right: {
            type: "NumericLiteral",
            value: 7,
          },
        },
      },
    ],
  },
  mulitplicativeMulExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "NumericLiteral",
            value: 7,
          },
        },
      },
    ],
  },
  mulitplicativeDivExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "/",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "NumericLiteral",
            value: 3,
          },
        },
      },
    ],
  },

  mulitplicativeExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "BinaryExpression",
            operator: "/",
            left: {
              type: "NumericLiteral",
              value: 11,
            },
            right: {
              type: "NumericLiteral",
              value: 11,
            },
          },
          right: {
            type: "NumericLiteral",
            value: 7,
          },
        },
      },
    ],
  },
  mixedAdditiveAndMultiplicativeExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "+",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "BinaryExpression",
            operator: "*",
            left: {
              type: "NumericLiteral",
              value: 7,
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      },
    ],
  },
  mixedSubtractiveAndDivisiveExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "-",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "BinaryExpression",
            operator: "/",
            left: {
              type: "NumericLiteral",
              value: 7,
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
        },
      },
    ],
  },
  moduloExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "%",
          left: {
            type: "NumericLiteral",
            value: 11,
          },
          right: {
            type: "NumericLiteral",
            value: 7,
          },
        },
      },
    ],
  },
  mixedModAndDivisiveExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "/",
          left: {
            type: "BinaryExpression",
            operator: "%",
            left: {
              type: "NumericLiteral",
              value: 11,
            },
            right: {
              type: "NumericLiteral",
              value: 7,
            },
          },
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      },
    ],
  },
  parenthesizedBinExp: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "*",
          left: {
            type: "BinaryExpression",
            operator: "-",
            left: {
              type: "NumericLiteral",
              value: 11,
            },
            right: {
              type: "NumericLiteral",
              value: 3,
            },
          },
          right: {
            type: "NumericLiteral",
            value: 2,
          },
        },
      },
    ],
  },
};

describe("Parser", () => {
  let parser: Parser;
  let program: string;
  let getExpr = (ast: AST, opt: "value" | "type") => {
    // @ts-ignore
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
    expect(getExpr(astNums, "type")).toBe("NumericLiteral");
    expect(getExpr(astNums, "value")).toBeNumber();
    expect(getExpr(astNums, "value")).toBe(11);
  });
  test("should parse string correctly", () => {
    let astStr = parser.Parse(`"Hello, world";`);
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
        `);

    expect(astComments).toBeDefined();
    expect(JSON.stringify(astComments)).toEqual(
      JSON.stringify(expectations.comment)
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

    expect(astSerie).toBeDefined();
    expect(JSON.stringify(astSerie)).toEqual(
      JSON.stringify(expectations.expression)
    );
  });
  test("should parse empty statements correctly", () => {
    let emptyStatement = parser.Parse(`;`);
    let expectedStatement = {
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

    expect(JSON.stringify(parsedBlock)).toEqual(
      JSON.stringify(expectations.block)
    );
  });
  test("should parse Binary Addition Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11 + 7;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.additiveAddExpr)
    );
  });
  test("should parse Binary Substraction Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11 - 7;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.additiveSubExpr)
    );
  });
  test("should parse Binary mixed Addition and substraction Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11+11-7;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.additiveExpr)
    );
  });
  test("should parse Binary multiplication Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11*7;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.mulitplicativeMulExpr)
    );
  });
  test("should parse Binary division Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11/3;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.mulitplicativeDivExpr)
    );
  });

  test("should parse Binary mixed Multiplication and division Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11/11*7;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.mulitplicativeExpr)
    );
  });

  test("should parse Binary mixed Addition and Multiplication Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11 + 7 * 2;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.mixedAdditiveAndMultiplicativeExpr)
    );
  });

  test("should parse Binary mixed Subtraction and Division Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11 - 7 / 2;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.mixedSubtractiveAndDivisiveExpr)
    );
  });
  test("should parse Binary Modulo Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11 % 7;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.moduloExpr)
    );
  });
  test("should parse mixed modulos and division Expression correctly", () => {
    let parsedBinaryExpr = parser.Parse(`11 % 7 / 2;`);

    expect(JSON.stringify(parsedBinaryExpr)).toEqual(
      JSON.stringify(expectations.mixedModAndDivisiveExpr)
    );
  });
  test("should parse parenthesized Binary Expression correctly", () => {
    let parsedParenExpr = parser.Parse(`(11-3)*2;`);

    expect(JSON.stringify(parsedParenExpr)).toEqual(
      JSON.stringify(expectations.parenthesizedBinExp)
    );
  });
});
