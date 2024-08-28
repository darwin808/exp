const { resolve } = require("node:path")
const project = resolve(process.cwd(), "tsconfig.json")
/*
 * This is a custom ESLint configuration for use with
 * internal (bundled by their consumer) libraries
 * that utilize React.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 */

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["eslint:recommended", "prettier", "plugin:@typescript-eslint/recommended", "turbo"],
  plugins: ["only-error", "unused-imports", "header", "simple-import-sort", "import"],
  globals: {
    React: true,
    JSX: true,
    document: true,
    foo: true,
    window: true
  },
  env: {
    browser: true,
    node: true
  },
  settings: {
    "import/resolver": {
      typescript: {
        project
      }
    }
  },
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
    "dist/",
    ".eslintrc.cjs",
    "vite.config.ts",
    "postcss.config.js",
    "tailwind.config.js"
  ],
  overrides: [
    // Force ESLint to detect .tsx files
    { files: ["*.js?(x)", "*.ts?(x)"] }
  ],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest"
  },
  rules: {
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      { argsIgnorePattern: "^_", varsIgnorePattern: "_[iI]gnored" }
    ],
    "no-console": ["error", { allow: ["error"] }],
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "header/header": [
      2,
      "block",
      [
        "*",
        " * Property of the Metropolitan Bank & Trust Co.",
        " * Reuse as a whole or in part is prohibited without permission.",
        " * Created by the Product Engineering team/Digital Banking Division",
        " "
      ]
    ],
    "@typescript-eslint/no-explicit-any": "error",
    "no-undef": "error",
    "no-unused-vars": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_"
      }
    ]
  }
}
