import EventEmitter from 'eventemitter3';
import Film from './Film';
import Planet from './Planet';

const planetEvents = {
  PERSON_BORN: 'person_born',
  POPULATING_COMPLETED: 'populating_completed',
};

export default class StarWarsUniverse extends EventEmitter {
  constructor() {
    super();

    this.films = [];
    this.planet = null;
  }

  static get events() {
    return {
      FILM_ADDED: 'film_added',
      UNIVERSE_POPULATED: 'universe_populated',
    };
  }

  _onPersonBorn({ filmUrls }) {
    filmUrls.forEach((url) => {
      let filmContained = false;

      for (const film of this.films) {
        if (film.url === url) filmContained = true;
      }

      if (!filmContained) {
        const newFilm = new Film(url);

        this.films.push(newFilm);
        this.emit(StarWarsUniverse.events.FILM_ADDED);
      }
    });
  }

  _onPopulatingCompleted() {
    this.emit(StarWarsUniverse.events.UNIVERSE_POPULATED);
  }

  async init() {
    const url = 'https://swapi.dev/api/planets/';
    const planetsResponse = await fetch(url);
    const planetsData = await planetsResponse.json();
    const count = planetsData.count;

    const planets = [];

    for (let i = 1; i <= count; i++) {
      const planetResponse = await fetch(url + i);
      const planetData = await planetResponse.json();

      planets.push(planetData);
    }

    const zeroPopulationPlanet = planets.find((planet) => planet.population === '0');
    const peopleData = [];

    for (let i = 1; i <= 10; i++) {
      const personResponse = await fetch(`https://swapi.dev/api/people/${i}/`);
      const personData = await personResponse.json();

      peopleData.push(personData);
    }

    const planet = new Planet(
      zeroPopulationPlanet.name,
      { populationDelay: 1 },
      peopleData,
    );

    this.planet = planet;
    this.planet.on(planetEvents.PERSON_BORN, this._onPersonBorn.bind(this));
    this.planet.on(planetEvents.POPULATING_COMPLETED, this._onPopulatingCompleted);
    this.planet.populate();
  }
}
