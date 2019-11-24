import React, { FC } from "react";
import styled from "styled-components";
import { $ElementType } from "utility-types";

import GenericError from "../components/GenericError";
import { BlogPostsPageQueryQuery } from "../types/generated";
import media from "../services/media";
import CustomGatsbyLink from "./CustomGatsbyLink";
import { Comment } from "@styled-icons/boxicons-solid";
import Disqus from "disqus-react";
import { disqusConfig } from "../templates/BlogPost";

const Container = styled.div`
    padding: 1rem 0;
    margin: 1rem 0;

    &:first-child {
        margin-top: 0;
    }

    ${media.phone`
        margin: 0.5rem 0;
        padding: 0.4rem 0;
    `}
`;

const Title = styled.h4`
    margin-bottom: 0.2rem;
    font-size: 2.2rem;
`;

const CustomGatsbyLinkStyles = styled(CustomGatsbyLink)`
    color: currentColor;
`;

type Props = $ElementType<BlogPostsPageQueryQuery["posts"]["edges"], number> & {
    siteUrl: string;
};

const Post: FC<Props> = ({ node, siteUrl }) => {
    if (!node.id || !node.fields || !node.frontmatter || !node.excerpt) {
        return (
            <GenericError
                missing={{
                    id: node.id,
                    fields: node.fields,
                    frontmatter: node.frontmatter,
                    excerpt: node.excerpt
                }}
                message="<Post />: props missing: node.id or node.fields or node.frontmatter or node.excerpt"
            />
        );
    }

    const { id } = node;
    const { title, date } = node.frontmatter;

    if (!title || !date) {
        return (
            <GenericError
                missing={{ title, date }}
                message="<Post />: props missing: node.frontmatter.title or node.frontmatter.date"
            />
        );
    }

    const { slug, readingTime } = node.fields;

    if (!slug || !readingTime) {
        return (
            <GenericError
                missing={{ slug, readingTime }}
                message="<Post />: props missing: node.fields.slug or node.fields.readingTime"
            />
        );
    }

    return (
        <CustomGatsbyLinkStyles to={slug}>
            <Container>
                <Title>{title}</Title>
                <sub>
                    <span>on {date}</span>
                    <span>&nbsp; - &nbsp;</span>
                    <span>{readingTime.text}</span>
                    <span>&nbsp; - &nbsp;</span>
                    <span>
                        <Comment size="1.2em" title="Comments" />
                        &nbsp;
                        <Disqus.CommentCount
                            {...disqusConfig({
                                identifier: id,
                                url: siteUrl + slug,
                                title
                            })}
                        />
                    </span>
                </sub>
                <div dangerouslySetInnerHTML={{ __html: node.excerpt }} />
            </Container>
        </CustomGatsbyLinkStyles>
    );
};

export default Post;
