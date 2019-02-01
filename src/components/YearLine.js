import React from "react";
import styled from "styled-components";

const Year = styled.h3`
    display: flex;
    align-items: center;

    :before,
    :after {
        content: "";
        flex: 1;
        height: 1px;
        background: #000;
    }

    :before {
        margin-right: 1rem;
    }

    :after {
        margin-left: 1rem;
    }
`;

const YearLine = ({ year }) => {
    return <Year>{year}</Year>;
};

export default YearLine;
