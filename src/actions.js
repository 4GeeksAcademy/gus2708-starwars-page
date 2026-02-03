
class Actions {
  constructor(state, dispatch) {
    this.state = state
    this.dispatch = dispatch
  }
  async loadPeople() {
    // evitando llamadas innecesarias si ya hay datos cargados
    if (!this.state.loading) return;
    const response = await fetch('https://www.swapi.tech/api/people/')
    if (response.ok) {
      const data = await response.json()
      this.dispatch({
        type: 'load_people',
        payload: data.results
      })
      return
    } else {
      console.error('Error fetching people:', response.status, response.statusText);
    }
  }

  async loadPlanets() {
    // evitando llamadas innecesarias si ya hay datos cargados
    if (!this.state.loading) return;
    const response = await fetch('https://www.swapi.tech/api/planets/')
    if (response.ok) {
      const data = await response.json()
      this.dispatch({
        type: 'load_planets',
        payload: data.results
      })
      return
    } else {
      console.error('Error fetching planets:', response.status, response.statusText);
    }
  }

  async loadVehicles() {
    // evitando llamadas innecesarias si ya hay datos cargados
    if (!this.state.loading) return;
    const response = await fetch('https://www.swapi.tech/api/vehicles/')
    if (response.ok) {
      const data = await response.json()
      this.dispatch({
        type: 'load_vehicles',
        payload: data.results
      })
      return
    } else {
      console.error('Error fetching vehicles:', response.status, response.statusText);
    }
  }

  addFavorite(item) {
    this.dispatch({
      type: 'add_favorite',
      payload: item
    });
  }

  removeFavorite(item) {
    this.dispatch({
      type: 'remove_favorite',
      payload: item
    });
  }

  async loadSingleItem(type, id) {
    const response = await fetch(`https://www.swapi.tech/api/${type}/${id}`);
    if (response.ok) {
        const data = await response.json();
        return data.result;
    }
    return null;
}

  setLoading(value) {
    this.dispatch({
      type: 'set_loading',
      payload: value
    });
  }
}

export default Actions;