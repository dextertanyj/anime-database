module.exports = {
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["react", "react-hooks"],
  extends: ["../.eslintrc.js", "plugin:react/recommended", "plugin:react-hooks/recommended"],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  ignorePatterns: ["build", "node_modules", "vite.config.ts", "codegen.ts"],
  rules: {
    "react/react-in-jsx-scope": "off",
  },
};
