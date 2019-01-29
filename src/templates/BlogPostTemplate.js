import React from "react";
import { Link, graphql } from "gatsby";
import styled from "styled-components";
import { colors } from "../common/css/settings";
import Layout from "../components/Layout";
import SEO from "../components/Seo";
import Share from "../components/Share";
import media from "../utils/media";

const Container = styled.article`
    margin-top: 8rem;

    ${media.phone`
        margin-top: 4rem;
    `}

    p {
        line-height: 1.5;
    }

    blockquote {
        margin-left: 0.25rem;
        font-size: 1.6rem;
        color: inherit;
        font-style: italic;
        border-left: 0.2rem solid rgb(0, 0, 0);
        padding-left: 1rem;
        margin: 1rem 0;
    }

    pre {
        margin-bottom: 2rem;
    }

    h3 {
        line-height: 1.13;
    }

    h2,
    h3,
    h4,
    h5,
    h6 {
        margin: 2rem 0 2rem;
    }

    hr {
        border: 0;
        border-top: 0.1rem solid #ccc;
        display: block;
        height: 1rem;
        padding: 0;
    }
`;

const Header = styled.header`
    ${media.tablet`
        text-align: center;
    `};
`;

const Title = styled.h1`
    margin-bottom: 1rem;
    font-size: 3rem;
`;

const LinkList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style: none;
    padding: 0px;
`;

export const pageQuery = graphql`
    query BlogPostBySlug($slug: String!) {
        site {
            siteMetadata {
                title
                author
            }
        }
        markdownRemark(fields: { slug: { eq: $slug } }) {
            id
            excerpt
            html
            fields {
                readingTime {
                    text
                }
            }
            frontmatter {
                title
                date(formatString: "MMMM DD, YYYY")
            }
        }
    }
`;

class BlogPostTemplate extends React.Component {
    render() {
        const post = this.props.data.markdownRemark;
        const siteTitle = this.props.data.site.siteMetadata.title;
        const author = this.props.data.site.siteMetadata.author;
        const { previous, next } = this.props.pageContext;

        return (
            <Layout location={this.props.location} title={siteTitle}>
                <SEO
                    title={post.frontmatter.title}
                    description={post.excerpt}
                />
                <Container>
                    <LinkList>
                        <li>
                            {previous && (
                                <Link to={previous.fields.slug} rel="prev">
                                    ← {previous.frontmatter.title}
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
                        <Title>{post.frontmatter.title}</Title>
                        <sub
                            css={`
                                ${colors.body}
                            `}
                        >
                            <span>Posted on {post.frontmatter.date}</span>
                            <span>&nbsp; - &nbsp;</span>
                            <span>{post.fields.readingTime.text}</span>
                        </sub>
                    </Header>
                    <div
                        css={`
                            margin: 5rem 0;
                        `}
                        dangerouslySetInnerHTML={{ __html: post.html }}
                    />
                    <Share
                        post={{
                            title: post.frontmatter.title,
                            excerpt: post.excerpt,
                            author: author
                        }}
                    />
                    <LinkList>
                        <li>
                            {previous && (
                                <Link to={previous.fields.slug} rel="prev">
                                    ← {previous.frontmatter.title}
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
    }
}

export default BlogPostTemplate;
