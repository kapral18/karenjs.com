const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

const BASE_TEMPLATE = "BlogPost";
const TEMPLATES_DIR_PATH = path.resolve("./src/templates");
const BASE_TEMPLATE_PATH = path.join(
    TEMPLATES_DIR_PATH,
    `${BASE_TEMPLATE}/index.tsx`
);

const getTemplate = (template) => {
    if (template) {
        return path.join(TEMPLATES_DIR_PATH, `${template}/index.tsx`);
    }
    return BASE_TEMPLATE_PATH;
};

exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions;

    const result = await graphql(`
        {
            posts: allMarkdownRemark(
                filter: { fields: { slug: { glob: "/blog/**" } } }
                sort: { fields: [frontmatter___date], order: DESC }
                limit: 1000
            ) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                        }
                    }
                }
            }
            other: allMarkdownRemark(
                filter: { fields: { slug: { glob: "!/blog/**" } } }
            ) {
                edges {
                    node {
                        fields {
                            slug
                        }
                        frontmatter {
                            title
                            template
                        }
                    }
                }
            }
        }
    `);

    if (result.errors) {
        process.exit(1);
    }

    const { posts, other } = result.data;

    posts.edges.forEach(({ node }, index, allPosts) => {
        const prev =
            index === allPosts.length - 1 ? null : allPosts[index + 1].node;
        const next = index === 0 ? null : allPosts[index - 1].node;

        createPage({
            path: node.fields.slug,
            component: getTemplate(),
            context: {
                slug: node.fields.slug,
                prev,
                next
            }
        });
    });

    other.edges.forEach(({ node }) => {
        createPage({
            path: node.fields.slug,
            component: getTemplate(node.frontmatter.template),
            context: {
                slug: node.fields.slug
            }
        });
    });
};

exports.onCreateNode = ({ node, actions, getNode }) => {
    if (node.internal.type !== "MarkdownRemark") return;

    const { permalink } = node.frontmatter;

    const slug = permalink || createFilePath({ node, getNode });

    actions.createNodeField({
        node,
        name: "slug",
        value: slug
    });
};

exports.onCreateWebpackConfig = ({ getConfig, stage }) => {
    const config = getConfig();
    if (stage.startsWith("develop") && config.resolve) {
        config.resolve.alias = {
            ...config.resolve.alias,
            "react-dom": "@hot-loader/react-dom"
        };
    }
};
