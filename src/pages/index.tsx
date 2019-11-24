/// <reference types="styled-components/cssprop" />
import React, { FC } from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/Layout";
import Seo from "../components/Seo";
import PersonInfoCard from "../components/PersonInfoCard";
import Post from "../components/Post";
import { IndexPageQueryQuery } from "../types/generated";
import GenericError from "../components/GenericError";

interface Props {
    data: IndexPageQueryQuery;
}

const IndexPage: FC<Props> = ({ data }) => {
    const { posts, site } = data;

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
            <Seo title="Home" />
            <PersonInfoCard />
            <main>
                {posts.edges.map(({ node }) => {
                    return <Post key={node.id} siteUrl={siteUrl} node={node} />;
                })}
                {posts.totalCount > 3 && (
                    <Link data-test-id="more-articles" to="/blog/">
                        More articles...
                    </Link>
                )}
            </main>
        </Layout>
    );
};

export default IndexPage;

export const query = graphql`
    query IndexPageQuery {
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
            limit: 3
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            totalCount
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
