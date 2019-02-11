import React from "react";
import moment from "moment";
import styled from "styled-components";
import Box from "../common/Box";
import OutLink from "./OutLink";

const AppearanceOutLink = styled(OutLink)`
    color: #000;
    font-family: "Fira Sans", sans-serif;
    text-decoration: none;
    :hover {
        color: #e2777a;
        text-decoration: none;
    }
`;

const DateStyle = styled.div`
    font-size: 1rem;
    margin-left: auto;
`;

const AppearanceStyle = styled.div`
    padding-left: 1rem;
    position: relative;

    :before {
        content: "›";
        position: absolute;
        left: 0;
        top: -2px;
    }

    & + & {
        margin-top: 1rem;
    }
`;

const HostStyle = styled.em`
    font-size: 1.2rem;
`;

const SlidesOutLink = styled(OutLink)`
    font-size: 1.2rem;
`;

const Appearance = ({ name, url, date, host, location, slidesUrl }) => {
    return (
        <AppearanceStyle>
            <Box>
                <AppearanceOutLink href={url}>{name}</AppearanceOutLink>
                <DateStyle>
                    {moment(date)
                        .format("DD MMM")
                        .valueOf()}
                </DateStyle>
            </Box>

            <div>
                <SlidesOutLink href={slidesUrl}>[Slides]</SlidesOutLink>
            </div>

            <HostStyle>
                {host} ({location})
            </HostStyle>
        </AppearanceStyle>
    );
};

export default Appearance;
