import React, { FC } from "react";
import styled from "styled-components";
import * as faBrands from "@styled-icons/fa-brands";
import * as feather from "@styled-icons/feather";

import { colors } from "../../../services/settings";
import OutLink from "../../OutLink";
import getSocialIcon, { SocialUrlNames } from "../services/getSocialIcon";
import DevToIcon from "../assets/devto.inline.svg";
import { DeepNonNullable } from "utility-types";
import { SocialUrls } from "../types";

const IconOutLink = styled(OutLink)`
    & + & {
        margin-left: 0.5rem;
    }

    img {
        transition: all 0.5s;
        display: inline-block;
        :hover {
            transform: scale(1.5);
            margin-left: 6px;
            path {
                fill: ${colors.linkHover};
            }
        }
        vertical-align: top;
    }
`;

const Wrapper = styled.div`
    text-align: center;
    margin-top: 1rem;
`;

interface Props {
    socialUrls: DeepNonNullable<SocialUrls>;
}

const SocialMediaLine: FC<Props> = ({ socialUrls }) => {
    return (
        <div>
            <Wrapper>
                {Object.entries(socialUrls).map(
                    ([socialMediaName, socialMediaUrl]) => {
                        const iconClass =
                            socialMediaName === "DevTo"
                                ? DevToIcon
                                : (faBrands as any)[socialMediaName] ||
                                  (feather as any)[socialMediaName];

                        return (
                            <IconOutLink
                                key={socialMediaName}
                                href={socialMediaUrl}
                            >
                                {React.createElement(
                                    getSocialIcon(
                                        iconClass,
                                        socialMediaName as SocialUrlNames
                                    )
                                )}
                            </IconOutLink>
                        );
                    }
                )}
            </Wrapper>
        </div>
    );
};

export default SocialMediaLine;
