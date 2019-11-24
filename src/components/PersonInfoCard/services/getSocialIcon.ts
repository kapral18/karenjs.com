import { ExoticComponent } from "react";
import styled, { StyledComponent } from "styled-components";
import { StyledIconProps } from "styled-icons/types";

import { SiteSiteMetadataSocialUrls } from "../../../types/generated";
import { colors } from "../../../services/settings";

export type SocialUrlNames = keyof SiteSiteMetadataSocialUrls;

const getSocialIcon = (
    iconClass: ExoticComponent<StyledIconProps>,
    title: SocialUrlNames
): StyledComponent<
    ExoticComponent<StyledIconProps>,
    any,
    {
        title: SocialUrlNames;
    },
    "title"
> => {
    return styled(iconClass).attrs({
        title
    })`
        vertical-align: top;
        stroke: white;
        transition: all 0.5s;
        width: 1.5rem;
        height: 1.5rem;

        path {
            fill: ${colors.body};
        }

        :hover {
            transform: scale(1.5);
            path {
                fill: ${colors.linkHover};
            }
        }
    `;
};

export default getSocialIcon;
