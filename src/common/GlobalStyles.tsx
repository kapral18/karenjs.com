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
        font-family: 'Merriweather', sans-serif;
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
        color: ${colors.link};

        :hover {
            text-decoration: underline;
            color: ${colors.linkHover};
        }

        :active {
            color: ${colors.linkActive}
        }

        :focus {
            text-decoration: underline;
            color: ${colors.linkFocus}
        }
    }
    /**
    * Add back the container background-color, border-radius, padding, margin
    * and overflow that we removed from <pre>.
    */
    .gatsby-highlight {
        background-color: #220e10;
        border-radius: 0.3em;
        margin: 0.5em 0;
        padding: 1em;
        overflow: auto;
    }

    /**
    * Remove the default PrismJS theme background-color, border-radius, margin,
    * padding and overflow.
    * 1. Make the element just wide enough to fit its content.
    * 2. Always fill the visible space in .gatsby-highlight.
    * 3. Adjust the position of the line numbers
    */
    .gatsby-highlight pre[class*="language-"] {
        background-color: transparent;
        margin: 0;
        padding: 0;
        overflow: initial;
        float: left; /* 1 */
        min-width: 100%; /* 2 */
    }

    .gatsby-highlight pre[class*="language-"].line-numbers {
        padding: 0;
        padding-left: 2.8em;
        overflow: initial;
    }

    .gatsby-resp-image-figcaption {
        display: none;
    }

    :not(pre) > code[class*="language-"] {
        background: #999;
        color: #fff;
        white-space: nowrap;
        
        a & {
          background: currentColor;
        }
    }
    
    a:hover :not(pre) > code[class*="language-"] {
        background: ${colors.link};
    }

    .anchor {
        color: currentColor;

        :hover {
            color: currentColor
        }

        :active {
            color: currentColor
        }

        :focus {
            color: currentColor
        }
    }

    #gatsby-plugin-page-progress {
        transition: none !important;
    }
`;

export default GlobalStyles;
