import "jest-styled-components";
import "@testing-library/jest-dom/extend-expect";

window.open = () => null;

window.matchMedia =
    window.matchMedia ||
    function() {
        return {
            matches: false,
            addListener: function() {},
            removeListener: function() {}
        };
    };

window.requestAnimationFrame = function(callback) {
    setTimeout(callback);
};

window.localStorage = {
    getItem: function() {},
    setItem: function() {}
};

Object.values = () => [];
