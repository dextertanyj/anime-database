module.exports = {
	parser: "@typescript-eslint/parser",
	parserOptions: {
		project: "tsconfig.json",
		tsconfigRootDir: __dirname,
		sourceType: "module",
	},
	plugins: ["@typescript-eslint", "react", "react-hooks", "simple-import-sort"],
	extends: [
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:react-hooks/recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:prettier/recommended",
	],
	root: true,
	env: {
		browser: true,
		es6: true,
	},
	settings: {
		react: {
			version: "detect",
		},
	},
	ignorePatterns: [
		"build",
		"tsconfig.json",
		".eslintrc.js",
		"vite.config.ts",
		"codegen.ts",
		"src/generated/**/*",
	],
	rules: {
		"no-console": "warn",
		"@typescript-eslint/no-unused-vars": [
			"warn",
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
		"react/react-in-jsx-scope": "off",
		"prettier/prettier": [
			"error",
			{
				endOfLine: "auto",
			},
		],
		"simple-import-sort/imports": [
			"error",
			{
				groups: [
					// Side effect imports.
					["^\\u0000"],
					// Packages: Start with a letter (or digit or underscore), or `@` followed by a letter.
					["^react", "^@?\\w"],
					// Absolute imports, must include `/` and cannot include `@`
					["^([\\w-]+)/"],
					// Parent imports. Place `..` last.
					["^\\.\\.(?!/?$)", "^\\.\\./?$"],
					// Other relative imports. Place same folder imports and `.` last.
					["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
				],
			},
		],
		"simple-import-sort/exports": "error",
	},
};
