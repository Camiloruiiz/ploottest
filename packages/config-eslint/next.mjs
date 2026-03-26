import { FlatCompat } from "@eslint/eslintrc";

export function createNextConfig(baseDirectory) {
  const compat = new FlatCompat({
    baseDirectory,
  });

  return [
    {
      ignores: [".next/**", "node_modules/**", "playwright-report/**", "test-results/**"],
    },
    ...compat.extends("next/core-web-vitals"),
  ];
}
