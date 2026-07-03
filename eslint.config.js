import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

// ESLint performs static analysis: it reports risky code patterns without
// running the application. This uses ESLint's modern "flat config" format.
export default tseslint.config(
  // Generated output and temporary work are not source code and should not be
  // linted. `dist` and `coverage` can be safely recreated by tools.
  { ignores: ["dist", "coverage", "work", "tmp"] },
  {
    // Apply this block to both regular TypeScript and React TypeScript files.
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      // Match the JavaScript language level emitted by the Vite build.
      ecmaVersion: 2022,
      // Allow browser-provided names such as document, window, and console.
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      // Hooks rules protect React state/effect ordering and dependency lists.
      ...reactHooks.configs.recommended.rules,
      // Fast Refresh works most reliably when component modules export only
      // components. Constant exports are safe and intentionally allowed.
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
);
