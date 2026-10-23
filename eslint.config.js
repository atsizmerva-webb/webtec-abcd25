import js from "@eslint/js"
import globals from "globals"
import json from "@eslint/json"
import css from "@eslint/css"
import { defineConfig } from "eslint/config"

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      semi: ['error', 'never'],
      indent: ['error', 2]
    }
  },
  {
    files: ["**/*.json"],
    plugins: { json },
    language: "json/json",
    extends: ["json/recommended"],
  },
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
    rules: {
      // allow unknown CSS-variables (var(--...)) defined in other files
      "css/no-invalid-properties": ["error", { allowUnknownVariables: true }],
      "css/use-baseline": ["error", { available: "newly" }],
    },
  },
  {
    // package-lock.json is auto-generated; .dbw.js is a downloaded course
    // test-harness file, not code written by the student.
    ignores: ["package-lock.json", "**/.vscode/** ", "**/.dbw.js"],
  },
])
