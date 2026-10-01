export type SolidityDiagnostic = {
  message: string;
  severity: "error" | "warning" | "info" | string;
};

export const parseCompilationResult = (result: string) => {
  const output = JSON.parse(result);
  const diagnostics: SolidityDiagnostic[] = output.errors || [];

  return {
    diagnostics,
    hasErrors: diagnostics.some(({ severity }) => severity === "error"),
    output,
  };
};
