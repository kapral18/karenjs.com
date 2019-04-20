import React, { ReactElement } from "react";
import Helmet from "react-helmet";
import urlJoin from "url-join";
import { graphql, useStaticQuery } from "gatsby";
import { SeoQueryQuery, MarkdownRemarkFrontmatter } from "../types/generated";
import { DeepNonNullable } from "utility-types";

const seoQuery = graphql`
    query SeoQuery {
        site {
            siteMetadata {
                title
                siteUrl
                description
                author
            }
        }

        logo: file(absolutePath: { regex: "/logo\\\\.png/" }) {
            internal {
                mediaType
            }
            childImageSharp {
                resize {
                    src
                }
            }
        }
    }
`;

const baseTags = ["javascript", "react", "gatsby", "blog"];

const defaultProps = {
    lang: "en",
    keywords: [] as string[],
    slug: "/"
};

type Props = {
    description?: string;
    title: string;
    article?: DeepNonNullable<MarkdownRemarkFrontmatter>;
} & typeof defaultProps;

const SEO = ({
    description,
    lang,
    slug,
    keywords,
    title,
    article
}: Props): ReactElement => {
    const data = useStaticQuery<DeepNonNullable<SeoQueryQuery>>(seoQuery);

    const { siteMetadata } = data.site;

    const metaDescription = description || siteMetadata.description;

    const tags = baseTags.concat(keywords);

    const decoratedTitle = `${siteMetadata.title} - ${title}`;

    return (
        <Helmet
            htmlAttributes={{
                lang
            }}
            titleTemplate={`${siteMetadata.title} - %s`}
        >
            <title>{title}</title>

            <meta name="author" content="Karen Grigoryan" />
            <meta name="robots" content="index, follow" />
            <meta name="copyright" content="Karen Grigoryan" />
            <meta name="generator" content="Gatsby" />
            <meta name="description" content={metaDescription} />
            <meta name="keywords" content={tags.join(", ")} />

            <meta property="og:title" content={decoratedTitle} />

            <meta property="og:description" content={metaDescription} />

            <meta
                property="og:type"
                content={article ? "article" : "website"}
            />

            <meta
                property="og:image"
                content={urlJoin(
                    siteMetadata.siteUrl,
                    article
                        ? article.featuredImage.childImageSharp.resize.src
                        : data.logo.childImageSharp.resize.src
                )}
            />

            <meta
                property="og:image:url"
                content={urlJoin(
                    siteMetadata.siteUrl,
                    article
                        ? article.featuredImage.childImageSharp.resize.src
                        : data.logo.childImageSharp.resize.src
                )}
            />

            <meta
                property="og:image:secure_url"
                content={urlJoin(
                    siteMetadata.siteUrl,
                    article
                        ? article.featuredImage.childImageSharp.resize.src
                        : data.logo.childImageSharp.resize.src
                )}
            />

            <meta
                property="og:image:type"
                content={
                    article
                        ? article.featuredImage.internal.mediaType
                        : data.logo.internal.mediaType
                }
            />

            <meta
                property="og:image:alt"
                content={
                    article
                        ? article.featuredImageAlt
                        : "Karen Grigoryan. Front-end Engineer. <KarenJS /> (https://www.karenjs.com)"
                }
            />

            <meta
                property="og:url"
                content={urlJoin(siteMetadata.siteUrl, slug)}
            />

            <meta property="og:site_name" content={decoratedTitle} />

            <meta name="twitter:card" content={"summary"} />

            <meta name="twitter:creator" content={"@kaafury"} />

            <meta name="twitter:title" content={decoratedTitle} />

            <meta
                name="twitter:url"
                content={urlJoin(siteMetadata.siteUrl, slug)}
            />

            <meta
                property="twitter:image"
                content={urlJoin(
                    siteMetadata.siteUrl,
                    article
                        ? article.featuredImage.childImageSharp.resize.src
                        : data.logo.childImageSharp.resize.src
                )}
            />

            <meta name="twitter:description" content={metaDescription} />

            {article && [
                <meta
                    key="article:author"
                    property="article:author"
                    content={urlJoin(siteMetadata.siteUrl, "/about/")}
                />,
                ...tags.map((tag) => (
                    <meta property="article:tag" key={tag} content={tag} />
                ))
            ]}
        </Helmet>
    );
};

SEO.defaultProps = defaultProps;

export default SEO;
