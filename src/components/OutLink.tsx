import React, { FC, AnchorHTMLAttributes } from "react";
import styled from "styled-components";

const LinkContainer = styled.a`
    display: inline-block;
`;

const OutLink: FC<
    AnchorHTMLAttributes<HTMLAnchorElement> & {
        // temp hack for react type mismatch
        // in styled-components/@types/react vs normal @types/react
        defaultValue?: string | string[] | undefined;
    }
> = ({ children, ...props }) => (
    <LinkContainer target="_blank" rel="noopener noreferrer" {...props}>
        {children}
    </LinkContainer>
);

export default OutLink;
