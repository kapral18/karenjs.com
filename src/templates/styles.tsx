import styled from "styled-components";
import media from "../services/media";

export const Container = styled.article`
    margin-top: 8rem;

    ${media.phone`
        margin-top: 4rem;
    `}

    p {
        line-height: 1.5;
    }

    blockquote {
        font-size: 1.6rem;
        color: inherit;
        font-style: italic;
        border-left: 0.2rem solid rgb(0, 0, 0);
        padding-left: 1rem;
        margin: 1rem 0;
    }

    pre {
        margin-bottom: 2rem;
    }

    h3 {
        line-height: 1.13;
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 2rem 0 2rem;
    }

    hr {
        border: 0;
        border-top: 0.1rem solid #ccc;
        display: block;
        height: 1rem;
        padding: 0;
    }
`;

export const Header = styled.header`
    margin-bottom: 3rem;

    ${media.tablet`
        text-align: center;
    `};
`;

export const Title = styled.h1`
    margin-bottom: 1rem;
    font-size: 3rem;
`;

export const Contents = styled.div`
    margin: 5rem 0;

    a:hover {
        text-decoration: underline;
    }
`;
