module.exports = {
  env: {
    es2022: true,
    node: true,
  },
  parserOptions: {
    sourceType: "module",
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  plugins: ["simple-import-sort"],
  root: true,
  ignorePatterns: ["build", "node_modules"],
  overrides: [
    {
      parser: "@typescript-eslint/parser",
      files: ["*.ts", "*.tsx"],
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
      ],
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/require-await": "warn",
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-return": "warn",
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", ignoreRestSiblings: true },
        ],
        "@typescript-eslint/member-delimiter-style": [
          "error",
          {
            multiline: {
              delimiter: "semi",
              requireLast: true,
            },
            singleline: {
              delimiter: "semi",
              requireLast: false,
            },
          },
        ],
      },
    },
  ],
  rules: {
    "no-console": "warn",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Side effect imports.e
          ["^\\u0000"],
          // Node.js builtins.
          [`^(${require("module").builtinModules.join("|")})(/|$)`],
          // Packages: Start with a letter (or digit or underscore), or `@` followed by a letter.
          ["^react$", "^@\\w", "^\\w"],
          // Absolute imports, must include `/` and cannot include `@`.
          ["^([\\w-]+)/"],
          // Parent imports. Place `..` last.
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Other relative imports. Place same folder imports and `.` last.
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          // Style imports.
          ["^.+\\.s?css$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",
  },
};
