import React, { Component } from "react";
import { graphql } from "gatsby";
import styled from "styled-components";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import PersonInfoCard from "../components/PersonInfoCard";
import Post from "../components/Post";
import media from "../utils/media";

const Title = styled.h3`
    font-weight: 800;
    font-size: 2.6rem;
    margin: 6rem 0 0;

    ${media.phone`
        margin: 3rem 0 0;
    `}
`;

export const pageQuery = graphql`
    query {
        site {
            siteMetadata {
                title
            }
        }
        allMarkdownRemark(
            limit: 3
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

class IndexPage extends Component {
    render() {
        const { data } = this.props;
        const posts = data.allMarkdownRemark.edges;
        return (
            <Layout>
                <SEO
                    title="Karen Grigoryan, Front-end Developer. Personal Website. About."
                    keywords={[
                        "javascript",
                        "gatsby",
                        "blog",
                        "react",
                        "about"
                    ]}
                />
                <PersonInfoCard />
                <main>
                    <Title>Latest Posts</Title>

                    {posts.map(({ node }) => {
                        return <Post key={node.id} node={node} />;
                    })}
                </main>
            </Layout>
        );
    }
}

export default IndexPage;
