import { createGlobalStyle } from "styled-components";
import { colors } from "./settings";

const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: system;
        font-style: normal;
        font-weight: 300;
        src: local('.SFNSText-Light'), local('.HelveticaNeueDeskInterface-Light'),
        local('.LucidaGrandeUI'), local('Ubuntu Light'), local('Segoe UI Light'),
        local('Roboto-Light'), local('DroidSans'), local('Tahoma');
    }

    html, body {
        height: 100%;
    }

    :root {
        font-size: 10px;
    }

    body {
        font-family: 'system';
        margin: 0;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        color: ${colors.body};
        min-height: 100vh;
        position: relative;
        font-size: 1.6rem;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Fira Sans', sans-serif;
    }

    h2 {
        font-size: 2.5rem;
    }

    h3 {
        font-size: 2.4rem;
    }

    h4 {
        font-size: 1.6rem;
    }

    .code, code {
        font-family: Menlo, Monaco, "Courier New", Courier, monospace;
        word-break: break-word;
    }

    pre code {
        word-break: normal;
    }

    :not(pre) > code[class*="language-"], pre[class*="language-text"] {
        background-color: transparent;
        color: inherit;
        font-size: medium;
    }
    a {
        text-decoration: none;

        :hover {
            text-decoration: underline;
        }
    }
`;

export default GlobalStyles;
