import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';
import Splash from './Phases/Splash';
import Lounge from './Phases/Lounge';
import Players from './Phases/Players';
import {
  Phase1SplashData,
  Phase2PlayerData,
  Phase3RoundData,
  Phase4RoundData,
} from '../../../stores/gameStore';
import Round from './Phases/Round';
import RoundEnd from './Phases/RoundEnd';
import Voting from './Phases/Voting';
import Scores from './Phases/Scores';
import SessionInfo from '../SessionInfo';
import { useSocket } from '../../../hooks/useSocket';

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
  const { gameStore, socketStore } = useStores();
  const socket = useSocket();
  const [showLounge, setShowLounge] = useState(true)
  const [showSplash, setShowSplash] = useState(false)
  const [showPlayers, setShowPlayers] = useState(false)
  const [showRoundStart, setShowRoundStart] = useState(false)
  const [showRoundEnd, setShowRoundEnd] = useState(false)
  const [showVoting, setShowVoting] = useState(false)
  const [showScores, setShowScores] = useState(false)

  useEffect(() => {
    gameStore.setCurrentPhase('lounge')

    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'userName',
      text: socketStore.connectionState.clientId.slice(0, 6),
    });
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
      {/*<SessionInfo />*/}
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
    </div>
  )
};

export default observer(CtrlEden);