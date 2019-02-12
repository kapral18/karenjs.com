import React from "react";
import styled from "styled-components";
import { StaticQuery, graphql } from "gatsby";
import GlobalStyles from "../common/global";
import Header from "./Header";
import media from "../utils/media";

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

const Layout = ({ children }) => {
    return (
        <StaticQuery
            query={layoutQuery}
            render={(data) => {
                return (
                    <Container>
                        <GlobalStyles />
                        <Header logo={data.logo} />
                        <Content>{children}</Content>
                        <Footer>
                            © {new Date().getFullYear()}, built by Karen G. with
                            <a
                                css="margin-left: 0.25em"
                                href="https://www.gatsbyjs.org"
                            >
                                gatsby.js
                            </a>
                        </Footer>
                    </Container>
                );
            }}
        />
    );
};

export default Layout;
