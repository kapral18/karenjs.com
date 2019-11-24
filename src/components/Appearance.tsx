import React, { FC } from "react";
import moment from "moment";
import styled from "styled-components";
import { DeepNonNullable } from "utility-types";

import Box from "../common/Box";
import OutLink from "../components/OutLink";
import { AppearancesJson } from "../types/generated";
import { colors } from "../services/settings";

const AppearanceOutLink = styled(OutLink)`
    color: #000;
    text-decoration: none;

    :before {
        content: "›";
        position: absolute;
        left: 0;
        top: -2px;
    }

    :hover {
        color: ${colors.linkHover};
        text-decoration: none;
    }

    :focus {
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

type Props = DeepNonNullable<
    Pick<
        AppearancesJson,
        "name" | "url" | "date" | "host" | "location" | "slidesUrl"
    >
>;

const Appearance: FC<Props> = ({
    name,
    url,
    date,
    host,
    location,
    slidesUrl
}) => {
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
