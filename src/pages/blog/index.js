import React, { Component } from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import SEO from "../../components/Seo";
import Post from "../../components/Post";
import Title from "../../components/Title";

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
        const posts = data.allMarkdownRemark.edges;
        return (
            <Layout>
                <SEO title="All Posts" keywords={[`gatsby`, `blog`, `react`]} />
                <main>
                    <Title>All posts</Title>

                    {posts.map(({ node }) => {
                        return <Post key={node.id} node={node} />;
                    })}
                </main>
            </Layout>
        );
    }
}

export default IndexPage;
