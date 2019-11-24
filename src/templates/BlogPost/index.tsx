import React, { ComponentPropsWithoutRef, FC } from "react";
import Disqus from "disqus-react";
import { graphql, Link } from "gatsby";
import Image, { FluidObject } from "gatsby-image";
import styled from "styled-components";
import { Comment } from "@styled-icons/boxicons-solid";
import isString from "lodash/isString";

import Layout from "../../components/Layout";
import Seo from "../../components/Seo";
import Share from "../../components/Share";
import {
    Container as ContainerStyles,
    Header as HeaderStyles,
    Title as TitleStyles,
    Contents as ContentsStyles
} from "../styles";
import {
    BlogPostBySlugQueryQuery,
    BlogPostBySlugQueryQueryVariables
} from "../../types/generated";
import { colors } from "../../services/settings";
import PrevNext from "./components/PrevNext";
import isObjectOfType from "../../services/isObjectOfType";
import GenericError from "../../components/GenericError";
import ScrollToTop from "../../components/ScrollToTop";
import EditThisArticle from "./components/EditThisArticle";
import Box from "../../common/Box";

type DiscussConfig = (opts: {
    identifier: string;
    title: string;
    url: string;
}) => ComponentPropsWithoutRef<typeof Disqus.DiscussionEmbed>;

export const disqusConfig: DiscussConfig = ({ identifier, title, url }) => ({
    shortname: process.env.GATSBY_DISQUS_NAME,
    config: { identifier, title, url }
});

const TableOfContents = styled(ContentsStyles)`
    :before {
        content: "Table of contents: ";
        text-align: center;
    }
    ul {
        list-style: none;
        padding: 0;

        li {
            :before {
                content: "- ";
            }
        }
    }
`;

export const Sub = styled.sub`
    ${colors.body}
`;

interface Props {
    data: BlogPostBySlugQueryQuery;
    pageContext: {
        slug: BlogPostBySlugQueryQueryVariables["slug"];
        prev: BlogPostBySlugQueryQuery["markdownRemark"];
        next: BlogPostBySlugQueryQuery["markdownRemark"];
    };
}

