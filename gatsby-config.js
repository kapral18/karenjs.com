/* eslint-disable @typescript-eslint/camelcase */
require("dotenv").config();

module.exports = {
    siteMetadata: {
        title: "KarenJS",
        siteUrl: "https://www.karenjs.com",
        description:
            "Personal website and blog on JavaScript, React and related.. by Karen Grigoryan, Front-end Engineer.",
        author: "Karen Grigoryan",
        socialUrls: {
            Mail: "mailto:hey@karenjs.com",
            StackOverflow:
                "https://stackoverflow.com/users/2998898/karen-grigoryan?tab=profile",
            Linkedin: "https://www.linkedin.com/in/kapral18/",
            Twitter: "https://twitter.com/kaafury",
            Telegram: "https://t.me/kapral18",
            Github: "https://github.com/kapral18",
            Medium: "https://medium.com/@karengrigoryan",
            Youtube: "https://www.youtube.com/kapral18",
            DevTo: "https://dev.to/kapral18"
        }
    },
    plugins: [
        "gatsby-plugin-lodash",
        "gatsby-plugin-netlify",
        "gatsby-plugin-typescript",
        {
            resolve: "gatsby-plugin-eslint",
            options: {
                test: /\.tsx?$/,
                exclude: /(node_modules|.cache|public)/,
                stages: ["develop"],
                options: {
                    emitWarning: true,
                    failOnError: false
                }
            }
        },
        {
            resolve: "gatsby-plugin-react-svg",
            options: {
                rule: {
                    include: /\.inline\.svg$/
                }
            }
        },
        "gatsby-plugin-styled-components",
        "gatsby-plugin-react-helmet",
        "gatsby-transformer-json",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: `${__dirname}/src/pages/`,
                ignore: ["**/.*"]
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images/`,
                ignore: ["**/.*"]
            }
        },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    "gatsby-remark-emoji-unicode",
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 590,
                            showCaptions: true
                        }
                    },
                    {
                        resolve: "gatsby-remark-better-embed-video",
                        options: {
                            width: 800,
                            ratio: 1.77, // Optional: Defaults to 16/9 = 1.77.
                            height: 400, // Optional: Overrides optional.ratio.
                            related: false, // Optional: Will remove related videos from the end of an embedded YouTube video.
                            noIframeBorder: true, // Optional: Disable insertion of <style> border: 0.
                            showInfo: false // Optional: Hides video title and player actions.
                        }
                    },
                    {
                        resolve: "gatsby-remark-responsive-iframe",
                        options: {
                            wrapperStyle: "margin-bottom: 1.0725rem"
                        }
                    },
                    "gatsby-remark-external-links",
                    {
                        resolve: `gatsby-remark-autolink-headers`,
                        options: {
                            offsetY: 80,
                            className: "linked-h-tag"
                        }
                    },
                    {
                        resolve: "gatsby-remark-prismjs",
                        options: {
                            aliases: { sh: "bash", js: "javascript" },
                            showLineNumbers: true
                        }
                    },
                    "gatsby-remark-copy-linked-files",
                    "gatsby-remark-smartypants",
                    "gatsby-remark-reading-time",
                    {
                        resolve: "gatsby-plugin-page-progress",
                        options: {
                            includePaths: [{ regex: "^/blog/" }],
                            height: 3,
                            prependToBody: false,
                            color: "#e2777a"
                        }
                    },
                    {
                        resolve: "gatsby-plugin-nprogress",
                        options: {
                            color: "#e2777a",
                            showSpinner: false
                        }
                    }
                ]
            }
        },
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        "gatsby-plugin-catch-links",
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                trackingId: process.env.GOOGLE_ANALYTICS_ID || "",
                head: false,
                anonymize: true,
                respectDNT: true
            }
        },
        {
            resolve: "gatsby-plugin-nprogress",
            options: {
                color: "tomato",
                showSpinner: false
            }
        },
        {
            resolve: `gatsby-plugin-feed`,
            options: {
                query: `
                    {
                        site {
                            siteMetadata {
                                title
                                description
                                siteUrl
                                site_url: siteUrl
                            }
                        }
                    }
                `,
                feeds: [
                    {
                        serialize: ({ query: { site, allMarkdownRemark } }) => {
                            return allMarkdownRemark.edges.map((edge) => {
                                const siteUrl = site.siteMetadata.siteUrl;
                                const postText = `
                                    <div style="margin-top=55px; font-style: italic;">(This is an article posted to my blog at karenjs.com. You can read it online by <a href="${siteUrl +
                                        edge.node.fields
                                            .slug}">clicking here</a>.)</div>
                                `;

                                let html = edge.node.html;
                                // Hacky workaround for https://github.com/gaearon/overreacted.io/issues/65
                                html = html
                                    .replace(/href="\//g, `href="${siteUrl}/`)
                                    .replace(/src="\//g, `src="${siteUrl}/`)
                                    .replace(
                                        /"\/static\//g,
                                        `"${siteUrl}/static/`
                                    )
                                    .replace(
                                        /,\s*\/static\//g,
                                        `,${siteUrl}/static/`
                                    );

                                return Object.assign(
                                    {},
                                    edge.node.frontmatter,
                                    {
                                        description:
                                            edge.node.frontmatter.spoiler,
                                        date: edge.node.frontmatter.date,
                                        url:
                                            site.siteMetadata.siteUrl +
                                            edge.node.fields.slug,
                                        guid:
                                            site.siteMetadata.siteUrl +
                                            edge.node.fields.slug,
                                        custom_elements: [
                                            {
                                                "content:encoded":
                                                    html + postText
                                            }
                                        ]
                                    }
                                );
                            });
                        },
                        query: `
                            {
                                allMarkdownRemark(
                                filter: { fields: { slug: { glob: "/blog/**" } } frontmatter: { draft: { ne: true } } }
                                sort: { order: DESC, fields: [ frontmatter___date ] }
                                limit: 1000,
                                ) {
                                    edges {
                                        node {
                                            excerpt
                                            html
                                            fields {
                                                slug
                                            }
                                            frontmatter {
                                                title
                                                date
                                            }
                                        }
                                    }
                                }
                            }
                        `,
                        output: `/rss.xml`,
                        title: "Karen Grigoryan's KarenJS Blog RSS Feed"
                    }
                ]
            }
        },
        "gatsby-plugin-sitemap",
        "gatsby-plugin-robots-txt",
        {
            resolve: "gatsby-plugin-manifest",
            options: {
                name: "KarenJS Karen Grigoryan's Personal Website",
                short_name: "KarenJS",
                start_url: "/",
                background_color: "#fff",
                theme_color: "#fff",
                display: "minimal-ui",
                icon: "src/images/logo.png"
            }
        },
        "gatsby-plugin-offline"
    ]
};
