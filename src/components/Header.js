import React, { useEffect } from "react";
import { Location, navigate } from "@reach/router";
import Prism from "prismjs";
import styled from "styled-components";
import CustomGatsbyLink from "./CustomGatsbyLink";
import { ArrowBack } from "styled-icons/boxicons-regular";
import { colors } from "../common/css/settings";
import media from "../utils/media";

const handleNavBack = () => {
    navigate("../");
};

const handleNavBackTwice = () => {
    navigate("../../");
};

const isLocationRoot = (location) => {
    return location.pathname === "/";
};

const isLocationBlog = (location) => {
    return location.pathname.includes("/blog/");
};

const ReturnArrow = styled(ArrowBack).attrs({
    title: "Return to main page",
    size: "5rem",
    fill: "white"
})`
    cursor: pointer;
    display: block;
`;

const ReturnArrowWrapped = styled(ReturnArrow)`
    ${media.tablet`
        display: none;
    `}
`;

const LogoHeading = styled(CustomGatsbyLink)`
    margin-left: -20px;
    ${media.phone`
        display: none;
    `}
`;

const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #2d2d2d;
`;

const InnerContainer = styled.nav`
    height: 6rem;
    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    width: 60%;
    max-width: 728px;
    margin: 0 auto;

    ${media.desktop`
        width: 80%;
    `}

    ${media.tablet`
        justify-content: center;
    `}
`;

const defaultProps = {
    title: ""
};

const NavLinks = styled.div`
    top: 0;
    right: 0;
    display: flex;
    height: 100%;
    align-items: center;

    ${media.tablet`
        position: static;
    `}

    ${CustomGatsbyLink} {
        margin: 0 1rem;
        color: #fff;
        font-family: "Fira Sans", sans-serif;

        :hover {
            color: ${colors.linkHover};
        }
    }
`;

const Header = ({ title }) => {
    useEffect(() => {
        Prism.highlightAll();
    }, []);

    return (
        <Container>
            <InnerContainer>
                <Location>
                    {({ location }) => {
                        if (isLocationRoot(location)) {
                            return null;
                        }
                        return (
                            <ReturnArrowWrapped
                                onClick={
                                    isLocationBlog(location)
                                        ? handleNavBackTwice
                                        : handleNavBack
                                }
                            />
                        );
                    }}
                </Location>
                <LogoHeading to="/" title="Go to main page">
                    <pre>
                        <code className="language-js">{title}</code>
                    </pre>
                </LogoHeading>
                <NavLinks>
                    <CustomGatsbyLink to="/about" title="About">
                        About
                    </CustomGatsbyLink>
                    <CustomGatsbyLink to="/blog" title="Blog">
                        Blog
                    </CustomGatsbyLink>
                    <CustomGatsbyLink to="/appearances" title="Appearances">
                        Appearances
                    </CustomGatsbyLink>
                    <CustomGatsbyLink to="/contacts" title="Contacts">
                        Contacts
                    </CustomGatsbyLink>
                </NavLinks>
            </InnerContainer>
        </Container>
    );
};

Header.defaultProps = defaultProps;

export default Header;
