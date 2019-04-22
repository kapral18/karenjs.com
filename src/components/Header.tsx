import React, { FC, ExoticComponent } from "react";
import { navigate, Location } from "@reach/router";
import Image from "gatsby-image";
import { DeepNonNullable } from "utility-types";
import styled, { css, StyledComponent } from "styled-components";
import { StyledIconProps } from "styled-icons/StyledIconBase/StyledIconBase";
import { ArrowBack, Home } from "styled-icons/boxicons-regular";

import CustomGatsbyLink from "./CustomGatsbyLink";
import { colors } from "../services/settings";
import media from "../services/media";
import OutLink from "./OutLink";
import { LayoutQueryQuery } from "../types/generated";

const alignNavLink = css`
    height: 100%;
    display: flex;
    align-items: center;
`;

const navigateRoot = (): void => {
    navigate("/");
};

const handleNavBack = (): void => {
    navigate("../");
};

const handleNavBackTwice = (): void => {
    navigate("../../");
};

const isLocationRoot = (location: Window["location"]): boolean => {
    return location.pathname === "/";
};

const isLocationBlog = (location: Window["location"]): boolean => {
    return location.pathname.includes("/blog/");
};

const getHeaderLinkIcon = (
    iconClass: ExoticComponent<StyledIconProps>
): StyledComponent<
    ExoticComponent<StyledIconProps>,
    any,
    {
        size: string;
        fill: string;
    },
    "size" | "fill"
> => styled(iconClass).attrs({
    size: "5rem",
    fill: "white"
})`
    cursor: pointer;
    display: block;
`;

const ReturnArrow = styled(getHeaderLinkIcon(ArrowBack)).attrs({
    title: "Go back"
})`
    ${media.tablet`
        display: none;
    `}
`;

const HomeIcon = styled(getHeaderLinkIcon(Home)).attrs({
    title: "Return home",
    size: "1.2rem"
})`
    ${alignNavLink}

    margin-top: -2px;
    margin-right: 1rem;

    display: none;

    :hover path {
        stroke: ${colors.linkHover};
    }

    ${media.phone`
        display: initial;
    `}
`;

const LogoHeading = styled(CustomGatsbyLink)`
    margin-left: -20px;

    ${alignNavLink}

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
    background: #220e10;
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

const NavLinks = styled.div`
    top: 0;
    right: 0;
    display: flex;
    height: 100%;
    align-items: center;

    ${media.mobile`
        font-size: 1.1rem;
    `};

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

const NavOutLink = styled(OutLink)`
    margin: 0 1rem;
    color: #fff;
    font-family: "Fira Sans", sans-serif;
    text-decoration: none;

    ${alignNavLink}

    :hover {
        text-decoration: none;
        color: #e2777a;
    }
`;

const NavLink = styled(CustomGatsbyLink)`
    ${alignNavLink}
`;

interface Props {
    logo: DeepNonNullable<LayoutQueryQuery>["logo"];
}

const Header: FC<Props> = ({ logo }) => {
    return (
        <Container>
            <InnerContainer>
                <Location>
                    {({ location }) => {
                        if (isLocationRoot(location)) {
                            return null;
                        }
                        return (
                            <>
                                <ReturnArrow
                                    onClick={
                                        isLocationBlog(location)
                                            ? handleNavBackTwice
                                            : handleNavBack
                                    }
                                />
                            </>
                        );
                    }}
                </Location>
                <HomeIcon onClick={navigateRoot} />
                <LogoHeading to="/" title="Go to main page">
                    <Image fixed={logo.childImageSharp.fixed} alt="Logo" />
                </LogoHeading>
                <NavLinks>
                    <NavLink to="/about" title="About">
                        About
                    </NavLink>
                    {/* <NavLink to="/projects" title="Projects">
                        Projects
                    </NavLink> */}
                    <NavLink to="/blog" title="Blog">
                        Blog
                    </NavLink>
                    <NavLink to="/appearances" title="Appearances">
                        Appearances
                    </NavLink>
                    <NavOutLink href="https://kapral18.github.io/cv">
                        CV
                    </NavOutLink>
                </NavLinks>
            </InnerContainer>
        </Container>
    );
};

export default Header;
