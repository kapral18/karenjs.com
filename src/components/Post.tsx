import React, { FC } from "react";
import styled from "styled-components";
import { DeepNonNullable, $ElementType } from "utility-types";

import CustomGatsbyLink from "./CustomGatsbyLink";
import media from "../services/media";
import { BlogPostsPageQueryQuery } from "../types/generated";

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

type Props = $ElementType<
    DeepNonNullable<BlogPostsPageQueryQuery>["posts"]["edges"],
    number
>;

const Post: FC<Props> = ({ node }) => (
    <CustomGatsbyLink to={node.fields.slug}>
        <Container>
            <Title>{node.frontmatter.title}</Title>
            <sub>
                <span>on {node.frontmatter.date}</span>
                <span>&nbsp; - &nbsp;</span>
                <span>{node.fields.readingTime.text}</span>
            </sub>
            <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
        </Container>
    </CustomGatsbyLink>
);

export default Post;
