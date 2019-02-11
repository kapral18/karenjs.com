import React from "react";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import SEO from "../../components/Seo";

import { Container, Header, Title, Contents } from "../styles";

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

const AboutTemplate = ({ data }) => {
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
                        <span>🕥{fields.readingTime.text}</span>
                    </sub>
                </Header>
                <Contents dangerouslySetInnerHTML={{ __html: html }} />
            </Container>
        </Layout>
    );
};

export default AboutTemplate;
