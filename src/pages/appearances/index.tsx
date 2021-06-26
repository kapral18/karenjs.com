import React, { FC, ReactElement } from "react";
import { graphql } from "gatsby";

import Layout from "../../components/Layout";
import Appearance from "../../components/Appearance";
import YearLine from "../../components/YearLine";
import Seo from "../../components/Seo";
import { AppearancesPageQueryQuery } from "../../types/generated";
import { $ElementType, DeepNonNullable } from "utility-types";
import isObjectOfType from "../../services/isObjectOfType";
import GenericError from "../../components/GenericError";

interface Props {
    data: AppearancesPageQueryQuery;
}

type Edge = $ElementType<
    AppearancesPageQueryQuery["allAppearancesJson"]["edges"],
    number
>;
type EdgeNode = Edge["node"];

interface Year {
    id: string;
    year: string;
}

type ReduceProps = (ReactElement<EdgeNode> | ReactElement<Year>)[];

const isYearNode = (
    acc: ReduceProps,
    year: string
): acc is ReactElement<Year>[] => {
    return !acc.find((item) =>
        (
            (item as ReactElement<EdgeNode>).props.date as NonNullable<
                EdgeNode["date"]
            >
        ).includes(year)
    );
};

const AppearancesPage: FC<Props> = ({ data }) => {
    if (
        !isObjectOfType<
            DeepNonNullable<
                AppearancesPageQueryQuery["allAppearancesJson"]["edges"]
            >
        >(data.allAppearancesJson.edges, (edge) =>
            Object.entries((edge as Edge).node).every(
                ([, item]) => item !== null && item !== undefined
            )
        )
    ) {
        return (
            <GenericError
                missing={{ allAppearancesJson: data.allAppearancesJson }}
                message="<Appearances />: cannot render: missing appearances.json or appearances.json fields"
            />
        );
    }

    return (
        <Layout>
            <Seo
                title="Public Appearances"
                slug="/appearances/"
                keywords={["workshops", "conferences", "talks", "appearances"]}
            />
            <main>
                <article css="margin-top: 8rem;">
                    <h1>Public Appearances</h1>
                    {data.allAppearancesJson.edges.reduce((acc, { node }) => {
                        const year = node.date.split("-")[0];

                        if (isYearNode(acc, year)) {
                            acc.push(
                                <YearLine
                                    key={`year sum before ${node.id}`}
                                    year={year}
                                />
                            );
                        }

                        acc.push(
                            <Appearance
                                key={node.id}
                                name={node.name}
                                date={node.date}
                                url={node.url}
                                host={node.host}
                                location={node.location}
                                slidesUrl={node.slidesUrl}
                            />
                        );

                        return acc;
                    }, [] as ReduceProps)}
                </article>
            </main>
        </Layout>
    );
};

export default AppearancesPage;

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
