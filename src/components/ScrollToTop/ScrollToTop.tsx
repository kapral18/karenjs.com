import React, { useState, useEffect, FC, useCallback } from "react";
import { Arrow } from "./styles";

interface Props {
    className?: string;
}

const getCurrentScrollPercent = (): number => {
    return (
        ((document.body.scrollTop || document.documentElement.scrollTop) /
            (document.body.scrollHeight - document.body.clientHeight)) *
        100
    );
};

const SHOW_AFTER_IN_PERCENT = 13;

const ScrollToTop: FC<Props> = ({ className }) => {
    const [showArrow, setShowArrow] = useState<boolean>(false);

    const handleScroll = useCallback(() => {
        setShowArrow(getCurrentScrollPercent() > SHOW_AFTER_IN_PERCENT);
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    const handleScrollToTop = useCallback(() => scrollTo({ top: 0 }), []);

    return showArrow ? (
        <Arrow
            onClick={handleScrollToTop}
            className={className}
            size="3em"
            title="Scroll to top"
        />
    ) : null;
};

export default ScrollToTop;
