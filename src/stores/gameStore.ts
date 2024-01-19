import { action, observable, makeAutoObservable } from 'mobx';
import { RootStore } from './rootStore';
import { Player } from './socketStore';

export type Phase = '0-lounge'|'1-splash'|'2-announce_players'|'3-round_start'|'4-round_end'|'5-voting'|'6-results'

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

export type Phase0LoungeData = {

}

export type Phase1SplashData = {
  title: string,
  description: string,
  image: string,
  player_count: number
}

export type Phase2PlayerData = {
  player_indexes: number[]
}

export type Phase3RoundData = {
  pre_delay?: number
  timer: number
  prompt: string
  hint?: string
}

export type Phase4RoundData = {

}

export type Phase5VotingData = {
  results: [
    {
      player_index: number,
      image: string,
    }
  ]
}

export type PhaseData = Phase0LoungeData | Phase1SplashData | Phase2PlayerData | Phase3RoundData

export class GameStore implements IGameStore {
  private rootStore: RootStore;

  @observable id: string = '';
  @observable title: string = '';
  @observable description: string = '';
  @observable phases: Phase[] = [];
  @observable currentPhase: Phase|null = null;
  @observable currentData: PhaseData|null = null;
  @observable userName: string|null = null;
  @observable players: Player[] = [];
  @observable audience: Player[] = [];
  @observable roundData: Phase3RoundData|null = null;
  @observable votingData: Phase5VotingData|null = null;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
  }

  @action handleUpdate = (data: GameStateUpdatePayload) :void => {
    // @todo: reducer-like action handler factory
    console.log('gameStore - handleUpdate', { data })
    this.currentPhase = data.gameState.phase
    this.currentData = data.gameState.data

    if (this.currentPhase === '0-lounge') {
      this.setTitle('')
      this.setDescription('')
      this.setPlayers([])
      this.setAudience([])
      this.setRoundData(null)
      this.setVotingData(null)
      return
    }

    if (this.currentPhase === '1-splash') {
      const { title, description} = data.gameState.data as Phase1SplashData || {}
      this.setTitle(title)
      this.setDescription(description)
      return
    }

    if (this.currentPhase === '3-round_start') {
      // const { pre_delay, timer, prompt, hint} = data.gameState.data as Phase3RoundStartData || {}
      this.setRoundData(data.gameState.data as Phase3RoundData)
      return
    }

    if (this.currentPhase === '5-voting') {
      // const { pre_delay, timer, prompt, hint} = data.gameState.data as Phase3RoundStartData || {}
      this.setVotingData(data.gameState.data as Phase5VotingData)
      return
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

  @action setPlayers = (players: Player[]): void => {
    this.players = players || [];
  }

  @action setAudience = (audience: Player[]|undefined): void => {
    this.audience = audience || [];
  }

  @action setRoundData = (roundData: Phase3RoundData|null): void => {
    this.roundData = roundData || null;
  }

  @action setVotingData = (votingData: Phase5VotingData|null) : void => {
    this.votingData = votingData || null
  }

  @action setPhases = (phases: Phase[]): void => {
    this.phases = phases || [];
  }

  @action setCurrentPhase = (newPhase: Phase): void => {
    this.currentPhase = newPhase;
  }

  @action setUserName = (name: string|null): void => {
    this.userName = name;
  }
}