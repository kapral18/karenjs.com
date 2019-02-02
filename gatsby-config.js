module.exports = {
    siteMetadata: {
        title: `<KarenJS />`,
        siteUrl: "https://www.karenjs.com",
        description:
            "Personal website and blog on javascript by Karen Grigoryan",
        author: "Karen Grigoryan",
        authorTagline: "Front-end Engineer from Amsterdam, The Netherlands",
        socialUrls: {
            Mail: "mailto:hey@karenjs.com",
            StackOverflow:
                "https://stackoverflow.com/users/2998898/karen-grigoryan?tab=profile",
            Linkedin: "https://www.linkedin.com/in/kapral18/",
            Twitter: "https://twitter.com/kaafury",
            Telegram: "https://t.me/kapral18",
            Github: "https://github.com/kapral18",
            Medium: "https://medium.com/@karengrigoryan",
            Youtube: "https://www.youtube.com/kapral18"
        }
    },
    plugins: [
        "gatsby-plugin-netlify",
        "gatsby-plugin-styled-components",
        "gatsby-plugin-react-helmet",
        "gatsby-transformer-json",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "images",
                path: `${__dirname}/src/images`
            }
        },
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "pages",
                path: `${__dirname}/src/pages`
            }
        },
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 590,
                            showCaptions: true
                        }
                    },
                    {
                        resolve: "gatsby-remark-responsive-iframe",
                        options: {
                            wrapperStyle: "margin-bottom: 1.0725rem"
                        }
                    },
                    "gatsby-remark-prismjs",
                    "gatsby-remark-copy-linked-files",
                    "gatsby-remark-smartypants",
                    "gatsby-remark-reading-time"
                ]
            }
        },
        "gatsby-transformer-sharp",
        "gatsby-plugin-sharp",
        "gatsby-plugin-catch-links",
        {
            resolve: "gatsby-plugin-google-analytics",
            options: {
                //trackingId: "ADD YOUR TRACKING ID HERE",
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
                icon: "src/images/maface.png"
            }
        },
        "gatsby-plugin-offline"
    ]
};
