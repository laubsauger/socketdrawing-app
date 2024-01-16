import { action, observable, makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';
import { Phase0LoungeData } from '../components/Controller/CtrlEden';

export type Phase = '0-lounge'|'1-splash'|'2-rules'| '3-announce_players'|'4-countdown'|'5-round_start'|'6-round_end'|'7-voting_start'| '8-voting_end'| '9-results'

export interface IGameStore {
  id: string;
  name?: string;
  description?: string;
  phases?: Phase[];
  currentPhase?: Phase|null;
}

export type GameStateUpdatePayload = {
  gameState: {
    phase: Phase,
    data: Phase0LoungeData
  }
}

export class GameStore implements IGameStore {
  private rootStore: RootStore;

  @observable id: string = '';
  @observable name: string = '';
  @observable description: string = '';
  @observable phases: Phase[] = [];
  @observable currentPhase: Phase|null = null;
  @observable currentData: Phase0LoungeData|null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  @action handleUpdate = (data: GameStateUpdatePayload) :void => {
    // @todo: reducer-like action handler factory
    console.log('gameStore - handleUpdate', { data })
    this.currentPhase = data.gameState.phase
    this.currentData = data.gameState.data
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