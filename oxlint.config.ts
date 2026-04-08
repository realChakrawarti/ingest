import { defineConfig } from "oxlint";

export default defineConfig({
  jsPlugins: ["@e18e/eslint-plugin"],
  plugins: ["unicorn", "react", "nextjs", "typescript", "oxc", "promise"],
  rules: {
    "e18e/ban-dependencies": "error",
    "e18e/prefer-date-now": "error",
    "nextjs/no-img-element": "off",
    "react/jsx-key": "error",
    "react/jsx-boolean-value": "error",
    "react/jsx-no-useless-fragment": "error",
    "unicorn/prefer-at": "error",
    "promise/no-return-in-finally": "error",
    "typescript/no-explicit-any": "warn",
    "typescript/consistent-type-imports": "error",
    "no-template-curly-in-string": "error",
    "no-else-return": "error",
    "no-unused-vars": "error",
    "no-console": "error",
  },
});