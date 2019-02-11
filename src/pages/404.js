import React from "react";
import styled from "styled-components";
import { Link } from "gatsby";

import Layout from "../components/Layout";
import SEO from "../components/Seo";

const Container = styled.div`
    text-align: center;
`;

const NotFoundPage = () => (
    <Layout>
        <SEO slug="/404/" title="Page Not Found" />
        <Container>
            <span
                css={`
                    font-size: 10rem;
                    margin: 20vmin 0;
                    display: block;
                `}
                role="img"
                aria-label="facepalm emoji"
            >
                😞
            </span>
            <h1>NOT FOUND</h1>
            <Link to="/">Return to main page</Link>
        </Container>
    </Layout>
);

export default NotFoundPage;
