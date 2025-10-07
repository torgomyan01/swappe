// ESLint v9 flat config (CommonJS)
// Fixes ESM/CJS issues by using require/module.exports only.

const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".history/**",
      "dist/**",
      "out/**",
      "coverage/**",
      "./history/**",
    ],
  },
  js.configs.recommended,
  ...compat.config({
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      // "next/core-web-vitals",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      ecmaFeatures: { jsx: true },
    },
    plugins: ["react", "@typescript-eslint", "prettier"],
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      semi: ["error", "always"],
      indent: "off",
      "no-console": "off",
      "arrow-body-style": "off",
      "prefer-arrow-callback": "off",
      curly: ["warn", "all"],
      "no-confusing-arrow": ["warn", { allowParens: false }],
      "operator-linebreak": "off",
      "no-prototype-builtins": "warn",
      "no-extra-boolean-cast": "warn",
      "no-useless-escape": "warn",
      "no-useless-catch": "warn",
      "object-shorthand": "warn",
      "prefer-const": "warn",
      "prefer-template": "warn",
      "react/prop-types": "off",
      "import/prefer-default-export": "off",
      "react/display-name": "off",
      "import/no-cycle": "off",
      "react/no-find-dom-node": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true,
        },
      ],
    },
  }),
];

module.exports = config;
