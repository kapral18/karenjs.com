/* eslint-disable @typescript-eslint/camelcase */
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
            Youtube: "https://www.youtube.com/kapral18"
        }
    },
    plugins: [
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
                trackingId: process.env.GA_ID || "",
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
