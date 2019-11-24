import styled from "styled-components";
import { Link } from "gatsby";

const CustomGatsbyLink = styled(Link)`
    text-decoration: none;

    :hover {
        text-decoration: none;
    }

    :focus {
        text-decoration: none;
    }
`;

export default CustomGatsbyLink;
