import { Command } from "commander";
import { Parser } from "../src/parser";

const program = new Command();

program
  .option("-f, --file <type>", "File input")
  .showHelpAfterError("Please provide a file or string input")
  .option("-i, --inline <type>", "inline string input")
  .option("-s, --spacing", "spacing inside the output ast")
  .version("0.0.1")
  .helpOption("-h, --help", "Display help for command");

program.parse(process.argv);

const options = program.opts();

const input = options.file || options.inline;
const handleReadingFile = (input: string) => {
  if (!input) {
    console.error("Please provide a file or string input");
    process.exit(1);
  } else {
    parseInput(input);
  }
};
const checkValidFileExtension = (file: string): boolean => {
  return file.split(".").pop() === "sigx";
};

const readFromFile = async (file: string): Promise<string> => {
  return await Bun.file(file).text();
};

const parseInput = async (input: string): Promise<void> => {
  const parser = new Parser();
  let ast;

  if (checkValidFileExtension(input)) {
    const inputTxt = await readFromFile(input);
    ast = parser.Parse(inputTxt);
  } else {
    ast = parser.Parse(input);
  }

  let jsonAST = JSON.stringify(ast, null, options.s || 2);
  console.log(jsonAST);
};
handleReadingFile(input);
