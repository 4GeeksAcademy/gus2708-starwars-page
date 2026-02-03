import React, { useMemo } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import MagicBento from "./bits/MagicBento.jsx"; // Asegúrate que la ruta sea correcta
import { Link } from "react-router-dom"; // Para el botón de "Volver"

export const Favorites = () => {
    const { store, actions } = useGlobalReducer();
    const { favorites } = store;

    // Función para manejar el clic en la estrella (eliminar)
    const handleRemoveFavorite = (item) => {
        actions.removeFavorite(item);
    };

    // Formatear los favoritos para que MagicBento los entienda
    const formattedFavorites = useMemo(() => {
        return favorites.map(fav => ({
            ...fav, // Mantenemos todas las propiedades originales
            color: "#060010", // El color de fondo de las cards
            title: fav.name,
            description: fav.label === "Character" ? "Favorite Character" : "Favorite Location", // Puedes personalizar esto
            label: fav.label, // Usamos la etiqueta original si está disponible
            isFavorite: true // Siempre true en la página de favoritos
        }));
    }, [favorites]); // Re-formatear solo cuando cambien los favoritos

    return (
        <div className="container" style={{ paddingTop: "clamp(80px, 15vw, 120px)", paddingBottom: "clamp(50px, 10vw, 100px)", minHeight: "100vh" }}>
            <h1 className="text-white mb-5 text-center pt-5">Your Galactic Favorites</h1>

            {formattedFavorites.length === 0 ? (
                <div className="text-center text-white-50 mt-6">
                    <p className="lead">You have no favorites yet. Start exploring the galaxy and add some!</p>
                    <Link to="/" className="btn btn-outline mt-3">
                        <i className="bi bi-arrow-left me-2"></i> Back to Home
                    </Link>
                </div>
            ) : (
                <>
                    <MagicBento
                        data={formattedFavorites}
                        glowColor="255, 215, 0"
                        onFavClick={handleRemoveFavorite}
                        enableTilt={true}
                        enableStars={true}
                        enableSpotlight={true}
                    />
                    <Link to="/" className="btn btn-outline mt-3">
                        <i className="bi bi-arrow-left me-2"></i> Back to Home
                    </Link>
                </>
            )}
        </div>
    );
};