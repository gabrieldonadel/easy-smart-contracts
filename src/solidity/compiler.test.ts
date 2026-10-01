import { parseCompilationResult } from "./compiler";

it("does not treat Solidity warnings as compilation failures", () => {
  const result = parseCompilationResult(JSON.stringify({
    contracts: {},
    errors: [{ severity: "warning", message: "A deprecation warning" }],
  }));

  expect(result.hasErrors).toBe(false);
  expect(result.diagnostics).toHaveLength(1);
});

it("detects Solidity compiler errors", () => {
  const result = parseCompilationResult(JSON.stringify({
    errors: [{ severity: "error", message: "Parser error" }],
  }));

  expect(result.hasErrors).toBe(true);
});
