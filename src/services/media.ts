import { css, ThemedCssFunction } from "styled-components";

const sizes = {
    desktop: 992,
    tablet: 768,
    phone: 576,
    mobile: 480
};

type SizeKeys = keyof typeof sizes;

type FinalState = { [k in SizeKeys]: ThemedCssFunction<any> };

const mediaKeys = Object.keys(sizes) as SizeKeys[];

const media = mediaKeys.reduce(
    (acc, label) => {
        acc[label] = (first: any, ...interpolations: any[]) => css`
            @media (max-width: ${sizes[label] / 16}em) {
                ${css(first, ...interpolations)}
            }
        `;

        return acc;
    },
    {} as FinalState
);

export default media;
