import React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";
import Post from "../../components/Post";
import Title from "../../components/Title";

export const query = graphql`
    query BlogPostsPageQuery {
        site {
            siteMetadata {
                title
            }
        }
        posts: allMarkdownRemark(
            filter: { fields: { slug: { glob: "/blog/**" } } }
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            edges {
                node {
                    id
                    excerpt(pruneLength: 160)
                    fields {
                        slug
                        readingTime {
                            text
                        }
                    }
                    frontmatter {
                        date(formatString: "MMMM DD, YYYY")
                        title
                    }
                }
            }
        }
    }
`;

const IndexPage = ({ data }) => {
    const { edges } = data.posts;
    return (
        <Layout>
            <SEO slug="/blog/" title="Blog Posts" />
            <main>
                <Title>All posts</Title>

                {edges.map(({ node }) => {
                    return <Post key={node.id} node={node} />;
                })}
            </main>
        </Layout>
    );
};

export default IndexPage;
