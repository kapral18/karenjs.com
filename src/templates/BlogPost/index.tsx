import { DeepNonNullable } from "utility-types";
import React, { FC } from "react";
import { Link, graphql } from "gatsby";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";
import Share from "../../components/Share";

import { Container, Header, Title, Contents } from "../styles";
import { LinkList, Sub } from "./styles";
import {
    BlogPostBySlugQueryQuery,
    BlogPostBySlugQueryQueryVariables
} from "../../types/generated";

export const query = graphql`
    query BlogPostBySlugQuery($slug: String!) {
        site {
            siteMetadata {
                author
            }
        }

        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt
            html
            fields {
                slug
                readingTime {
                    text
                }
            }
            frontmatter {
                title
                tags
                rawDate: date
                featuredImage {
                    internal {
                        mediaType
                    }
                    childImageSharp {
                        resize {
                            src
                        }
                    }
                }
                featuredImageAlt
                date(formatString: "MMM DD, YYYY")
            }
        }
    }
`;

interface Props {
    data: DeepNonNullable<BlogPostBySlugQueryQuery>;
    pageContext: {
        slug: BlogPostBySlugQueryQueryVariables["slug"];
        prev: DeepNonNullable<BlogPostBySlugQueryQuery["markdownRemark"]>;
        next: DeepNonNullable<BlogPostBySlugQueryQuery["markdownRemark"]>;
    };
}

const BlogPostTemplate: FC<Props> = ({ data, pageContext }) => {
    const { frontmatter, excerpt, html, fields } = data.markdownRemark;
    const { author } = data.site.siteMetadata;
    const { prev, next } = pageContext;

    return (
        <Layout>
            <SEO
                title={frontmatter.title}
                slug={fields.slug}
                description={excerpt}
                keywords={frontmatter.tags}
                article={frontmatter}
            />
            <Container>
                <LinkList>
                    <li>
                        {prev && (
                            <Link to={prev.fields.slug} rel="prev">
                                ← {prev.frontmatter.title}
                            </Link>
                        )}
                    </li>
                    <li>
                        {next && (
                            <Link to={next.fields.slug} rel="next">
                                {next.frontmatter.title} →
                            </Link>
                        )}
                    </li>
                </LinkList>
                <Header>
                    <Title>{frontmatter.title}</Title>
                    <Sub>
                        <time dateTime={frontmatter.rawDate}>
                            {frontmatter.date}
                        </time>
                        <span>&nbsp; - &nbsp;</span>
                        <span>
                            <span role="img" aria-label="Reading time">
                                🕥
                            </span>
                            {fields.readingTime.text}
                        </span>
                    </Sub>
                </Header>
                <Contents dangerouslySetInnerHTML={{ __html: html }} />
                <Share
                    post={{
                        title: frontmatter.title,
                        excerpt,
                        author,
                        tags: frontmatter.tags
                    }}
                />
                <LinkList>
                    <li>
                        {prev && (
                            <Link to={prev.fields.slug} rel="prev">
                                ← {prev.frontmatter.title}
                            </Link>
                        )}
                    </li>
                    <li>
                        {next && (
                            <Link to={next.fields.slug} rel="next">
                                {next.frontmatter.title} →
                            </Link>
                        )}
                    </li>
                </LinkList>
            </Container>
        </Layout>
    );
};

export default BlogPostTemplate;
