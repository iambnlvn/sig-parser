import { beforeEach, describe, expect, test } from "bun:test";
import { Parser } from "../src/parser";
import { AST } from "../src/types";

const statementCategory = [
  {
    testName: "should parse empty statement ",
    input: `;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "EmptyStatement",
        },
      ],
    },
  },
  {
    testName: "should parse block statement ",
    input: `{x=1;}`,
    expected: {
      type: "Program",
      body: [
        {
          type: "BlockStatement",
          body: [
            {
              type: "ExpressionStatement",
              expression: {
                type: "AssignmentExpression",
                operator: "=",
                left: { type: "Identifier", name: "x" },
                right: { type: "NumericLiteral", value: 1 },
              },
            },
          ],
        },
      ],
    },
  },
  {
    testName: "should parse expression statement ",
    input: `x=1;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
        },
      ],
    },
  },
];

const assignmentCategory = [
  {
    testName: "should parse basic Assignment Expression ",
    input: "x=11;",
    expected: {
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
  },
  {
    testName: "should parse complex plus Assignment Expression ",
    input: "x+=11;",
    expected: {
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
  },
  {
    testName: "should parse complex minus Assignment Expression ",
    input: "x-=11;",
    expected: {
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
  },
  {
    testName: "should parse complex multiplication Assignment Expression ",
    input: "x*=11;",
    expected: {
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
  },
  {
    testName: "should parse division Assignment Expression ",
    input: "x/=11;",
    expected: {
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
  },
  {
    testName: "should parse chained Assignment Expression ",
    input: "x=y=11;",
    expected: {
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
  },
];

const binaryCategory = [
  {
    testName: "should parse Binary Addition Expression ",
    input: "11+7;",
    expected: {
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
  },
  {
    testName: "should parse Binary Substraction Expression ",
    input: "11-7;",
    expected: {
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
  },
  {
    testName: "should parse Binary mixed Addition and substraction Expression ",
    input: "11+11-7;",
    expected: {
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
  },
  {
    testName: "should parse Binary multiplication Expression ",
    input: "11*7;",
    expected: {
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
  },
  {
    testName: "should parse Binary division Expression ",
    input: "11/3;",
    expected: {
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
  },
  {
    testName:
      "should parse Binary mixed multiplication and division Expression ",
    input: "11/11*7;",
    expected: {
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
  },
  {
    testName:
      "should parse Binary mixed Addition and Multiplication Expression ",
    input: "11+7*2;",
    expected: {
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
  },
  {
    testName: "should parse Binary mixed Subtraction and Division Expression ",
    input: "11-7/2;",
    expected: {
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
  },
  {
    testName: "should parse Binary modulo Expression ",
    input: "11%7;",
    expected: {
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
  },
  {
    testName: "should parse Binary mixed modulo and division Expression ",
    input: "11%7/2;",
    expected: {
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
  },
  {
    testName: "should parse Binary parenthesized Expression ",
    input: "(11-3)*2;",
    expected: {
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
  },
];

const unaryCategory = [
  {
    testName: "should parse Unary plus Expression ",
    input: "+11;",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "UnaryExpression",
            operator: "+",
            argument: {
              type: "NumericLiteral",
              value: 11,
            },
          },
        },
      ],
    },
  },
  {
    testName: "should parse Unary minus Expression ",
    input: "-11;",
    expected: {
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
  },
  {
    testName: "should parse Unary double plus Expression ",
    input: "++11;",
    expected: {
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
              argument: { type: "NumericLiteral", value: 11 },
            },
          },
        },
      ],
    },
  },
  {
    testName: "should parse Unary double minus Expression ",
    input: "--11;",
    expected: {
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
              argument: { type: "NumericLiteral", value: 11 },
            },
          },
        },
      ],
    },
  },
  {
    testName: "should parse unary negation Expression ",
    input: "!true;",
    expected: {
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
  },
];

const variableCategory = [
  {
    testName: "should parse variable declaration ",
    input: "let x = 11;",
    expected: {
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
  },
  {
    testName: "should parse variable declaration with float number ",
    input: "let x = 11.5;",
    expected: {
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
  },
  //TODO:fix/implement negative number variables parsing
  // {
  //   testName:
  //     "should parse variable declaration with negative number ",
  //   input: "let x = -11;",
  //   expected: {
  //     type: "Program",
  //     body: [
  //       {
  //         type: "VariableStatement",
  //         declarations: [
  //           {
  //             type: "VariableDeclaration",
  //             variableName: {
  //               type: "Identifier",
  //               name: "x",
  //             },
  //             variableInitialValue: {
  //               type: "NumericLiteral",
  //               value: -11,
  //             },
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // },
  {
    testName: "should parse varibale without initializer ",
    input: "let a;",
    expected: {
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
  },

];

const conditionalCategory = [
  {
    testName: "should parse if statement ",
    input: `if (x=1) { "hello" ;}`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ConditionalStatement",
          testCondition: {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
          consequent: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: { type: "StringLiteral", value: "hello" },
              },
            ],
          },
          alternate: null,
        },
      ],
    },
  },
  {
    testName: "should parse if else statement ",
    input: `if (x=1) { "Hello"; } else {"yoo"; }`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ConditionalStatement",
          testCondition: {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
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
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: { type: "StringLiteral", value: "yoo" },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse if else statement with 'else if' ",
    input: `if (x=1) { "Hello"; } else if (x=2) {"yoo"; }`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ConditionalStatement",
          testCondition: {
            type: "AssignmentExpression",
            operator: "=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
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
              type: "AssignmentExpression",
              operator: "=",
              left: { type: "Identifier", name: "x" },
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
  },
  {
    testName: "should parse complex if else statement ",
    input: `if (x>=50) { "Hello"; } else if (x<=2) {"yoo"; }`,
    expected: {
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
  },
  {
    testName: "should parse equality comparison in if statement ",
    input: `if (x == 50) { "Hello"; }`,
    expected: {
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
  },
  {
    testName: "should parse inqueality comparison in if statement ",
    input: `if (x != 50) { "Hello"; }`,
    expected: {
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
  },
  {
    testName: "should parse logical AND expression in if statement ",
    input: `if (x >= 50 && x <= 2) { "Hello"; }`,
    expected: {
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
  },
  {
    testName: "should parse logical OR expression in if statement ",
    input: `if (x >= 50 || x <= 2) { "Hello"; }`,
    expected: {
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
  },
  {
    testName: "should parse boolean in if statement ",
    input: `if (true) { "Hello"; }`,
    expected: {
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
  },
  {
    testName: "should parse  boolean in if else statement ",
    input: `if (true) { "Hello"; } else if (false) { "yoo"; }`,
    expected: {
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
  },
];

const comparisonCategory = [
  {
    testName: "should parse < comparison expression ",
    input: `x <1;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "<",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 1 },
          },
        },
      ],
    },
  },
  {
    testName: "should parse > comparison expression ",
    input: `x >20;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 20 },
          },
        },
      ],
    },
  },
  {
    testName: "should parse <= comparison expression ",
    input: `x <=100;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "<=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 100 },
          },
        },
      ],
    },
  },
  {
    testName: "should parse >= comparison expression ",
    input: `x >=21;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: ">=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 21 },
          },
        },
      ],
    },
  },
  {
    testName: "should parse == equality comparison expression ",
    input: `x == 50;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "==",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 50 },
          },
        },
      ],
    },
  },
  {
    testName: "should parse != inequality comparison expression ",
    input: `x != 50;`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "BinaryExpression",
            operator: "!=",
            left: { type: "Identifier", name: "x" },
            right: { type: "NumericLiteral", value: 50 },
          },
        },
      ],
    },
  },
];

const iterationCategory = [
  {
    testName: "should parse while statement ",
    input: `while (x=1) { "hello" ;}`,
    expected: {
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
  },
  {
    testName: "should parse do while statement ",
    input: `do { "hello" ;} while (x=1);`,
    expected: {
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
  },
  {
    testName: "should parse for statement ",
    input: `for(let i = 0; i < 10; i = i + 1) {
   i=i+1;  }`,
    expected: {
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
  },
  {
    testName: "should parse infinite for statement ",
    input: `for(;;) {i=i+1;}`,
    expected: {
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
  },
];

const functionCategory = [
  {
    testName: "should parse function declaration without return",
    input: "fn helloWorld() { x += 1; }",
    expected: {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: { type: "Identifier", name: "helloWorld" },
          params: [],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "+=",
                  left: { type: "Identifier", name: "x" },
                  right: { type: "NumericLiteral", value: 1 },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName:
      "should parse function declaration with params and without return",
    input: "fn helloWorld(name, age) { x += 1; }",
    expected: {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: { type: "Identifier", name: "helloWorld" },
          params: [
            { type: "Identifier", name: "name" },
            { type: "Identifier", name: "age" },
          ],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ExpressionStatement",
                expression: {
                  type: "AssignmentExpression",
                  operator: "+=",
                  left: { type: "Identifier", name: "x" },
                  right: { type: "NumericLiteral", value: 1 },
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse function declaration with parameters and return",
    input: "fn helloWorld(name, age) { return 'Hello, world!'; }",
    expected: {
      type: "Program",
      body: [
        {
          type: "FunctionDeclaration",
          name: {
            type: "Identifier",
            name: "helloWorld",
          },
          params: [
            {
              type: "Identifier",
              name: "name",
            },
            {
              type: "Identifier",
              name: "age",
            },
          ],
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "ReturnStatement",
                argument: {
                  type: "StringLiteral",
                  value: "Hello, world!",
                },
              },
            ],
          },
        },
      ],
    },
  },
];

const memberCategory = [
  {
    testName: "should parse Member Expression with dot notation",
    input: "obj.property;",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: false,
            object: {
              type: "Identifier",
              name: "obj",
            },
            property: {
              type: "Identifier",
              name: "property",
            },
          },
        },
      ],
    },
  },
  {
    testName: "should parse Member Expression with bracket notation",
    input: "obj['property'];",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: true,
            object: {
              type: "Identifier",
              name: "obj",
            },
            property: {
              type: "StringLiteral",
              value: "property",
            },
          },
        },
      ],
    },
  },
  {
    testName:
      "should parse Member Expression with bracket notation and expression",
    input: "obj['property' + 1];",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: true,
            object: {
              type: "Identifier",
              name: "obj",
            },
            property: {
              type: "BinaryExpression",
              operator: "+",
              left: {
                type: "StringLiteral",
                value: "property",
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
  {
    testName: "should parse Member Expression with bracket and dot notation",
    input: "obj['property'].property;",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "MemberExpression",
            computed: false,
            object: {
              type: "MemberExpression",
              computed: true,
              object: {
                type: "Identifier",
                name: "obj",
              },
              property: {
                type: "StringLiteral",
                value: "property",
              },
            },
            property: {
              type: "Identifier",
              name: "property",
            },
          },
        },
      ],
    },
  },
];
const callCategory = [
  {
    testName: "should parse call expression with no arguments",
    input: "hello();",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "hello",
            },
            arguments: [],
          },
        },
      ],
    },
  },
  {
    testName: "should parse call expression with one argument",
    input: "hello(1);",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "hello",
            },
            arguments: [
              {
                type: "NumericLiteral",
                value: 1,
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse call expression with multiple arguments",
    input: "hello(1, 'world');",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "Identifier",
              name: "hello",
            },
            arguments: [
              {
                type: "NumericLiteral",
                value: 1,
              },
              {
                type: "StringLiteral",
                value: "world",
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse call expression with member expression",
    input: "obj.hello();",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "obj",
              },
              property: {
                type: "Identifier",
                name: "hello",
              },
            },
            arguments: [],
          },
        },
      ],
    },
  },
  {
    testName:
      "should parse call expression with a member expression as argument",
    input: "user.sayHello(obj.name);",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "MemberExpression",
              computed: false,
              object: {
                type: "Identifier",
                name: "user",
              },
              property: {
                type: "Identifier",
                name: "sayHello",
              },
            },
            arguments: [
              {
                type: "MemberExpression",
                computed: false,
                object: {
                  type: "Identifier",
                  name: "obj",
                },
                property: {
                  type: "Identifier",
                  name: "name",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse expressioncall with currying",
    input: "hello(1)(2);",
    expected: {
      type: "Program",
      body: [
        {
          type: "ExpressionStatement",
          expression: {
            type: "CallExpression",
            callee: {
              type: "CallExpression",
              callee: {
                type: "Identifier",
                name: "hello",
              },
              arguments: [
                {
                  type: "NumericLiteral",
                  value: 1,
                },
              ],
            },
            arguments: [
              {
                type: "NumericLiteral",
                value: 2,
              },
            ],
          },
        },
      ],
    },
  },
];
const classCategory = [
  {
    testName: "should parse class declaration",
    input: "class User {}",
    expected: {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          name: { type: "Identifier", name: "User" },
          childClass: null,
          body: { type: "BlockStatement", body: [] },
        },
      ],
    },
  },
  {
    testName: "should parse class declaration with body",
    input: `class User {
      fn hello() {
        return "Hello, world!";
      }
    }`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          name: { type: "Identifier", name: "User" },
          childClass: null,
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: { type: "Identifier", name: "hello" },
                params: [],
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "StringLiteral",
                        value: "Hello, world!",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse class declaration with this keyword",
    input: `class User {
      fn hello() {
        return this.name;
      }
    }`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          name: { type: "Identifier", name: "User" },
          childClass: null,
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: { type: "Identifier", name: "hello" },
                params: [],
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "MemberExpression",
                        computed: false,
                        object: { type: "ThisExpression" },
                        property: { type: "Identifier", name: "name" },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse class declaration with extends",
    input: `class User extends Person {
      fn hello() {
        return "Hello, world!";
      }
    }`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          name: { type: "Identifier", name: "User" },
          childClass: { type: "Identifier", name: "Person" },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: { type: "Identifier", name: "hello" },
                params: [],
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "StringLiteral",
                        value: "Hello, world!",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse class declaration with extends and super",
    input: `class User extends Person {
      fn hello() {
        return "Hello, world!";
      }
      super(name);
    }`,
    expected: {
      type: "Program",
      body: [
        {
          type: "ClassDeclaration",
          name: { type: "Identifier", name: "User" },
          childClass: { type: "Identifier", name: "Person" },
          body: {
            type: "BlockStatement",
            body: [
              {
                type: "FunctionDeclaration",
                name: { type: "Identifier", name: "hello" },
                params: [],
                body: {
                  type: "BlockStatement",
                  body: [
                    {
                      type: "ReturnStatement",
                      argument: {
                        type: "StringLiteral",
                        value: "Hello, world!",
                      },
                    },
                  ],
                },
              },
              {
                type: "ExpressionStatement",
                expression: {
                  type: "CallExpression",
                  callee: { type: "SuperExpression" },
                  arguments: [{ type: "Identifier", name: "name" }],
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    testName: "should parse class instance declaration",
    input: "let user = new User();",
    expected: {
      type: "Program",
      body: [
        {
          type: "VariableStatement",
          declarations: [
            {
              type: "VariableDeclaration",
              variableName: { type: "Identifier", name: "user" },
              variableInitialValue: {
                type: "NewExpression",
                callee: { type: "Identifier", name: "User" },
                arguments: [],
              },
            },
          ],
        },
      ],
    },
  },
];

describe("Parser", () => {
  let parser: Parser;
  let getExpr = (ast: AST, opt: "value" | "type") => {
    // @ts-ignore
    return ast.body[0].expression?.[opt];
  };

  beforeEach(() => {
    parser = new Parser();
  });

  describe("Inner workings", () => {
    let program = `11;
        /**
         * comment
         */
        "hello, world";
        // comment
        `;
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
    test("should parse comments ", () => {
      let astComments = parser.Parse(`
        /**
         * comment
         */
        "hello, world";
        `);

      expect(astComments).toBeDefined();
      expect(JSON.stringify(astComments)).toEqual(
        JSON.stringify({
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
        })
      );
      expect(getExpr(astComments, "type")).toBeString();
      expect(getExpr(astComments, "value")).toBe("hello, world");
    });
  });

  describe("Literal", () => {
    test("should parse numbers ", () => {
      let astNums = parser.Parse(`11;`);
      expect(astNums).toBeDefined();
      expect(getExpr(astNums, "type")).toBe("NumericLiteral");
      expect(getExpr(astNums, "value")).toBeNumber();
      expect(getExpr(astNums, "value")).toBe(11);
    });
    test("should parse string ", () => {
      let astStr = parser.Parse(`"Hello, world";`);
      expect(astStr).toBeDefined();
      expect(getExpr(astStr, "type")).toBe("StringLiteral");
      expect(getExpr(astStr, "value")).toBeString();
      expect(getExpr(astStr, "value")).toBe("Hello, world");
    });
  });

  describe("Statement", () => {
    statementCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedStatement = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedStatement)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("AssignmentExpression", () => {
    assignmentCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedAssignmentExpr = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedAssignmentExpr)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("BinaryExpression", () => {
    let parser: Parser;
    beforeEach(() => {
      parser = new Parser();
    });

    binaryCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedBinaryExpr = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedBinaryExpr)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("UnaryExpression", () => {
    unaryCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedUnaryExpr = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedUnaryExpr)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("Variable declaration", () => {
    variableCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedVarDecl = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedVarDecl)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("Conditional statement", () => {
    conditionalCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedConditionalStatement = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedConditionalStatement)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("Comparison Expression", () => {
    comparisonCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedComparisonExpr = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedComparisonExpr)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("Iteration statement", () => {
    iterationCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedIterationStatement = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedIterationStatement)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("Function declaration", () => {
    functionCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedFunctionDeclaration = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedFunctionDeclaration)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });

  describe("Member Expression", () => {
    memberCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedMemberExpression = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedMemberExpression)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });
  describe("Call Expression", () => {
    callCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedCallExpression = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedCallExpression)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });
  describe("Class Declaration", () => {
    classCategory.map((testCase) => {
      test(testCase.testName, () => {
        let parsedClassDeclaration = parser.Parse(testCase.input);

        expect(JSON.stringify(parsedClassDeclaration)).toEqual(
          JSON.stringify(testCase.expected)
        );
      });
    });
  });
});
