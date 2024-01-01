import { beforeEach, describe, expect, test } from "bun:test";
import { Tokenizer } from "../src/tokenizer";

describe("Tokenizer", () => {
  let tokenizer: Tokenizer;

  beforeEach(() => {
    tokenizer = new Tokenizer();
  });

  test("should initialize with empty string and cursor at position 0", () => {
    expect(tokenizer.str).toBe("");
    expect(tokenizer.cursor).toBe(0);
  });

  test("should update string when init is called", () => {
    tokenizer.init("hello");
    expect(tokenizer.str).toBe("hello");
  });
  test("should return true if cursor is at the end of the string", () => {
    tokenizer.init("hello");
    tokenizer.cursor = 5;
    expect(tokenizer.isEOF()).toBe(true);
  });
  test("should return false if cursor is not at the end of the string", () => {
    tokenizer.init("hello");
    tokenizer.cursor = 2;
    expect(tokenizer.isEOF()).toBe(false);
  });
  test("should return true if there is a next token", () => {
    tokenizer.init("hello");
    expect(tokenizer.hasNextToken()).toBe(true);
  });
  test("should return false if there is no next token", () => {
    tokenizer.init("");
    expect(tokenizer.hasNextToken()).toBe(false);
  });
});
