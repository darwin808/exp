/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["@repo/eslint-config/react-internal.js"],
  parser: "@typescript-eslint/parser",
  globals: {
    document: true,
    foo: true,
    window: true
  },
  env: {
    browser: true
  }
}
