import React, { FC } from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import { BlogPostBySlugQueryQuery } from "../../../types/generated/index";

export const LinkList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style: none;
    padding: 0px;
`;

const PrevNext: FC<{
    prev: BlogPostBySlugQueryQuery["markdownRemark"];
    next: BlogPostBySlugQueryQuery["markdownRemark"];
}> = ({ prev, next }) => {
    if (!prev && !next) {
        return null;
    }

    return (
        <LinkList>
            {prev &&
                prev.fields &&
                prev.fields.slug &&
                prev.frontmatter &&
                prev.frontmatter.title && (
                    <li>
                        <Link to={prev.fields.slug} rel="prev">
                            ← {prev.frontmatter.title}
                        </Link>
                    </li>
                )}

            {next &&
                next.fields &&
                next.fields.slug &&
                next.frontmatter &&
                next.frontmatter.title && (
                    <li css="margin-left: auto">
                        <Link to={next.fields.slug} rel="next">
                            {next.frontmatter.title} →
                        </Link>
                    </li>
                )}
        </LinkList>
    );
};

export default PrevNext;
