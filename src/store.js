export const initialStore=()=>{
  return{
    people: [],
    planets: [],
    vehicles: [],
    species: [],
    loading: true,
    favorites: []
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'load_people':

      const people = action.payload

      return {
        ...store,
        // Reemplazar la lista en lugar de concatenar para evitar duplicados
        people: [...people]
      };

    case 'load_planets':

      const planets = action.payload

      return {
        ...store,
        // Reemplazar la lista en lugar de concatenar para evitar duplicados
        planets: [...planets]
      };

       case 'load_vehicles':

      const vehicles = action.payload

      return {
        ...store,
        // Reemplazar la lista en lugar de concatenar para evitar duplicados
        vehicles: [...vehicles]
      };

    case 'add_favorite':

      const newFavorite = action.payload;
      // Evitar duplicados en favoritos
      if (store.favorites.find(fav => fav.name === newFavorite.name)) {
        return store; // No hacer nada si ya existe
      }

      return {
        ...store,
        favorites: [...store.favorites, newFavorite]
      };

    case 'remove_favorite':

      const favoriteToRemove = action.payload;

      return {
        ...store,
        favorites: store.favorites.filter(fav => fav.name !== favoriteToRemove.name)
      };

    case 'set_loading':

      return {
        ...store,
        loading: action.payload
      };

    default:
      throw Error('Unknown action.');
  }    
}
