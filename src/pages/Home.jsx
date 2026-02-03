import { useEffect, useMemo } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import MagicBento from "../pages/bits/MagicBento.jsx";

export const Home = () => {
    const { store, actions } = useGlobalReducer();
    const { people, planets, vehicles, loading, favorites } = store;

    useEffect(() => {
        const loadData = async () => {
            // Solo carga si las listas están vacías
            if (people.length === 0) {
                actions.setLoading(true);
                try {
                    await Promise.all([
                        actions.loadPeople(),
                        actions.loadPlanets(),
                        actions.loadVehicles()
                    ]);
                } catch (error) {
                    console.error("Fallo galáctico:", error);
                } finally {
                    actions.setLoading(false);
                }
            }
        };
        loadData();
    }, []);

    // Función auxiliar mejorada para incluir el objeto original y estado de favorito
    const formatData = (items, type) => {
        return items.map(item => ({
            ...item,
            color: "#060010",
            title: item.name,
            description: type === "Character" ? "Learn about this character" : "Look for this " + type.toLowerCase(),
            label: type,
            isFavorite: favorites.some(fav => fav.name === item.name)
        }));
    };

    // Memorizamos las secciones para evitar cálculos innecesarios
    const sections = useMemo(() => ({
        people: formatData(people, "Character"),
        planets: formatData(planets, "Planet"),
        vehicles: formatData(vehicles, "Vehicle")
    }), [people, planets, vehicles, favorites]);

    // Renderizado condicional basado en el estado de carga
    if (loading) {
        return (
            <div className="container text-center" style={{ paddingTop: "150px" }}>
                <div className="spinner-border text-primary" role="status"></div>
                <h2 className="mt-3 text-white">Loading Galaxy...</h2>
            </div>
        );
    };

    // Renderizado principal
    return (
        <div className="container" style={{ paddingTop: "clamp(80px, 15vw, 120px)" }}>
            <div className="img-header text-center mb-5">
                <img src="https://image2url.com/r2/default/images/1770107740104-ba05f7e3-4f87-463f-acfb-50ac8d6125b2.png" alt="Logo" className="img-fluid" style={{ maxWidth: "800px" }} />
            </div>
            
            <section className="mb-5">
                <h2 className="text-white">Characters</h2>
                <div className="section-line"></div>
                <MagicBento 
                    data={sections.people} 
                    glowColor="132, 0, 255" 
                    onFavClick={(item) =>{ item.isFavorite ? actions.removeFavorite(item) : actions.addFavorite(item)} } 
                />
            </section>

            <section className="mb-5">
                <h2 className="text-white">Planets</h2>
                <div className="section-line"></div>
                <MagicBento 
                    data={sections.planets} 
                    glowColor="0, 255, 132" 
                    onFavClick={(item) =>{ item.isFavorite ? actions.removeFavorite(item) : actions.addFavorite(item)} } 
                />
            </section>
            <section className="mb-5">
                <h2 className="text-white">Vehicles</h2>
                <div className="section-line"></div>
                <MagicBento 
                    data={sections.vehicles} 
                    glowColor="255, 0, 132" 
                    onFavClick={(item) =>{ item.isFavorite ? actions.removeFavorite(item) : actions.addFavorite(item)} } 
                />
            </section>
        </div>
    );
};