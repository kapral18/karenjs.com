import React, { FC } from "react";
import { Pencil } from "@styled-icons/boxicons-solid";
import styled from "styled-components";

import OutLink from "../../../components/OutLink";

interface Props {
    slug: string;
}

const StyledOutLink = styled(OutLink)`
    margin-left: auto;
    align-self: start;
    font-size: 1.4rem;

    svg {
        margin: -3px 5px 0;
    }
`;

const EditThisArticle: FC<Props> = ({ slug }) => (
    <StyledOutLink
        href={
            "https://github.com/kapral18/karenjs.com/edit/master/src/pages" +
            slug +
            "index.md"
        }
    >
        <Pencil size="1.2em" title="Improve this article" />
        Edit This Article
    </StyledOutLink>
);

export default EditThisArticle;