const BlogPostTemplate: FC<Props> = ({ data, pageContext }) => {
    if (!data.markdownRemark) {
        return (
            <GenericError
                missing={{ markdownRemark: data.markdownRemark }}
                message={`<BlogPost />: props missing:
                                        data.markdownRemark`}
            />
        );
    }

    const {
        id,
        frontmatter,
        excerpt,
        html,
        fields,
        tableOfContents
    } = data.markdownRemark;
    if (!frontmatter || !excerpt || !html || !fields) {
        return (
            <GenericError
                missing={{ frontmatter, excerpt, html, fields }}
                message={`<BlogPost />: props missing:
                                        data.markdownRemark.frontmatter or
                                        data.markdownRemark.excerpt or
                                        data.markdownRemark.html or
                                        data.markdownRemark.fields or`}
            />
        );
    }

    if (!data.site?.siteMetadata) {
        return (
            <GenericError
                missing={{ site: data.site }}
                message={`<BlogPost />: props missing:
                                        data.site or
                                        data.site.siteMetadata`}
            />
        );
    }

    const { author, siteUrl } = data.site.siteMetadata;

    if (!author || !siteUrl) {
        return (
            <GenericError
                missing={{ author, siteUrl }}
                message={`<BlogPost />: props missing:
                                        data.site.siteMetadata.author or
                                        data.site.siteMetadata.siteUrl`}
            />
        );
    }

    if (
        !frontmatter.title ||
        !frontmatter.tags ||
        !frontmatter.featuredImage ||
        !frontmatter.featuredImage.childImageSharp ||
        !frontmatter.featuredImageAlt
    ) {
        return (
            <GenericError
                missing={{
                    title: frontmatter.title,
                    tags: frontmatter.tags,
                    featuredImage: frontmatter.featuredImage,
                    featuredImageAlt: frontmatter.featuredImageAlt
                }}
                message={`<BlogPost />: props missing:
                                        data.markdownRemark.frontmatter.title or
                                        data.markdownRemark.frontmatter.tags or
                                        data.markdownRemark.frontmatter.featuredImage or
                                        data.markdownRemark.frontmatter.featuredImage.childImageSharp or
                                        data.markdownRemark.frontmatter.featuredImageAlt`}
            />
        );
    }

    const {
        fluid: featuredImageFluid
    } = frontmatter.featuredImage.childImageSharp;

    if (
        !featuredImageFluid?.base64 ||
        !featuredImageFluid?.aspectRatio ||
        !featuredImageFluid?.sizes ||
        !featuredImageFluid?.src ||
        !featuredImageFluid?.srcSet
    ) {
        return (
            <GenericError
                missing={{ featuredImageFluid }}
                message={`<BlogPost />: props missing:
                            data.markdownRemark.frontmatter.featuredImage.childImageSharp.fluid or
                            data.markdownRemark.frontmatter.featuredImage.childImageSharp.fluid.base64 or
                            data.markdownRemark.frontmatter.featuredImage.childImageSharp.fluid.aspectRatio or
                            data.markdownRemark.frontmatter.featuredImage.childImageSharp.fluid.sizes or
                            data.markdownRemark.frontmatter.featuredImage.childImageSharp.fluid.src or
                            data.markdownRemark.frontmatter.featuredImage.childImageSharp.fluid.srcset`}
            />
        );
    }

    if (!fields.slug) {
        return (
            <GenericError
                missing={{ slug: fields.slug }}
                message="<BlogPost />: props missing: data.markdownRemark.fields.slug"
            />
        );
    }

    const { prev, next } = pageContext;

    return (
        <Layout>
            <Seo
                title={frontmatter.title}
                slug={fields.slug}
                description={excerpt}
                keywords={frontmatter.tags}
                article={frontmatter}
            />
            <ContainerStyles>
                <PrevNext prev={prev} next={next} />
                <HeaderStyles>
                    <TitleStyles>{frontmatter.title}</TitleStyles>
                    {frontmatter.rawDate && (
                        <Sub>
                            <time dateTime={frontmatter.rawDate}>
                                {frontmatter.date}
                            </time>
                            <span>&nbsp; - &nbsp;</span>
                            <span>
                                <span role="img" aria-label="Reading time">
                                    🕥
                                </span>
                                {fields &&
                                    fields.readingTime &&
                                    fields.readingTime.text}
                            </span>
                            <span>&nbsp; - &nbsp;</span>
                            <span>
                                <Comment size="1.2em" title="Comments" />
                                &nbsp;
                                <Link to={fields.slug + `#disqus_thread`}>
                                    <Disqus.CommentCount
                                        {...disqusConfig({
                                            identifier: id,
                                            url: siteUrl + fields.slug,
                                            title: frontmatter.title
                                        })}
                                    />
                                </Link>
                            </span>
                        </Sub>
                    )}
                </HeaderStyles>
                <Image
                    fluid={featuredImageFluid as FluidObject}
                    title={frontmatter.featuredImageAlt}
                    alt={frontmatter.featuredImageAlt}
                />

                {tableOfContents ? (
                    <TableOfContents
                        css="list-style-type: none"
                        dangerouslySetInnerHTML={{
                            __html: tableOfContents
                        }}
                    />
                ) : null}

                <ContentsStyles dangerouslySetInnerHTML={{ __html: html }} />

                <Box css="align-items: flex-start; padding: 2rem 0;">
                    {isObjectOfType<string[]>(frontmatter.tags, isString) && (
                        <Share
                            post={{
                                title: frontmatter.title,
                                excerpt,
                                author,
                                tags: frontmatter.tags
                            }}
                        />
                    )}
                    <EditThisArticle slug={fields.slug} />
                </Box>

                <PrevNext prev={prev} next={next} />

                <Disqus.DiscussionEmbed
                    {...disqusConfig({
                        identifier: id,
                        url: siteUrl + fields.slug,
                        title: frontmatter.title
                    })}
                />
                <ScrollToTop />
            </ContainerStyles>
        </Layout>
    );
};

export default BlogPostTemplate;

export const query = graphql`
    query BlogPostBySlugQuery($slug: String!) {
        site {
            siteMetadata {
                siteUrl
                author
            }
        }

        markdownRemark(
            fields: { slug: { eq: $slug } }
            frontmatter: { draft: { ne: true } }
        ) {
            id
            excerpt
            html
            tableOfContents
            fields {
                slug
                readingTime {
                    text
                }
            }
            frontmatter {
                title
                tags
                rawDate: date
                featuredImage {
                    internal {
                        mediaType
                    }
                    childImageSharp {
                        fluid {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
                featuredImageAlt
                date(formatString: "MMM DD, YYYY")
            }
        }
    }
`;
