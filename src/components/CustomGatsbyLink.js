import styled from "styled-components";
import { Link } from "gatsby";
import { colors } from "../common/settings";

const CustomGatsbyLink = styled(Link)`
    text-decoration: none;
    color: ${colors.body};
    :hover {
        text-decoration: none;
        color: ${colors.linkHover};
    }
`;

export default CustomGatsbyLink;
