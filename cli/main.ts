import { Command } from "commander";
import { Parser } from "../src/parser";

const program = new Command();
const SUPPORTED_OUTPUT_FILE_EXTENSIONS = ["json", "txt"];
program
  .option("-f, --file <type>", "File input")
  .option("-o, --output <type>", "output the AST into a file")
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
  let data = "";
  const decoder = new TextDecoder("utf-8");
  const stream = Bun.file(file).stream();
  for await (const chunk of stream) {
    data += decoder.decode(chunk);
  }
  return data;
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
  if (options.output) {
    if (
      SUPPORTED_OUTPUT_FILE_EXTENSIONS.includes(options.output.split(".").pop())
    ) {
      const outfile = Bun.file(options.output);
      const writer = outfile.writer();
      writer.write(jsonAST);
      writer.end();
    }
  } else {
    console.log(jsonAST);
  }
};
handleReadingFile(input);
