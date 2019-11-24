import { DeepNonNullable } from "utility-types";

import { PersonInfoQueryQuery } from "../../types/generated";
export type SocialUrls = DeepNonNullable<
    PersonInfoQueryQuery
>["site"]["siteMetadata"]["socialUrls"];
