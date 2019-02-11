import React, { Component } from "react";
import { graphql, Link } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import PersonInfoCard from "../components/PersonInfoCard";
import Post from "../components/Post";

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

class IndexPage extends Component {
    render() {
        const { data } = this.props;
        const posts = data.posts.edges;
        return (
            <Layout>
                <SEO title="Home" />
                <PersonInfoCard />
                <main>
                    {posts.map(({ node }) => {
                        return <Post key={node.id} node={node} />;
                    })}
                    {data.totalCount > 3 && (
                        <Link to="/blog/">More articles...</Link>
                    )}
                </main>
            </Layout>
        );
    }
}

export default IndexPage;
