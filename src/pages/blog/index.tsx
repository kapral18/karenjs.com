import { DeepNonNullable } from "utility-types";
import React, { FC } from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";
import Post from "../../components/Post";
import { BlogPostsPageQueryQuery } from "../../types/generated";

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

interface Props {
    data: DeepNonNullable<BlogPostsPageQueryQuery>;
}

const IndexPage: FC<Props> = ({ data }) => {
    const { edges } = data.posts;

    return (
        <Layout>
            <SEO slug="/blog/" title="Blog Posts" />
            <main>
                <article css="margin-top: 8rem;">
                    <h1>All posts</h1>

                    {edges.map(({ node }) => {
                        return <Post key={node.id} node={node} />;
                    })}
                </article>
            </main>
        </Layout>
    );
};

export default IndexPage;
