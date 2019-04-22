import { createGlobalStyle } from "styled-components";
import { colors } from "../services/settings";

const GlobalStyles = createGlobalStyle`
    html, body {
        height: 100%;
    }

    :root {
        font-size: 10px;
    }

    body {
        font-family: 'PT Sans', sans-serif;
        font-weight: 400;
        margin: 0;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        color: ${colors.body};
        min-height: 100vh;
        position: relative;
        font-size: 1.6rem;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Montserrat', sans-serif;
        font-weight: 900;
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
        font-family: "Droid Sans Mono", Menlo, Monaco, "Courier New", Courier, monospace;
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
