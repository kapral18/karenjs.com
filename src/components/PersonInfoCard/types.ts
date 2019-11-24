import { DeepNonNullable } from "utility-types";

import { PersonInfoQueryQuery } from "./../../types/generated/index";
export type SocialUrls = DeepNonNullable<
    PersonInfoQueryQuery
>["site"]["siteMetadata"]["socialUrls"];
