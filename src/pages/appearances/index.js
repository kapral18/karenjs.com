import React from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import Appearance from "../../components/Appearance";
import YearLine from "../../components/YearLine";
import SEO from "../../components/Seo";
import Title from "../../components/Title";

export const query = graphql`
    query AppearancesPageQuery {
        site {
            siteMetadata {
                title
            }
        }
        allAppearancesJson(sort: { fields: [date], order: DESC }) {
            edges {
                node {
                    id
                    url
                    date
                    name
                    host
                    location
                    slidesUrl
                }
            }
        }
    }
`;

const AppearancesPage = ({ data }) => {
    return (
        <Layout>
            <SEO
                title="Public Appearances"
                slug="/appearances/"
                keywords={["workshops", "conferences", "talks", "appearances"]}
            />
            <main>
                <Title>Public Appearances</Title>
                {data.allAppearancesJson.edges
                    .reduce((acc, { node }) => {
                        const year = node.date.split("-")[0];

                        if (!acc.find(({ date }) => date.includes(year))) {
                            acc.push({
                                id: `year sum before ${node.id}`,
                                year,
                                isYearSum: true
                            });
                        }
                        acc.push({
                            id: node.id,
                            name: node.name,
                            date: node.date,
                            url: node.url,
                            host: node.host,
                            location: node.location,
                            slidesUrl: node.slidesUrl
                        });

                        return acc;
                    }, [])
                    .map(({ id: key, ...mNode }) => {
                        if (mNode.isYearSum) {
                            return <YearLine key={key} {...mNode} />;
                        }

                        return <Appearance key={key} {...mNode} />;
                    })}
            </main>
        </Layout>
    );
};

export default AppearancesPage;
