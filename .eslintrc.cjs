/* eslint-disable @typescript-eslint/naming-convention */

/**
 * @type {import("eslint").Linter.Config}
 */
const config = {
	env: {
		browser: true,
		es2021: true,
		node: true
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: "latest",
		sourceType: "module",
		project: "./tsconfig.json"
	},
	overrides: [ { files: "*.cjs" } ],
	plugins: [
		"@typescript-eslint"
	],
	rules: {
		indent: "off",
		"@typescript-eslint/indent": [ 1, "tab", { SwitchCase: 1 } ],

		"linebreak-style": [ 2, "windows" ],

		quotes: "off",
		"@typescript-eslint/quotes": [ 1, "double" ],

		semi: [ 1, "never" ],

		"no-trailing-spaces": [ 1 ],

		"@typescript-eslint/no-non-null-assertion": "off",

		"no-constant-condition": [ 1, { checkLoops: false } ],
		// "@typescript-eslint/no-unnecessary-condition": [ 1, { allowConstantLoopConditions: true } ],

		"comma-spacing": "off",
		"@typescript-eslint/comma-spacing": [ 1, { before: false, after: true } ],

		"object-curly-spacing": "off",
		"@typescript-eslint/object-curly-spacing": [ 1, "always" ],

		"quote-props": [ 1, "as-needed" ],

		"array-bracket-spacing": [ 1, "always" ],

		"default-case": "error",

		"@typescript-eslint/consistent-type-imports": [ 1, { prefer: "type-imports" } ],

		"@typescript-eslint/consistent-type-exports": 1,

		"brace-style": "off",
		"@typescript-eslint/brace-style": 1,

		camelcase: "off",
		"@typescript-eslint/naming-convention": [
			1,
			{
				selector: "default",
				format: [ "camelCase" ],
				leadingUnderscore: "allow",
				trailingUnderscore: "allow"
			},
			{
				selector: "variable",
				format: [ "camelCase", "UPPER_CASE" ],
				leadingUnderscore: "allow",
				trailingUnderscore: "allow"
			},
			{
				selector: "typeLike",
				format: [ "PascalCase" ]
			}
		],

		// "multiline-comment-style": 1,

		"dot-notation": 1,

		"arrow-body-style": 1,

		curly: [ 1, "multi-line" ],

		"comma-dangle": 1,

		"keyword-spacing": 1,

		"no-multi-spaces": 1,

		eqeqeq: 1
	}
}

module.exports = config