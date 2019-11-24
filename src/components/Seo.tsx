import React, { ReactElement } from "react";
import Helmet from "react-helmet";
import urlJoin from "url-join";
import { graphql, useStaticQuery } from "gatsby";
import { SeoQueryQuery, MarkdownRemarkFrontmatter } from "../types/generated";
import isObjectOfType from "../services/isObjectOfType";
import isString from "lodash/isString";
import GenericError from "./GenericError";

const baseTags = ["javascript", "react", "gatsby", "blog"];

const defaultProps = {
    lang: "en",
    keywords: [] as MarkdownRemarkFrontmatter["tags"],
    slug: "/"
};

type Props = {
    description?: string;
    title: string;
    article?: MarkdownRemarkFrontmatter;
} & typeof defaultProps;

const Seo = ({
    description,
    lang,
    slug,
    keywords,
    title,
    article
}: Props): ReactElement | null => {
    const data = useStaticQuery<SeoQueryQuery>(seoQuery);

    if (!data.site?.siteMetadata) {
        return (
            <GenericError
                missing={{ site: data.site }}
                message="<Seo />: props missing: data.site or data.site.siteMetadata"
            />
        );
    }

    const { siteMetadata } = data.site;

    const { siteUrl } = siteMetadata;

    if (!siteUrl) {
        return (
            <GenericError
                missing={{ siteUrl }}
                message="<Seo />: props missing: data.site.siteMetadata.siteUrl"
            />
        );
    }

    const metaDescription = description || siteMetadata.description;

    if (!metaDescription) {
        return (
            <GenericError
                missing={{ metaDescription }}
                message="<Seo />: props missing: data.site.siteMetadata.description or description"
            />
        );
    }

    if (!data.logo) {
        return (
            <GenericError
                missing={{ logo: data.logo }}
                message="<Seo />: props missing: data.logo"
            />
        );
    }

    const { internal, childImageSharp } = data.logo;

    if (!internal.mediaType || !childImageSharp?.resize?.src) {
        return (
            <GenericError
                missing={{ logo: data.logo }}
                message={`<Seo />: props missing:
                            data.logo.internal.mediaType or
                            data.logo.childImageSharp or
                            data.logo.childImageSharp.resize or
                            data.logo.childImageSharp.resize.src`}
            />
        );
    }

    const { mediaType: logoMediaType } = internal;
    const { src: logoUrl } = childImageSharp.resize;

    const articleFeaturedImageAlt =
        article?.featuredImageAlt ??
        "Karen Grigoryan. Front-end Engineer. <KarenJS /> (https://www.karenjs.com)";

    const articleFeaturedImageMediaType =
        article?.featuredImage?.internal.mediaType ?? logoMediaType;

    const articleImageUrl =
        article?.featuredImage?.childImageSharp?.resize?.src ?? logoUrl;

    const tags =
        keywords && isObjectOfType<string>(keywords, isString)
            ? baseTags.concat(keywords)
            : baseTags;

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
                content={urlJoin(siteUrl, articleImageUrl)}
            />

            <meta
                property="og:image:url"
                content={urlJoin(siteUrl, articleImageUrl)}
            />

            <meta
                property="og:image:secure_url"
                content={urlJoin(siteUrl, articleImageUrl)}
            />

            <meta
                property="og:image:type"
                content={articleFeaturedImageMediaType}
            />

            <meta property="og:image:alt" content={articleFeaturedImageAlt} />

            <meta property="og:url" content={urlJoin(siteUrl, slug)} />

            <meta property="og:site_name" content={decoratedTitle} />

            <meta name="twitter:card" content={"summary"} />

            <meta name="twitter:creator" content={"@kaafury"} />

            <meta name="twitter:title" content={decoratedTitle} />

            <meta name="twitter:url" content={urlJoin(siteUrl, slug)} />

            <meta
                property="twitter:image"
                content={urlJoin(siteUrl, articleImageUrl)}
            />

            <meta name="twitter:description" content={metaDescription} />

            {article && [
                <meta
                    key="article:author"
                    property="article:author"
                    content={urlJoin(siteUrl, "/about/")}
                />,
                ...tags.map((tag) => (
                    <meta property="article:tag" key={tag} content={tag} />
                ))
            ]}
        </Helmet>
    );
};

Seo.defaultProps = defaultProps;

export default Seo;

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
