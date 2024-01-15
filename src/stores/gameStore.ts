import { action, observable, makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';

export type Phase = {
  name: string,
}

export interface IGameStore {
  id: string;
  name?: string;
  description?: string;
  phases?: Phase[];
  currentPhase?: Phase|null;
}

export class GameStore implements IGameStore {
  private rootStore: RootStore;

  @observable id: string = '';
  @observable name: string = '';
  @observable description: string = '';
  @observable phases: Phase[] = [];
  @observable currentPhase: Phase|null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  @action setId = (id: string): void => {
    this.id = id;
  }

  @action setName = (name: string): void => {
    this.name = name;
  }

  @action setDescription = (description: string): void => {
    this.description = description;
  }

  @action setPhases = (phases: Phase[]): void => {
    this.phases = phases;
  }

  @action setCurrentPhase = (newPhase: Phase): void => {
    this.currentPhase = newPhase;
  }
}