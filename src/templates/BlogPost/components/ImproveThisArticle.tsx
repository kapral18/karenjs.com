import React, { FC } from "react";
import { Github } from "@styled-icons/boxicons-logos";
import styled from "styled-components";

import OutLink from "../../../components/OutLink";

interface Props {
    slug: string;
}

const StyledOutLink = styled(OutLink)`
    margin-left: auto;
    align-self: top;
    font-size: 1.4rem;

    svg {
        margin: 0 5px;
        margin-top: -3px;
    }
`;

const ImproveThisArticle: FC<Props> = ({ slug }) => (
    <StyledOutLink
        href={
            "https://github.com/kapral18/karenjs.com/edit/master/src/pages" +
            slug +
            "index.md"
        }
    >
        <Github size="1.2em" title="Improve this article" />
        Improve This Article
        <Github size="1.2em" title="Improve this article" />
    </StyledOutLink>
);

export default ImproveThisArticle;
