import styled from "styled-components";
import { Link } from "gatsby";
import { colors } from "../common/css/settings";

const CustomGatsbyLink = styled(Link)`
    text-decoration: none;
    color: ${colors.body};
    :hover {
        color: ${colors.linkHover};
    }
`;

export default CustomGatsbyLink;
