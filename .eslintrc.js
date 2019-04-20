module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint", "react-hooks", "prettier", "jsx-a11y"],
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:prettier/recommended",
        "prettier",
        "prettier/react",
        "prettier/@typescript-eslint"
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        ecmaFeatures: {
            jsx: true
        },
        project: "./tsconfig.json"
    },
    env: {
        browser: true,
        node: true,
        commonjs: true,
        es6: true,
        jest: true
    },
    rules: {
        indent: "off",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-object-literal-type-assertion": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/explicit-function-return-type": [
            "error",
            {
                allowExpressions: true,
                allowTypedFunctionExpressions: true
            }
        ],
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "warn",
        "react/prop-types": "off",
        "prettier/prettier": "error"
    },
    settings: {
        react: {
            pragma: "React",
            version: "detect"
        }
    }
};
