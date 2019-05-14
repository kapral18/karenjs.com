import React, { FC, ExoticComponent } from "react";
import styled, { StyledComponent } from "styled-components";
import OutLink from "./OutLink";
import { DeepNonNullable } from "utility-types";
import { Link, graphql, useStaticQuery } from "gatsby";
import Image from "gatsby-image";
import * as faBrands from "styled-icons/fa-brands";
import * as feather from "styled-icons/feather";
import { StyledIconProps } from "styled-icons/StyledIconBase/StyledIconBase";

import media from "../services/media";
import { colors } from "../services/settings";
import { PersonInfoQueryQuery } from "../types/generated";

const Container = styled.div`
    display: flex;
    align-items: center;
    margin: 5rem 0 1rem;

    ${media.tablet`
        flex-direction: column;
        text-align: center;
    `}
`;

const TextContainer = styled.div`
    margin-left: 3rem;

    ${media.tablet`
        margin-left: 0;
        margin-top: 1rem;
    `}
`;

const getSocialIcon = (
    iconClass: ExoticComponent<StyledIconProps>,
    title: SocialUrls
): StyledComponent<
    React.ExoticComponent<StyledIconProps>,
    any,
    {
        title: SocialUrls;
        size: string;
    },
    "title" | "size"
> => {
    return styled(iconClass).attrs({ title, size: "1.5rem" })`
        vertical-align: top;
        stroke: white;

        path {
            fill: ${colors.body};
        }
        :hover {
            transform: scale(1.2);
        }
        :hover path {
            stroke: ${colors.linkHover};
        }
    `;
};

const IconOutLink = styled(OutLink)`
    & + & {
        margin-left: 0.5rem;
    }

    img {
        vertical-align: top;
    }
`;

const SocialMediaLine = styled.div`
    display: flex;
    align-items: center;
    margin-top: 1rem;

    ${media.tablet`
        justify-content: center;
    `}
`;

const personInfoQuery = graphql`
    query PersonInfoQuery {
        avatar: file(absolutePath: { regex: "/maface[.]png/" }) {
            childImageSharp {
                fixed(width: 56, height: 56) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        site {
            siteMetadata {
                author
                socialUrls {
                    Twitter
                    StackOverflow
                    Github
                    Linkedin
                    Medium
                    Telegram
                    Youtube
                    Mail
                }
            }
        }
    }
`;

type QueryProps = DeepNonNullable<PersonInfoQueryQuery>;
type SocialUrls = keyof QueryProps["site"]["siteMetadata"]["socialUrls"];

const PersonInfoCard: FC = () => {
    const data = useStaticQuery<QueryProps>(personInfoQuery);

    const { author, socialUrls } = data.site.siteMetadata;
    return (
        <Container>
            <Link to="/about">
                <Image fixed={data.avatar.childImageSharp.fixed} alt={author} />
            </Link>
            <TextContainer>
                <SocialMediaLine>
                    {Object.entries(socialUrls).map(
                        ([socialMediaName, socialMediaUrl]) => {
                            return (
                                <IconOutLink
                                    key={socialMediaName}
                                    href={socialMediaUrl}
                                >
                                    {React.createElement(
                                        getSocialIcon(
                                            (faBrands as any)[
                                                socialMediaName
                                            ] ||
                                                (feather as any)[
                                                    socialMediaName
                                                ],
                                            socialMediaName as SocialUrls
                                        )
                                    )}
                                </IconOutLink>
                            );
                        }
                    )}
                    <IconOutLink href="https://dev.to/kapral18">
                        <img
                            src="https://d2fltix0v2e0sb.cloudfront.net/dev-badge.svg"
                            alt="Karen Grigoryan's DEV Profile"
                            height="15"
                            width="15"
                        />
                    </IconOutLink>
                </SocialMediaLine>
            </TextContainer>
        </Container>
    );
};

export default PersonInfoCard;
