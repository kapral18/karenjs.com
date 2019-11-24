import styled from "styled-components";
import { ArrowUp } from "@styled-icons/evil/ArrowUp";
import { colors } from "../../services/settings";

export const Arrow = styled(ArrowUp)`
    z-index: 1;
    border-radius: 50%;
    position: fixed;
    bottom: 2.5em;
    cursor: pointer;
    right: 1vw;

    :hover {
        background: ${colors.link};
        transform: scale(1.25);
        fill: #fff;
    }
`;
