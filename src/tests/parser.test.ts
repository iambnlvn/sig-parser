import { beforeEach, describe, expect, test } from "bun:test";
import { Parser } from "../parser";
import { AST } from "../types";

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
  negUnaryExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "-",
          argument: {
            type: "NumericLiteral",
            value: 11,
          },
        },
      },
    ],
  },
  notUnaryExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "!",
          argument: {
            type: "BooleanLiteral",
            value: true,
          },
        },
      },
    ],
  },
  doubleNegUnaryExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "-",
          argument: {
            type: "UnaryExpression",
            operator: "-",
            argument: {
              type: "NumericLiteral",
              value: 11,
            },
          },
        },
      },
    ],
  },
  doublePosUnaryExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "UnaryExpression",
          operator: "+",
          argument: {
            type: "UnaryExpression",
            operator: "+",
            argument: {
              type: "NumericLiteral",
              value: 11,
            },
          },
        },
      },
    ],
  },
  asignmentExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 11,
          },
        },
      },
    ],
  },
  complexAddAsignmentExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "+=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 11,
          },
        },
      },
    ],
  },
  complexSubAsignmentExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "-=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 11,
          },
        },
      },
    ],
  },
  complexMulAsignmentExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "*=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 11,
          },
        },
      },
    ],
  },
  complexDivAsignmentExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "/=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 11,
          },
        },
      },
    ],
  },
  chainedAssignmentExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "y",
            },
            right: {
              type: "NumericLiteral",
              value: 11,
            },
          },
        },
      },
    ],
  },
  stringVarDeclaration: {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            variableName: {
              type: "Identifier",
              name: "y",
            },
            variableInitialValue: {
              type: "StringLiteral",
              value: "hello",
            },
          },
        ],
      },
    ],
  },
  numberVarDeclaration: {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            variableName: {
              type: "Identifier",
              name: "x",
            },
            variableInitialValue: {
              type: "NumericLiteral",
              value: 11,
            },
          },
        ],
      },
    ],
  },
  negativeNumberVarDeclaration: {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            variableName: {
              type: "Identifier",
              name: "x",
            },
            variableInitialValue: {
              type: "NumericLiteral",
              value: -11,
            },
          },
        ],
      },
    ],
  },
  noInitVarDeclaration: {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            variableName: {
              type: "Identifier",
              name: "a",
            },
            variableInitialValue: null,
          },
        ],
      },
    ],
  },
  floatNumberVarDeclaration: {
    type: "Program",
    body: [
      {
        type: "VariableStatement",
        declarations: [
          {
            type: "VariableDeclaration",
            variableName: {
              type: "Identifier",
              name: "x",
            },
            variableInitialValue: {
              type: "NumericLiteral",
              value: 11.5,
            },
          },
        ],
      },
    ],
  },
  ifStatement: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 1,
          },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "hello",
              },
            },
          ],
        },
        alternate: null,
      },
    ],
  },
  ifElseStatement: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 1,
          },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "Hello",
              },
            },
          ],
        },
        alternate: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "yoo",
              },
            },
          ],
        },
      },
    ],
  },
  mixedConditional: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "AssignmentExpression",
          operator: "=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 1,
          },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "StringLiteral",
                value: "Hello",
              },
            },
          ],
        },
        alternate: {
          type: "ConditionalStatement",
          testCondition: {
            type: "AssignmentExpression",
            operator: "=",
            left: {
              type: "Identifier",
              name: "x",
            },
            right: {
              type: "NumericLiteral",
              value: 2,
            },
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "StringLiteral",
                  value: "yoo",
                },
              },
            ],
          },
          alternate: null,
        },
      },
    ],
  },
  ifElseComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "BinaryExpression",
          operator: ">=",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 50 },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: {
          type: "ConditionalStatement",
          testCondition: {
            type: "BinaryExpression",
            operator: "<=",
            left: {
              type: "BinaryExpression",
              operator: ">=",
              left: { type: "Identifier", name: "x" },
              right: { type: "NumericLiteral", value: 50 },
            },
            right: { type: "NumericLiteral", value: 2 },
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: { type: "StringLiteral", value: "yoo" },
              },
            ],
          },
          alternate: null,
        },
      },
    ],
  },
  ifElseEQualityComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "BinaryExpression",
          operator: "==",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 50 },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: null,
      },
    ],
  },
  ifIneQualityComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "BinaryExpression",
          operator: "!=",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 50 },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: null,
      },
    ],
  },
  ifTrueComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: { type: "BooleanLiteral", value: true },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: null,
      },
    ],
  },
  ifElseBoolComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: { type: "BooleanLiteral", value: true },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: {
          type: "ConditionalStatement",
          testCondition: { type: "BooleanLiteral", value: false },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: { type: "StringLiteral", value: "yoo" },
              },
            ],
          },
          alternate: null,
        },
      },
    ],
  },
  logicalAndIfElseComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "LogicalExpression",
          operator: "&&",
          left: {
            type: "BinaryExpression",
            operator: ">=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 50 },
          },
          right: {
            type: "BinaryExpression",
            operator: "<=",
            left: {
              type: "BinaryExpression",
              operator: ">=",
              left: { type: "Identifier", name: "x" },
              right: { type: "NumericLiteral", value: 50 },
            },
            right: { type: "NumericLiteral", value: 2 },
          },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: null,
      },
    ],
  },
  logicalORIfElseComparison: {
    type: "Program",
    body: [
      {
        type: "ConditionalStatement",
        testCondition: {
          type: "LogicalExpression",
          operator: "||",
          left: {
            type: "BinaryExpression",
            operator: ">=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 50 },
          },
          right: {
            type: "BinaryExpression",
            operator: "<=",
            left: {
              type: "BinaryExpression",
              operator: ">=",
              left: { type: "Identifier", name: "x" },
              right: { type: "NumericLiteral", value: 50 },
            },
            right: { type: "NumericLiteral", value: 2 },
          },
        },
        consequent: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "Hello" },
            },
          ],
        },
        alternate: null,
      },
    ],
  },
  lessComparisonExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "<",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 1,
          },
        },
      },
    ],
  },
  greatComparisonExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: ">",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 20,
          },
        },
      },
    ],
  },
  lessEqComparisonExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "<=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 100,
          },
        },
      },
    ],
  },
  greateEqComparisonExpr: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: ">=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 21,
          },
        },
      },
    ],
  },
  equalityComparison: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "==",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 50,
          },
        },
      },
    ],
  },
  inEqualityComparison: {
    type: "Program",
    body: [
      {
        type: "ExpressionStatement",
        expression: {
          type: "BinaryExpression",
          operator: "!=",
          left: {
            type: "Identifier",
            name: "x",
          },
          right: {
            type: "NumericLiteral",
            value: 50,
          },
        },
      },
    ],
  },
  whileStatement: {
    type: "Program",
    body: [
      {
        type: "WhileStatement",
        iterationCondition: {
          type: "AssignmentExpression",
          operator: "=",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 1 },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "hello" },
            },
          ],
        },
      },
    ],
  },
  doWhileStatement: {
    type: "Program",
    body: [
      {
        type: "DoWhileStatement",
        iterationCondition: {
          type: "AssignmentExpression",
          operator: "=",
          left: { type: "Identifier", name: "x" },
          right: { type: "NumericLiteral", value: 1 },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: { type: "StringLiteral", value: "hello" },
            },
          ],
        },
      },
    ],
  },
  forStatement: {
    type: "Program",
    body: [
      {
        type: "ForStatement",
        init: {
          type: "VariableDeclaration",
          variableName: { type: "Identifier", name: "i" },
          variableInitialValue: { type: "NumericLiteral", value: 0 },
        },
        testCondition: {
          type: "BinaryExpression",
          operator: "<",
          left: { type: "Identifier", name: "i" },
          right: { type: "NumericLiteral", value: 10 },
        },
        update: {
          type: "AssignmentExpression",
          operator: "=",
          left: { type: "Identifier", name: "i" },
          right: {
            type: "BinaryExpression",
            operator: "+",
            left: { type: "Identifier", name: "i" },
            right: { type: "NumericLiteral", value: 1 },
          },
        },
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "i" },
                right: {
                  type: "BinaryExpression",
                  operator: "+",
                  left: {
                    type: "BinaryExpression",
                    operator: "+",
                    left: { type: "Identifier", name: "i" },
                    right: { type: "NumericLiteral", value: 1 },
                  },
                  right: { type: "NumericLiteral", value: 1 },
                },
              },
            },
          ],
        },
      },
    ],
  },
  infiniteForStatement: {
    type: "Program",
    body: [
      {
        type: "ForStatement",
        init: null,
        testCondition: null,
        update: null,
        body: {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: {
                  type: "Identifier",
                  name: "i",
                },
                right: {
                  type: "BinaryExpression",
                  operator: "+",
                  left: {
                    type: "Identifier",
                    name: "i",
                  },
                  right: {
                    type: "NumericLiteral",
                    value: 1,
                  },
                },
              },
            },
          ],
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

  describe("Inner workings", () => {
    test("should be defined", () => {
      expect(parser).toBeDefined();
    });
    test("should parse the program without errors", () => {
      let ast = parser.Parse(program);
      expect(ast).toBeDefined();
      expect(ast.type).toBe("Program");
    });
    test("should throw an error when parsing an invalid input", () => {
      expect(() => {
        parser.Parse(`"hello, world`);
      }).toThrow(SyntaxError);
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
  });
  describe("Literal", () => {
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
  });

  describe("Statement", () => {
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
    test("should parse block statements correctly", () => {
      let parsedBlock = parser.Parse(`{"hello,world";11;}`);

      expect(JSON.stringify(parsedBlock)).toEqual(
        JSON.stringify(expectations.block)
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
  });
  describe("AssignmentExpression", () => {
    test("should parse Assignment Expression correctly", () => {
      let parsedAssignmentExpr = parser.Parse(`x=11;`);

      expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
        JSON.stringify(expectations.asignmentExpr)
      );
    });
    test("should parse complex Assignment Expression correctly", () => {
      let parsedAssignmentExpr = parser.Parse(`x+=11;`);

      expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
        JSON.stringify(expectations.complexAddAsignmentExpr)
      );
    });
    test("should parse complex Assignment Expression correctly", () => {
      let parsedAssignmentExpr = parser.Parse(`x-=11;`);

      expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
        JSON.stringify(expectations.complexSubAsignmentExpr)
      );
    });
    test("should parse complex Assignment Expression correctly", () => {
      let parsedAssignmentExpr = parser.Parse(`x*=11;`);

      expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
        JSON.stringify(expectations.complexMulAsignmentExpr)
      );
    });
    test("should parse complex Assignment Expression correctly", () => {
      let parsedAssignmentExpr = parser.Parse(`x/=11;`);

      expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
        JSON.stringify(expectations.complexDivAsignmentExpr)
      );
    });
    test("should parse chained Assignment Expression correctly", () => {
      let parsedAssignmentExpr = parser.Parse(`x=y=11;`);

      expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
        JSON.stringify(expectations.chainedAssignmentExpr)
      );
    });
  });

  describe("BinaryExpression", () => {
    let parser: Parser;
    beforeEach(() => {
      parser = new Parser();
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

  describe("UnaryExpression", () => {
    test("should parse unary expression correctly", () => {
      let parsedUnaryExpr = parser.Parse(`-11;`);

      expect(JSON.stringify(parsedUnaryExpr)).toEqual(
        JSON.stringify(expectations.negUnaryExpr)
      );
    });
    test('should parse "not" unary expression correctly', () => {
      let parsedUnaryExpr = parser.Parse(`!true;`);

      expect(JSON.stringify(parsedUnaryExpr)).toEqual(
        JSON.stringify(expectations.notUnaryExpr)
      );
      test("should parse -- unary expression correctly", () => {
        let parsedUnaryExpr = parser.Parse(`--11;`);

        expect(JSON.stringify(parsedUnaryExpr)).toEqual(
          JSON.stringify(expectations.doubleNegUnaryExpr)
        );
      });
    });
    test('should parse "++" unary expression correctly', () => {
      let parsedUnaryExpr = parser.Parse(`++11;`);

      expect(JSON.stringify(parsedUnaryExpr)).toEqual(
        JSON.stringify(expectations.doublePosUnaryExpr)
      );
    });
  });

  describe("Variable declaration", () => {
    test("should parse variable declaration correctly", () => {
      let parsedVarDecl = parser.Parse(`let x = 11;`);

      expect(JSON.stringify(parsedVarDecl)).toEqual(
        JSON.stringify(expectations.numberVarDeclaration)
      );
    });
    test("should parse variable declaration with float number correctly", () => {
      let parsedVarDecl = parser.Parse(`let x = 11.5;`);

      expect(JSON.stringify(parsedVarDecl)).toEqual(
        JSON.stringify(expectations.floatNumberVarDeclaration)
      );
    });

    test("should parse variable declaration with string correctly", () => {
      let parsedVarDecl = parser.Parse(`let y = "hello";`);

      expect(JSON.stringify(parsedVarDecl)).toEqual(
        JSON.stringify(expectations.stringVarDeclaration)
      );
    });
    //TODO: fix this test
    // test("should parse variable declaration with negative number correctly", () => {
    //   let parsedVarDecl = parser.Parse(`let x = -11;`);

    //   expect(JSON.stringify(parsedVarDecl)).toEqual(
    //     JSON.stringify(expectations.negativeNumberVarDeclaration)
    //   );
    // });
    test("should parse variable declaration without initializer correctly", () => {
      let parsedVarDecl = parser.Parse(`let a;`);

      expect(JSON.stringify(parsedVarDecl)).toEqual(
        JSON.stringify(expectations.noInitVarDeclaration)
      );
    });
  });

  describe("Conditional statement", () => {
    test("should parse if statement correctly", () => {
      let parsedIfStatement = parser.Parse(`if (x=1) { "hello" ;}`);

      expect(JSON.stringify(parsedIfStatement)).toEqual(
        JSON.stringify(expectations.ifStatement)
      );
    });
    test("should parse if else statement correctly", () => {
      let parsedIfStatement = parser.Parse(
        `if (x=1) { "Hello"; } else {"yoo"; }`
      );

      expect(JSON.stringify(parsedIfStatement)).toEqual(
        JSON.stringify(expectations.ifElseStatement)
      );
    });
    test('should parse if else statement with "else if" correctly', () => {
      let parsedIfStatement = parser.Parse(
        `if (x=1) { "Hello"; } else if (x=2) {"yoo"; }`
      );

      expect(JSON.stringify(parsedIfStatement)).toEqual(
        JSON.stringify(expectations.mixedConditional)
      );
    });
    test("should parse comparison in if statement correctly", () => {
      let parsedComparisonExpr = parser.Parse(
        `if (x>=50) { "Hello"; } else if (x<=2) {"yoo"; }`
      );

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.ifElseComparison)
      );
    });
    test("should parse equality comparison in if statement correctly", () => {
      let parsedComparisonExpr = parser.Parse(`if (x == 50) { "Hello"; }`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.ifElseEQualityComparison)
      );
    });
    test("should parse inqueality comparison in if statement correctly", () => {
      let parsedComparisonExpr = parser.Parse(`if (x != 50) { "Hello"; }`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.ifIneQualityComparison)
      );
    });
    test("should parse boolean in if statement correctly", () => {
      let parsedComparisonExpr = parser.Parse(`if (true) { "Hello"; }`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.ifTrueComparison)
      );
    });
    test('should parse boolean in if statement correctly with "else if"', () => {
      let parsedComparisonExpr = parser.Parse(
        `if (true) { "Hello"; } else if (false) { "yoo"; }`
      );

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.ifElseBoolComparison)
      );
    });
    test("should parse logical AND expression in if statement correctly", () => {
      let parsedComparisonExpr = parser.Parse(
        `if (x >= 50 && x <= 2) { "Hello"; }`
      );

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.logicalAndIfElseComparison)
      );
    });

    test("shoudl parse logical OR expression in if statement correctly", () => {
      let parsedComparisonExpr = parser.Parse(
        `if (x >= 50 || x <= 2) { "Hello"; }`
      );

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.logicalORIfElseComparison)
      );
    });
  });
  describe("Comparison Expression", () => {
    test("should parse < comparison expression correctly", () => {
      let parsedComparisonExpr = parser.Parse(`x <1;`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.lessComparisonExpr)
      );
    });
    test("should parse > comparison expression correctly", () => {
      let parsedComparisonExpr = parser.Parse(`x >20;`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.greatComparisonExpr)
      );
    });
    test("should parse <= comparison expression correctly", () => {
      let parsedComparisonExpr = parser.Parse(`x <=100;`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.lessEqComparisonExpr)
      );
    });
    test("should parse >= comparison expression correctly", () => {
      let parsedComparisonExpr = parser.Parse(`x >=21;`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.greateEqComparisonExpr)
      );
    });
    test("should parse == equality comparison expression correctly", () => {
      let parsedComparisonExpr = parser.Parse(`x == 50;`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.equalityComparison)
      );
    });
    test("should parse != inequality comparison expression correctly", () => {
      let parsedComparisonExpr = parser.Parse(`x != 50;`);

      expect(JSON.stringify(parsedComparisonExpr)).toEqual(
        JSON.stringify(expectations.inEqualityComparison)
      );
    });
  });
  describe("Iteration statement", () => {
    test("should parse while statement correctly", () => {
      let parsedWhileStatement = parser.Parse(`while (x=1) { "hello" ;}`);

      expect(JSON.stringify(parsedWhileStatement)).toEqual(
        JSON.stringify(expectations.whileStatement)
      );
    });
    test("should parse do while statement correctly", () => {
      let parsedDoWhileStatement = parser.Parse(`do { "hello" ;} while (x=1);`);

      expect(JSON.stringify(parsedDoWhileStatement)).toEqual(
        JSON.stringify(expectations.doWhileStatement)
      );
    });
    test("should parse for statement correctly", () => {
      let parsedForStatement = parser.Parse(
        `for(let i = 0; i < 10; i = i + 1) { 
  i=i+1;
 }`
      );

      expect(JSON.stringify(parsedForStatement)).toEqual(
        JSON.stringify(expectations.forStatement)
      );
    });
    test("should parse inifinite for statement correctly", () => {
      let parsedForStatement = parser.Parse(`for(;;) {i=i+1;}`);

      expect(JSON.stringify(parsedForStatement)).toEqual(
        JSON.stringify(expectations.infiniteForStatement)
      );
    });
  });
});
