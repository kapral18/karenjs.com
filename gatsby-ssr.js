import React from "react";

export const onRenderBody = ({ setPreBodyComponents }) => {
    setPreBodyComponents([
        <noscript key="noscript">
            Sorry! This site requires JavaScript to be enabled.
        </noscript>,
    ]);
};
