import { Link } from "react-router-dom";
import GlassSurface from "../pages/bits/GlassSurface.jsx";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {

const { store, actions } = useGlobalReducer();

const favorites = store.favorites || [];

    // Responsive height and border radius
    const getNavbarHeight = () => {
        if (typeof window === 'undefined') return 80;
        const width = window.innerWidth;
        if (width < 480) return 60;
        if (width < 768) return 70;
        return 80;
    };

    const getBorderRadius = () => {
        if (typeof window === 'undefined') return 35;
        const width = window.innerWidth;
        if (width < 480) return 25;
        if (width < 768) return 30;
        return 35;
    };

    return (
        <header className="navbar-fixed-container">
            <GlassSurface
                width="98%"
                height={getNavbarHeight()}
                borderRadius={getBorderRadius()}
                brightness={40}
                displace={0.7}
                distortionScale={-180}
                opacity={0.8}
                className="mx-auto p-4"
            >
                <div className="container-fluid d-flex align-items-center justify-content-center px-2 px-sm-3 px-md-4">
                    <Link to="/" className="text-decoration-none">
                        <span className="navbar-brand mb-0 text-white" style={{ fontSize: "clamp(16px, 5vw, 24px)" }}>
                            Star Wars Bible
                        </span>
                    </Link>
                    <Link to="/favorites" className="text-decoration-none position-absolute end-0 me-3">
                        <span className="btn border-0 mb-0 text-white position-relative p-2" style={{ fontSize: "clamp(18px, 4vw, 24px)" }}>
                            <i className="bi bi-star-fill"></i>
                            {/* Badge ajustado para estar pegado a la estrella */}
                            <span className="position-absolute top-0 start-100 translate-middle-y badge rounded-pill bg-transparent fw-bold"
                                style={{
                                    fontSize: "0.7em",
                                    marginLeft: "-20px",
                                    marginTop: "10px",
                                    textShadow: "0 0 5px rgba(132, 0, 255, 0.8)"
                                }}>
                                {favorites.length}
                            </span>
                        </span>
                    </Link>
                </div>
            </GlassSurface>
        </header>
    );
};