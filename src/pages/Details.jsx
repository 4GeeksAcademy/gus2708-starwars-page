import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import MagicBento from "./bits/MagicBento.jsx";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'



export const Details = () => {
    const { type, id } = useParams();
    const { store, actions } = useGlobalReducer();
    const { favorites } = store; // Extraemos favoritos del store global
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getDetails = async () => {
            setLoading(true);
            const data = await actions.loadSingleItem(type, id);
            setItem(data);
            setLoading(false);
        };
        getDetails();
    }, [type, id]);

    // Comprobamos si este elemento ya está en favoritos
    const isFavorite = useMemo(() => {
        return item ? favorites.some(fav => fav.name === item.properties.name) : false;
    }, [favorites, item]);

    // Función para manejar el clic en el botón de favoritos
    const handleFavoriteClick = () => {
        if (!item) return;

        const favItem = {
            ...item.properties,
            uid: id,
            label: type === "people" ? "Character" : type.charAt(0).toUpperCase() + type.slice(1, -1)
        };

        if (isFavorite) {
            actions.removeFavorite(favItem);
        } else {
            actions.addFavorite(favItem);
        }
    };

    // Formateamos los detalles técnicos para el MagicBento
    const bentoData = useMemo(() => {
        if (!item) return [];
        const props = item.properties;

        return Object.entries(props)
            .filter(([key, value]) => {
                const forbiddenKeys = ["url", "name", "homeworld"];
                return !forbiddenKeys.includes(key) && value !== "none" && typeof value !== "object";
            })
            .map(([key, value]) => {
                let displayValue = value;

                if (key === "created" || key === "edited") {
                    const date = new Date(value);
                    displayValue = isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('en-EN', {
                        day: '2-digit', month: 'short', year: 'numeric'
                    }).format(date);
                } else {
                    displayValue = value.charAt(0).toUpperCase() + value.slice(1);
                }

                return {
                    title: displayValue,
                    label: key.replace("_", " ").toUpperCase(),
                    description: `Data from Imperial Database`,
                    color: "#060010"
                };
            });
    }, [item]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
            <div className="spinner-border text-warning" role="status"></div>
        </div>
    );

    if (!item) return <h2 className="text-white text-center mt-5">Item not found</h2>;

    return (
        <div className="container" style={{ paddingTop: "120px", paddingBottom: "100px" }}>
            {/* Header: back button, title and favorite in single row */}
            <div className="header-details d-flex align-items-center justify-content-between mb-4">
                <button className="btn btn-outline-light back-btn" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left me-2" aria-hidden></i>
                    <span className="">Back to home</span>
                </button>

                <h1 className="details-title m-0 text-white text-center text-truncate">{item.properties.name}</h1>

                <button
                    className={`btn fav-btn ${isFavorite ? 'btn' : 'btn-outline-light'}`}
                    onClick={handleFavoriteClick}
                    aria-pressed={isFavorite}
                    title={isFavorite ? 'Remove favorite' : 'Add favorite'}
                >
                    <i className={`bi ${isFavorite ? 'bi-star-fill' : 'bi-star'} me-2`} aria-hidden></i>
                    <span className="d-none d-sm-inline">{isFavorite ? 'Favorited' : 'Favorite'}</span>
                </button>
            </div>

            <div className="row g-4">
                {/* Columna de Imagen */}
                <div className="col-lg-4">
                    <div className="p-2 rounded-4 border border-secondary bg-dark shadow-lg sticky-top" style={{ top: "120px" }}>
                        {loading ? (
                            <div className="skeleto-container mb-3">
                                <Skeleton count={10} style={{ opacity: "0.3" }} />
                            </div>
                        ) : (
                            <>
                                <img
                                    src={`https://starwars-visualguide.com/assets/img/${type === 'people' ? 'characters' : type}/${id}.jpg`}
                                    className="img-fluid rounded-3 w-100"
                                    onError={(e) => e.target.src = "https://starwars-visualguide.com/assets/img/placeholder.jpg"}
                                    alt={item.properties.name}
                                />
                                <div className="p-3 text-white-50">
                                    <small className="fst-italic">{item.description}</small>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Columna de Datos: MagicBento */}
                <div className="col-lg-8">
                    <h3 className="text-secondary mb-4 text-uppercase" style={{ letterSpacing: "2px" }}>
                        Technical Specifications
                    </h3>
                    <MagicBento
                        data={bentoData}
                        glowColor={type === 'people' ? "132, 0, 255" : "0, 255, 132"}
                        particleCount={8}
                        enableTilt={true}
                        showFavButton={false} // Ocultamos las estrellas pequeñas del bento
                    />
                </div>
            </div>
        </div>
    );
};