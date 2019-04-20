import React, { FC } from "react";
import styled from "styled-components";
import { graphql, useStaticQuery } from "gatsby";
import { DeepNonNullable } from "utility-types";

import GlobalStyles from "../common/GlobalStyles";
import Header from "./Header";
import media from "../services/media";
import { LayoutQueryQuery } from "../types/generated";

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
    display: block;
    width: 60%;
    max-width: 728px;
    margin: 0 auto;
    height: 6rem;
    font-size: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
`;

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

const Layout: FC = ({ children }) => {
    const data = useStaticQuery<DeepNonNullable<LayoutQueryQuery>>(layoutQuery);

    return (
        <Container>
            <GlobalStyles />
            <Header logo={data.logo} />
            <Content>{children}</Content>
            <Footer>
                © {new Date().getFullYear()}, built by Karen Grigoryan with
                <a css="margin-left: 0.25em" href="https://www.gatsbyjs.org">
                    GatsbyJS
                </a>
            </Footer>
        </Container>
    );
};

export default Layout;
