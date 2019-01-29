import styled from "styled-components";
import media from "../utils/media";

const PageTitle = styled.h3`
    font-weight: 800;
    font-size: 2.6rem;
    margin: 6rem 0 0;

    ${media.phone`
        margin: 3rem 0 0;
    `}
`;

export default PageTitle;
