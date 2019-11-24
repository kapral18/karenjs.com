declare namespace NodeJS {
    export interface ProcessEnv {
        GATSBY_DISQUS_NAME: string;
    }
}

declare module "*.svg" {
    const content: string;
    export default content;
}
