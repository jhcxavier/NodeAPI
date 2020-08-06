module.exports = {
  parseOptions: {
    ecmaVersion: "6",
    sourceType: "module",
  },
  env: {
    node: true,
    es6: true,
  },
  rules: {
    "no-empty": "error",
    "no-multiple-empty": "warn",
    "no-var": "error",
    "prefer-const": "error",
  },
};
