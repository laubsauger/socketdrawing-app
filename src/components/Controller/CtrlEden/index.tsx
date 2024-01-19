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
  Phase5VotingData
} from '../../../stores/gameStore';
import Round from './Round';
import RoundEnd from './RoundEnd';
import Voting from './Voting';

type Props = {
  firedMouseUp: boolean
}

const CtrlEden = (props: Props) => {
  const { gameStore } = useStores();

  const [showLounge, setShowLounge] = useState(true)
  const [showSplash, setShowSplash] = useState(false)
  const [showPlayers, setShowPlayers] = useState(false)
  const [showRoundStart, setShowRoundStart] = useState(false)
  const [showRoundEnd, setShowRoundEnd] = useState(false)
  const [showVoting, setShowVoting] = useState(false)

  useEffect(() => {
    gameStore.setCurrentPhase('0-lounge')
  }, []);

  useEffect(() => {
    console.log('CtrlEden - useEffect::currentPhase', gameStore.currentPhase)
    if (gameStore.currentPhase === '0-lounge') {
      setShowLounge(true)
      setShowSplash(false)
      setShowPlayers(false)
      setShowRoundStart(false)
      setShowRoundEnd(false)
      setShowVoting(false)
      return
    }
    setShowLounge(false)

    if (gameStore.currentPhase === '1-splash') {
      setShowSplash(true);
      setShowPlayers(false)
      setShowRoundStart(false)
      setShowRoundEnd(false)
      setShowVoting(false)
      navigator.vibrate(200);
      return
    }
    setShowSplash(false)

    if (gameStore.currentPhase === '2-announce_players') {
      setShowPlayers(true);
      setShowRoundStart(false)
      setShowRoundEnd(false)
      setShowVoting(false)
      navigator.vibrate(200);
      return
    }
    setShowPlayers(false)

    if (gameStore.currentPhase === '3-round_start') {
      setShowRoundStart(true);
      setShowRoundEnd(false)
      setShowVoting(false)
      navigator.vibrate(200);
      return
    }
    setShowRoundStart(false);

    if (gameStore.currentPhase === '4-round_end') {
      setShowRoundEnd(true);
      setShowVoting(false)
      navigator.vibrate(200);
      return
    }
    setShowRoundEnd(false)

    if (gameStore.currentPhase === '5-voting') {
      setShowVoting(true)
      navigator.vibrate(200)
      return
    }
    setShowVoting(false)
  }, [gameStore.currentPhase])

  return (
    <div className="d-flex flex-column mt-3 overflow-hidden" style={{ height: '100%'}}>
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
        ? <Round data={gameStore.currentData as Phase3RoundData}/>
        : null
      }
      { showRoundEnd && gameStore.currentData
        ? <RoundEnd data={gameStore.currentData as Phase4RoundData}/>
        : null
      }
      { showVoting && gameStore.currentData
        ? <Voting data={gameStore.currentData as Phase5VotingData}/>
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