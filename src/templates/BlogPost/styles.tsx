import styled from "styled-components";
import { colors } from "../../services/settings";

export const LinkList = styled.ul`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    list-style: none;
    padding: 0px;
`;

export const Sub = styled.sub`
    ${colors.body}
`;
