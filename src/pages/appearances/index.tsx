import React, { FC } from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import Appearance from "../../components/Appearance";
import YearLine from "../../components/YearLine";
import SEO from "../../components/Seo";
import { AppearancesPageQueryQuery } from "../../types/generated";
import { DeepNonNullable, $ElementType } from "utility-types";

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

interface Props {
    data: DeepNonNullable<AppearancesPageQueryQuery>;
}

type Edge = $ElementType<
    DeepNonNullable<AppearancesPageQueryQuery>["allAppearancesJson"]["edges"],
    number
>;

type EdgeNode = Edge["node"];

interface Year {
    id: string;
    year: string;
    isYearSum: boolean;
}

type ReduceProps = (EdgeNode | Year)[];

const isYearNode = (acc: ReduceProps, year: string): acc is Year[] => {
    return !acc.find((item) => (item as EdgeNode).date.includes(year));
};

const hasYear = (node: EdgeNode | Year): node is Year => {
    return Boolean((node as Year).year);
};

const AppearancesPage: FC<Props> = ({ data }) => {
    return (
        <Layout>
            <SEO
                title="Public Appearances"
                slug="/appearances/"
                keywords={["workshops", "conferences", "talks", "appearances"]}
            />
            <main>
                <article css="margin-top: 8rem;">
                    <h1>Public Appearances</h1>
                    {data.allAppearancesJson.edges
                        .reduce(
                            (acc, edge) => {
                                const year = edge.node.date.split("-")[0];

                                if (isYearNode(acc, year)) {
                                    acc.push({
                                        id: `year sum before ${edge.node.id}`,
                                        year,
                                        isYearSum: true
                                    });
                                }

                                acc.push({
                                    id: edge.node.id,
                                    name: edge.node.name,
                                    date: edge.node.date,
                                    url: edge.node.url,
                                    host: edge.node.host,
                                    location: edge.node.location,
                                    slidesUrl: edge.node.slidesUrl
                                });

                                return acc;
                            },
                            [] as ReduceProps
                        )
                        .map((edge) => {
                            if (hasYear(edge)) {
                                return (
                                    <YearLine key={edge.id} year={edge.year} />
                                );
                            }

                            return <Appearance key={edge.id} {...edge} />;
                        })}
                </article>
            </main>
        </Layout>
    );
};

export default AppearancesPage;
