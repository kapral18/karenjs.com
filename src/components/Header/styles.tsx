import styled, { css, StyledComponent } from "styled-components";
import { ExoticComponent } from "react";
import { StyledIconProps } from "styled-icons/types/types";
import { ArrowBack, Home } from "@styled-icons/boxicons-regular";

import { colors } from "../../services/settings";
import media from "../../services/media";
import CustomGatsbyLink from "../CustomGatsbyLink";
import OutLink from "../OutLink";

export const alignNavLink = css`
    height: 100%;
    display: flex;
    align-items: center;
`;

export const getHeaderLinkIcon = (
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
    size: "3.5rem",
    fill: "white"
})`
    cursor: pointer;
    display: block;
`;

export const ReturnArrow = styled(getHeaderLinkIcon(ArrowBack)).attrs({
    title: "Go back"
})`
    ${media.tablet`
        display: none;
    `}
`;

export const HomeIcon = styled(getHeaderLinkIcon(Home)).attrs({
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

export const LogoHeading = styled(CustomGatsbyLink)`
    margin-left: -20px;

    ${alignNavLink}

    ${media.phone`
        display: none;
    `}
`;

export const Container = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: #220e10;
`;

export const InnerContainer = styled.nav`
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

export const NavLinks = styled.div`
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
            text-decoration: none;
        }

        :active {
            color: ${colors.linkActive};
        }

        :focus {
            color: ${colors.linkFocus};
            text-decoration: none;
        }
    }
`;

export const NavOutLink = styled(OutLink)`
    margin: 0 1rem;
    color: #fff;
    font-family: "Fira Sans", sans-serif;
    text-decoration: none;

    ${alignNavLink};

    :hover {
        text-decoration: none;
        color: ${colors.linkHover};
    }

    :active {
        color: ${colors.linkActive};
    }

    :focus {
        text-decoration: none;
        color: ${colors.linkFocus};
    }
`;

export const NavLink = styled(CustomGatsbyLink)`
    ${alignNavLink}
`;
