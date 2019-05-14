import React, { FC, ExoticComponent } from "react";
import styled, { StyledComponent } from "styled-components";
import OutLink from "../OutLink";
import { DeepNonNullable } from "utility-types";
import { Link, graphql, useStaticQuery } from "gatsby";
import Image from "gatsby-image";
import * as faBrands from "styled-icons/fa-brands";
import * as feather from "styled-icons/feather";
import { StyledIconProps } from "styled-icons/StyledIconBase/StyledIconBase";

import { colors } from "../../services/settings";
import { PersonInfoQueryQuery } from "../../types/generated";
import DevToIcon from "./assets/devto.inline.svg";

type QueryProps = DeepNonNullable<PersonInfoQueryQuery>;
type SocialUrls = keyof QueryProps["site"]["siteMetadata"]["socialUrls"];

const Container = styled.div`
    text-align: center;
    margin: 5rem 0 1rem;
`;

const TextContainer = styled.div`
    margin-top: 1rem;
`;

const getSocialIcon = (
    iconClass: ExoticComponent<StyledIconProps>,
    title: SocialUrls
): StyledComponent<
    React.ExoticComponent<StyledIconProps>,
    any,
    {
        title: SocialUrls;
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

const SocialMediaLine = styled.div`
    text-align: center;
    margin-top: 1rem;
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
                    DevTo
                }
            }
        }
    }
`;

const PersonInfoCard: FC = () => {
    const data = useStaticQuery<QueryProps>(personInfoQuery);

    const { author, socialUrls } = data.site.siteMetadata;
    return (
        <Container>
            <Link to="/about">
                <Image
                    fixed={data.avatar.childImageSharp.fixed}
                    title={author}
                    alt={author}
                />
            </Link>
            <TextContainer>
                <SocialMediaLine>
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
                                            socialMediaName as SocialUrls
                                        )
                                    )}
                                </IconOutLink>
                            );
                        }
                    )}
                </SocialMediaLine>
            </TextContainer>
        </Container>
    );
};

export default PersonInfoCard;
