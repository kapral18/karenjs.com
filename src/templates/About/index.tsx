import React, { FC } from "react";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Container, Header, Title, Contents } from "../styles";
import { AboutBySlugQueryQuery } from "../../types/generated";
import { DeepNonNullable } from "utility-types";

export const query = graphql`
    query AboutBySlugQuery($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
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

interface Props {
    data: DeepNonNullable<AboutBySlugQueryQuery>;
}

const AboutTemplate: FC<Props> = ({ data }) => {
    const { frontmatter, excerpt, html, fields } = data.markdownRemark;

    return (
        <Layout>
            <SEO
                title={frontmatter.title}
                slug={fields.slug}
                description={excerpt}
            />
            <Container>
                <Header>
                    <Title>{frontmatter.title}</Title>
                    <sub>
                        <span>
                            <span role="img" aria-label="Reading time">
                                🕥
                            </span>
                            {fields.readingTime.text}
                        </span>
                    </sub>
                </Header>
                <Contents dangerouslySetInnerHTML={{ __html: html }} />
            </Container>
        </Layout>
    );
};

export default AboutTemplate;
