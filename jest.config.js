// const { defaults } = require("jest-config");

module.exports = {
    verbose: true,
    transform: {
        "^.+\\.(js|ts)x?$": "babel-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.([tj]sx?)$",
    moduleNameMapper: {
        ".+\\.(css|styl|less|sass|scss)$": "identity-obj-proxy",
        ".+\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/__mocks__/file-mock.js"
    },
    testEnvironment: "jsdom",
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testPathIgnorePatterns: ["<rootDir>/node_modules", "<rootDir>/.cache"],
    transformIgnorePatterns: ["node_modules/(?!(gatsby)/)"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    globals: {
        __PATH_PREFIX__: ""
    },
    testURL: "http://localhost",
    setupFiles: ["raf/polyfill", "<rootDir>/loadershim.js"]
};
