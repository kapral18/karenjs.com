import React, { FC } from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";

import GlobalStyles from "../common/GlobalStyles";
import Header from "./Header";
import media from "../services/media";
import { LayoutQueryQuery } from "../types/generated";
import OutLink from "./OutLink";
import GenericError from "./GenericError";

const Container = styled.div`
    padding-top: 6rem;
`;

const Content = styled.div`
    width: 60%;
    max-width: 728px;
    margin: 0 auto;

    ${media.desktop`
        width: 80%;
    `}
`;

const Footer = styled.footer`
    display: flex;
    width: 60%;
    max-width: 728px;
    margin: 0 auto;
    flex-wrap: wrap;
    padding-bottom: 6rem;
    font-size: 1rem;
    justify-content: center;
`;

const BuiltBy = styled.div`
    margin-right: 0.3em;

    ${media.phone`
        margin-right: 0;
        flex-basis: 100%;
        text-align: center;
    `}
`;

const Layout: FC = ({ children }) => {
    const { logo } = useStaticQuery<LayoutQueryQuery>(layoutQuery);

    if (!logo?.childImageSharp?.fixed) {
        return (
            <GenericError
                missing={{ logo }}
                message={`<Layout />: props missing:
                            data.logo or
                            data.logo.childImageSharp or
                            data.logo.childImageSharp.fixed`}
            />
        );
    }

    return (
        <Container>
            <GlobalStyles />
            <Header logoFixed={logo.childImageSharp.fixed} />
            <Content>{children}</Content>
            <Footer>
                <BuiltBy>© {new Date().getFullYear()}, built with</BuiltBy>
                <OutLink href="https://www.gatsbyjs.org">GatsbyJS</OutLink>
            </Footer>
        </Container>
    );
};

export default Layout;

const layoutQuery = graphql`
    query LayoutQuery {
        site {
            siteMetadata {
                title
            }
        }

        logo: file(absolutePath: { regex: "/logo[.]png/" }) {
            childImageSharp {
                fixed(height: 60) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
    }
`;
