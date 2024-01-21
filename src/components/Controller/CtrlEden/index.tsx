import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import Splash from './Splash';
import Lounge from './Lounge';
import Players from './Players';
import {
  Phase1SplashData,
  Phase2PlayerData,
  Phase3RoundData,
  Phase4RoundData,
} from '../../../stores/gameStore';
import Round from './Round';
import RoundEnd from './RoundEnd';
import Voting from './Voting';
import Scores from './Scores';
import SessionInfo from '../SessionInfo';

type Props = {
  firedMouseUp: boolean
}

const vibrationSignal = (pattern: number|number[]) => {
  if ("vibrate" in navigator) {
    // Vibration API is supported.
    navigator.vibrate(pattern);
  } else {
    // Vibration API is not supported.
    // Use a different approach or disable it.
  }
}

const CtrlEden = (props: Props) => {
  const { gameStore } = useStores();

  const [showLounge, setShowLounge] = useState(true)
  const [showSplash, setShowSplash] = useState(false)
  const [showPlayers, setShowPlayers] = useState(false)
  const [showRoundStart, setShowRoundStart] = useState(false)
  const [showRoundEnd, setShowRoundEnd] = useState(false)
  const [showVoting, setShowVoting] = useState(false)
  const [showScores, setShowScores] = useState(false)

  useEffect(() => {
    gameStore.setCurrentPhase('lounge')
  }, []);

  useEffect(() => {
    console.log('CtrlEden - useEffect::currentPhase', gameStore.currentPhase)
    if (gameStore.currentPhase === 'lounge') {
      setShowLounge(true)
      setShowSplash(false)
      setShowPlayers(false)
      setShowRoundStart(false)
      setShowRoundEnd(false)
      setShowVoting(false)
      setShowScores(false)
      return
    }
    setShowLounge(false)

    if (gameStore.currentPhase === 'splash') {
      setShowSplash(true);
      setShowPlayers(false)
      setShowRoundStart(false)
      setShowRoundEnd(false)
      setShowVoting(false)
      setShowScores(false)
      vibrationSignal(200);
      return
    }
    setShowSplash(false)

    if (gameStore.currentPhase === 'announce_players') {
      setShowPlayers(true);
      setShowRoundStart(false)
      setShowRoundEnd(false)
      setShowVoting(false)
      setShowScores(false)
      vibrationSignal(200);
      return
    }
    setShowPlayers(false)

    if (gameStore.currentPhase === 'round_start') {
      setShowRoundStart(true);
      setShowRoundEnd(false)
      setShowVoting(false)
      setShowScores(false)
      vibrationSignal(200);
      return
    }
    setShowRoundStart(false);

    if (gameStore.currentPhase === 'round_end') {
      setShowRoundEnd(true);
      setShowVoting(false)
      setShowScores(false)
      vibrationSignal(200);
      return
    }
    setShowRoundEnd(false)

    if (gameStore.currentPhase === 'voting') {
      setShowVoting(true)
      setShowScores(false)
      vibrationSignal(200)
      return
    }
    setShowVoting(false)

    if (gameStore.currentPhase === 'results') {
      setShowScores(true)
      vibrationSignal(200)
      return
    }
    setShowScores(false)
  }, [gameStore.currentPhase])

  return (
    <div className="d-flex flex-column overflow-hidden" style={{ height: '100%'}}>
      <SessionInfo />

      { showLounge
        ? <Lounge />
        : null
      }
      { showSplash && gameStore.currentData
        ? <Splash data={gameStore.currentData as Phase1SplashData}/>
        : null
      }
      { showPlayers && gameStore.currentData
        ? <Players data={gameStore.currentData as Phase2PlayerData}/>
        : null
      }
      { showRoundStart && gameStore.currentData
        ? <Round />
        : null
      }
      { showRoundEnd && gameStore.currentData
        ? <RoundEnd />
        : null
      }
      { showVoting && gameStore.currentData
        ? <Voting firedMouseUp={props.firedMouseUp}/>
        : null
      }
      { showScores && gameStore.currentData
        ? <Scores />
        : null
      }
{/*`      {*/}
{/*        showPrompt && gameStore.currentData*/}
{/*          ?*/}
{/*          :*/}
{/*      }`*/}
{/*      <div className="p-2 border-bottom d-flex gap-2 justify-content-between">*/}
{/*        <div className="d-flex align-items-center gap-2">*/}
{/*          /!* //@todo: game.name, game.id *!/*/}
{/*          <strong>{socketStore.currentInstance?.name}</strong>*/}
{/*          /!* //@todo: game.round *!/*/}
{/*          <Badge bg="dark">Round 1</Badge>*/}
{/*        </div>*/}
{/*        <div className="d-flex align-items-center gap-2">*/}
{/*          /!* //@todo: game.phase (type Phases) *!/*/}
{/*          /!*<Badge bg="light">Lounge</Badge>*!/*/}
{/*          <Badge bg="light">Splash</Badge>*/}
{/*          /!*<Badge bg="light">Player Selection</Badge>*!/*/}
{/*          /!*<Badge bg="warning">Prompting</Badge>*!/*/}
{/*          /!*<Badge bg="info">Voting</Badge>*!/*/}
{/*          /!*<Badge bg="success">Results</Badge>*!/*/}
{/*        </div>*/}
{/*      </div>*/}

      {/*{ gameStore.currentPhase ? gameStore.currentPhase : 'unknown / undefined phase' }*/}

      {/*{ showOtherControls*/}
      {/*  ? (*/}
      {/*    <div className="d-flex flex-column z-index-above">*/}
      {/*      <div>*/}
      {/*        <CtrlText*/}
      {/*          label={'Text Prompt'}*/}
      {/*          messageField={'textPrompt'}*/}
      {/*          textArea={true}*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*      <div*/}
      {/*        className="d-flex position-absolute justify-content-between py-2 px-2 w-100 bg-black"*/}
      {/*        style={{ zIndex: 10, borderTop: '1px solid black', bottom: '0px' }}*/}
      {/*      >*/}
      {/*        {CtrlButtons(4, props.firedMouseUp)}*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )*/}
      {/*  : null*/}
      {/*}*/}
    </div>
  )
};

export default observer(CtrlEden);