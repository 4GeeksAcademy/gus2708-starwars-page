import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

// ScrollToTop: when the route changes, scroll window to top.
const ScrollToTop = ({ children }) => {
    const location = useLocation();
    const prevLocation = useRef(location.pathname + location.search + location.hash);

    useEffect(() => {
        const current = location.pathname + location.search + location.hash;
        if (current !== prevLocation.current) {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }
        prevLocation.current = current;
    }, [location]);

    return children;
};

export default ScrollToTop;

ScrollToTop.propTypes = {
    children: PropTypes.any
};