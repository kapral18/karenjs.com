import React, { FC } from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import Seo from "../../components/Seo";
import Post from "../../components/Post";
import { BlogPostsPageQueryQuery } from "../../types/generated";
import GenericError from "../../components/GenericError";

interface Props {
    data: BlogPostsPageQueryQuery;
}

const IndexPage: FC<Props> = ({ data }) => {
    const { posts, site } = data;
    const { edges } = posts;

    if (!site || !site.siteMetadata || !site.siteMetadata.siteUrl) {
        return (
            <GenericError
                missing={{ site }}
                message={`<IndexPage />: props missing:
                            site or site.siteMetadata or site.siteMetadata.siteUrl`}
            />
        );
    }
    const { siteUrl } = site.siteMetadata;

    return (
        <Layout>
            <Seo slug="/blog/" title="Blog Posts" />
            <main>
                <article css="margin-top: 8rem;">
                    {edges.map(({ node }) => {
                        return (
                            <Post key={node.id} siteUrl={siteUrl} node={node} />
                        );
                    })}
                </article>
            </main>
        </Layout>
    );
};

export default IndexPage;

export const query = graphql`
    query BlogPostsPageQuery {
        site {
            siteMetadata {
                title
                siteUrl
            }
        }
        posts: allMarkdownRemark(
            filter: {
                fields: { slug: { glob: "/blog/**" } }
                frontmatter: { draft: { ne: true } }
            }
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            edges {
                node {
                    id
                    excerpt(pruneLength: 300, format: HTML)
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
