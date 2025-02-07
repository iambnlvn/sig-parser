import { Command } from "commander";
import { Parser } from "../src/parser";

const program = new Command();
const SUPPORTED_OUTPUT_FILE_EXTENSIONS = ["json", "txt"];

program
  .version("0.0.1")
  .option("-f, --file <file>", "Input file path")
  .option("-i, --inline <input>", "Inline string input")
  .option("-o, --output <file>", "Output the AST into a file")
  .option("-s, --spacing", "Use extra spacing in the AST output", false)
  .helpOption("-h, --help", "Display help for command")
  .showHelpAfterError("Please provide a file or string input");

program.parse(process.argv);
const options = program.opts();
const input = options.file || options.inline;

const isFileInput = (input: string): boolean => {
  return input.endsWith(".sigx");
};

const isValidOutputExtension = (file: string): boolean => {
  const ext = file.split(".").pop();
  if(!ext) return false;
  return SUPPORTED_OUTPUT_FILE_EXTENSIONS.includes(ext);
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

const writeToFile = async (file: string, content: string): Promise<void> => {
  const outfile = Bun.file(file);
  const writer = outfile.writer();
  writer.write(content);
  writer.end();
};

const parseInput = async (input: string): Promise<void> => {
  const parser = new Parser();
  let inputContent: string;

  if (isFileInput(input)) {
    inputContent = await readFromFile(input);
  } else {
    inputContent = input;
  }

  const ast = parser.Parse(inputContent);
  const spacing = options.spacing ? 2 : undefined;
  const jsonAST = JSON.stringify(ast, null, spacing);

  if (options.output) {
    if (isValidOutputExtension(options.output)) {
      await writeToFile(options.output, jsonAST);
    } else {
      console.error("Unsupported output file extension.");
      process.exit(1);
    }
  } else {
    console.log(jsonAST);
  }
};

const run = async () => {
  if (!input) {
    console.error("Please provide a file or string input.");
    program.help();
    process.exit(1);
  }
  await parseInput(input);
};

run();