import { Parser } from "../parser";

const parser = new Parser();

let program = `

'122'
`;

let ast = parser.parse(program);

console.log(JSON.stringify(ast, null, 2));
