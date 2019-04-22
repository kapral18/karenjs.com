/// <reference types="styled-components/cssprop" />
import React, { FC } from "react";
import { graphql, Link } from "gatsby";
import { DeepNonNullable } from "utility-types";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import PersonInfoCard from "../components/PersonInfoCard";
import Post from "../components/Post";
import { IndexPageQueryQuery } from "../types/generated";

export const query = graphql`
    query IndexPageQuery {
        site {
            siteMetadata {
                title
            }
        }

        posts: allMarkdownRemark(
            filter: { fields: { slug: { glob: "/blog/**" } } }
            limit: 3
            sort: { fields: [frontmatter___date], order: DESC }
        ) {
            totalCount
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
    data: DeepNonNullable<IndexPageQueryQuery>;
}

const IndexPage: FC<Props> = ({ data }) => {
    const { edges: posts } = data.posts;
    return (
        <Layout>
            <SEO title="Home" />
            <PersonInfoCard />
            <main>
                {posts.map(({ node }) => {
                    return <Post key={node.id} node={node} />;
                })}
                {data.posts.totalCount > 3 && (
                    <Link to="/blog/">More articles...</Link>
                )}
            </main>
        </Layout>
    );
};

export default IndexPage;
