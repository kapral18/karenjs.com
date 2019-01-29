import React from "react";
import styled from "styled-components";

const LinkContainer = styled.a`
    display: inline-block;
`;

const OutLink = ({ children, ...props }) => (
    <LinkContainer target="_blank" rel="noopener noreferrer" {...props}>
        {children}
    </LinkContainer>
);

export default OutLink;
