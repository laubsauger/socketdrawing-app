import { action, observable, makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';
import { Phase0LoungeData, Phase1SplashData, Phase2PlayerData } from '../components/Controller/CtrlEden';

export type Phase = '0-lounge'|'1-splash'|'2-announce_players'|'3-countdown'|'4-round_start'|'5-round_end'|'6-voting_start'| '7-voting_end'| '8-results'

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
    data: PhaseData
  }
}

export type PhaseData = Phase0LoungeData | Phase1SplashData | Phase2PlayerData

export class GameStore implements IGameStore {
  private rootStore: RootStore;

  @observable id: string = '';
  @observable title: string = '';
  @observable description: string = '';
  @observable phases: Phase[] = [];
  @observable currentPhase: Phase|null = null;
  @observable currentData: PhaseData|null = null;
  @observable players: string[] = [];

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  @action handleUpdate = (data: GameStateUpdatePayload) :void => {
    // @todo: reducer-like action handler factory
    console.log('gameStore - handleUpdate', { data })
    this.currentPhase = data.gameState.phase
    this.currentData = data.gameState.data

    if (this.currentPhase === '1-splash') {
      const { title, description} = data.gameState.data as Phase1SplashData || {}
      this.setTitle(title)
      this.setDescription(description)
    }
  }

  @action setId = (id: string): void => {
    this.id = id;
  }

  @action setTitle = (title: string): void => {
    this.title = title;
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