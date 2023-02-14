module.exports = {
	parserOptions: {
		project: "tsconfig.json",
		tsconfigRootDir: __dirname,
	},
	extends: ["../.eslintrc.js"],
	env: {
		jest: true,
	},
};
