import EventEmitter from 'eventemitter3';
import { delay } from '../utils';
import Person from './Person';

export default class Planet extends EventEmitter {
  constructor(name, config, peopleData) {
    super();

    this.name = name;
    this.config = config;
    this.population = [];
    this.peopleData = peopleData;
  }

  static get events() {
    return {
      PERSON_BORN: 'person_born',
      POPULATING_COMPLETED: 'populating_completed',
    };
  }

  get populationCount() {
    return this.population.length;
  }

  async populate() {
    if (!this.peopleData.length) {
      this.emit(Planet.events.POPULATING_COMPLETED);

      return;
    }

    await delay(this.config.populationDelay);

    const personData = this.peopleData[0];

    this.peopleData.shift();

    const person = new Person(personData.name, personData.height, personData.mass);

    this.population.push(person);
    this.emit(Planet.events.PERSON_BORN, { filmUrls: personData.films });

    this.populate();
  }
}
