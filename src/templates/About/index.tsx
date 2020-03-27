import React, { FC } from "react";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import Seo from "../../components/Seo";

import GenericError from "../../components/GenericError";
import { AboutBySlugQueryQuery } from "../../types/generated";
import {
    Container as ContainerStyles,
    Header as HeaderStyles,
    Title as TitleStyles,
    Contents as ContentsStyles,
} from "../styles";

interface Props {
    data: AboutBySlugQueryQuery;
}

const AboutTemplate: FC<Props> = ({ data }) => {
    if (!data.markdownRemark) {
        return (
            <GenericError
                missing={{ markdownRemark: data.markdownRemark }}
                message="<AboutTemplate />: props missing: data.markdownRemark"
            />
        );
    }

    const { frontmatter, excerpt, html, fields } = data.markdownRemark;

    if (!frontmatter || !excerpt || !html || !fields) {
        return (
            <GenericError
                missing={{ frontmatter, excerpt, html, fields }}
                message={`<AboutTemplate />: props missing:
                                        data.markdownRemark.frontmatter or
                                        data.markdownRemark.excerpt or
                                        data.markdownRemark.html or
                                        data.markdownRemark.fields`}
            />
        );
    }

    if (!frontmatter.title || !fields.slug || !fields.readingTime) {
        return (
            <GenericError
                missing={{
                    title: frontmatter.title,
                    slug: fields.slug,
                    readingTime: fields.readingTime,
                }}
                message={`<AboutTemplate />: props missing:
                                        data.markdownRemark.frontmatter.title or
                                        data.markdownRemark.fields.slug or
                                        data.markdownRemark.fields.readingTime`}
            />
        );
    }

    return (
        <Layout>
            <Seo
                title={frontmatter.title}
                slug={fields.slug}
                description={excerpt}
            />
            <ContainerStyles>
                <HeaderStyles>
                    <TitleStyles>{frontmatter.title}</TitleStyles>
                    <sub>
                        <span>
                            <span role="img" aria-label="Reading time">
                                🕥
                            </span>
                            {fields.readingTime.text}
                        </span>
                    </sub>
                </HeaderStyles>
                <ContentsStyles dangerouslySetInnerHTML={{ __html: html }} />
            </ContainerStyles>
        </Layout>
    );
};

export default AboutTemplate;

export const query = graphql`
    query AboutBySlugQuery($slug: String!) {
        markdownRemark(
            fields: { slug: { eq: $slug } }
            frontmatter: { draft: { ne: true } }
        ) {
            id
            html
            excerpt
            fields {
                slug
                readingTime {
                    text
                }
            }
            frontmatter {
                title
            }
        }
    }
`;
