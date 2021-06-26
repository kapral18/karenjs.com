import React, { FC } from "react";
import styled from "styled-components";
import { Link, graphql, useStaticQuery } from "gatsby";
import Image, { FixedObject } from "gatsby-image";
import { DeepNonNullable } from "utility-types";

import { PersonInfoQueryQuery } from "../../types/generated";
import SocialMediaLine from "./components/SocialMediaLine";
import isString from "lodash/isString";
import { SocialUrls } from "./types";
import isObjectOfType from "../../services/isObjectOfType";
import GenericError from "../GenericError";

const Wrapper = styled.div`
    text-align: center;
    margin: 5rem 0 1rem;
`;

const TextContainer = styled.div`
    margin-top: 1rem;
`;

const PersonInfoCard: FC = () => {
    const data = useStaticQuery<PersonInfoQueryQuery>(personInfoQuery);

    if (!data.site?.siteMetadata) {
        return (
            <GenericError
                missing={{ site: data.site }}
                message={`<PersonInfoCard />: props missing:
                            data.site or
                            data.site.siteMetadata`}
            />
        );
    }

    const { author, socialUrls } = data.site.siteMetadata;

    if (!author || !socialUrls) {
        return (
            <GenericError
                missing={{ author, socialUrls }}
                message={`<PersonInfoCard />: props missing:
                            data.site.siteMetadata.author or
                            data.site.siteMetadata.socialUrls`}
            />
        );
    }

    return (
        <Wrapper>
            {data.avatar?.childImageSharp?.fixed && (
                <Link to="/about">
                    <Image
                        fixed={data.avatar.childImageSharp.fixed as FixedObject}
                        title={author}
                        alt={author}
                    />
                </Link>
            )}
            {isObjectOfType<DeepNonNullable<SocialUrls>>(
                socialUrls,
                isString
            ) && (
                <TextContainer>
                    <SocialMediaLine socialUrls={socialUrls} />
                </TextContainer>
            )}
        </Wrapper>
    );
};

export default PersonInfoCard;

const personInfoQuery = graphql`
    query PersonInfoQuery {
        avatar: file(absolutePath: { regex: "/avatar_fresh[.]jpg/" }) {
            childImageSharp {
                fixed(width: 120, height: 120) {
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
                    Telegram
                    Youtube
                    Mail
                    DevTo
                }
            }
        }
    }
`;
