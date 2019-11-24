import React, { FC } from "react";
import { navigate, Location } from "@reach/router";
import Image, { FixedObject } from "gatsby-image";

import { LayoutQueryQuery } from "../../types/generated";
import GenericError from "../GenericError";
import {
    Container,
    InnerContainer,
    ReturnArrow,
    HomeIcon,
    LogoHeading,
    NavLinks,
    NavLink,
    NavOutLink
} from "./styles";

const navigateRoot = (): Promise<void> => navigate("/");

const handleNavBack = (): Promise<void> => navigate("../");

const handleNavBackTwice = (): Promise<void> => navigate("../../");
const isLocationRoot = (location: Window["location"]): boolean => {
    return location.pathname === "/";
};

const isLocationBlog = (location: Window["location"]): boolean => {
    return location.pathname.includes("/blog/");
};

interface Props {
    logoFixed: NonNullable<
        NonNullable<NonNullable<LayoutQueryQuery>["logo"]>["childImageSharp"]
    >["fixed"];
}

const Header: FC<Props> = ({ logoFixed }) => {
    if (
        !logoFixed?.base64 ||
        !logoFixed?.width ||
        !logoFixed?.height ||
        !logoFixed?.src ||
        !logoFixed?.srcSet
    ) {
        return (
            <GenericError
                missing={{ logoFixed }}
                message={`<Layout />: props missing:
                            logoFixed or
                            logoFixed.base64 or
                            logoFixed.width or
                            logoFixed.height or
                            logoFixed.src or
                            logoFixed.srcSet`}
            />
        );
    }

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
                    <Image fixed={logoFixed as FixedObject} alt="Logo" />
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
