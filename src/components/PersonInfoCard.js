import React from "react";
import styled from "styled-components";
import OutLink from "./OutLink";
import { StaticQuery, graphql } from "gatsby";
import Image from "gatsby-image";
import * as faBrands from "styled-icons/fa-brands";
import * as feather from "styled-icons/feather";

import media from "../utils/media";
import { colors } from "../common/css/settings";

const Container = styled.div`
    display: flex;
    align-items: center;
    margin: 5rem 0;

    ${media.tablet`
        flex-direction: column;
        text-align: center;
    `}
`;

const TextContainer = styled.div`
    margin-left: 3rem;

    ${media.tablet`
        margin-left: 0;
    `}
`;

const Name = styled.h3`
    font-size: 2.4rem;
    letter-spacing: 0.1rem;
    font-weight: 800;
    margin-bottom: 1rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-family: "system";
`;

const TagLine = styled.sub`
    font-weight: normal;
    font-size: 1.6rem;
    margin: 0;
    display: block;
`;

const getSocialIcon = (iconClass, title) => {
    return styled(iconClass).attrs({ title, size: "1.5rem" })`
        margin: 1.5rem 0;
        stroke: white;
        path {
            fill: ${colors.body};
        }
        :hover {
            transform: scale(1.2);
        }
        :hover path {
            fill: ${colors.linkHover};
        }
    `;
};

const IconOutLink = styled(OutLink)`
    & + & {
        margin-left: 0.5rem;
    }
`;

const SocialMediaLine = styled.div`
    display: flex;

    ${media.tablet`
        justify-content: center;
    `}
`;

const query = graphql`
    {
        avatar: file(absolutePath: { regex: "/maface.png/" }) {
            childImageSharp {
                fixed(width: 70, height: 70) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        site {
            siteMetadata {
                author
                authorTagline
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

const PersonInfoCard = () => (
    <StaticQuery
        query={query}
        render={(data) => {
            const {
                author,
                authorTagline,
                socialUrls
            } = data.site.siteMetadata;
            return (
                <Container>
                    <Image
                        css={`
                            border-radius: 50%;
                            border: 1px solid;
                        `}
                        fixed={data.avatar.childImageSharp.fixed}
                        alt={author}
                    />
                    <TextContainer>
                        <Name>{author}</Name>
                        <TagLine>{authorTagline}</TagLine>
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
                                                    faBrands[socialMediaName] ||
                                                        feather[
                                                            socialMediaName
                                                        ],
                                                    socialMediaName
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
        }}
    />
);

export default PersonInfoCard;
