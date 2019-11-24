import React, { FC } from "react";
import styled from "styled-components";

interface Props {
    message: string;
    missing: Record<string, any>;
}

const ErrorStyles = styled.div({
    padding: "1em",
    color: "red",

    margin: "1em auto",
    width: "fit-content",
    border: "1px solid red"
});

const GenericError: FC<Props> = ({ missing, message }) => {
    console.log({ missing });

    return <ErrorStyles>{message}</ErrorStyles>;
};

export default GenericError;
