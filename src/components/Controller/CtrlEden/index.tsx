import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import CtrlText from '../CtrlText';
import { CtrlButtons } from '../index';
import { useStores } from '../../../hooks/useStores';
import { Badge } from 'react-bootstrap';
import { motion } from "framer-motion"
import Splash from './Splash';
import Lounge from './Lounge';

type Props = {
  firedMouseUp: boolean
}

export type Phase0LoungeData = {

}

export type Phase1SplashData = {
  title: string,
  description: string,
  image: string,
  player_count: number
}


const CtrlEden = (props: Props) => {
  const [showOtherControls, setShowOtherControls] = useState(false)
  const { socketStore, gameStore } = useStores();

  const [showSplash, setShowSplash] = useState(false)
  const [showLounge, setShowLounge] = useState(true)

  useEffect(() => {
    gameStore.setCurrentPhase('0-lounge')
  }, []);

  useEffect(() => {
    console.log('CtrlEden - useEffect::currentPhase', gameStore.currentPhase)
    if (gameStore.currentPhase === '0-lounge') {
      setShowLounge(true);
      return
    }

    if (gameStore.currentPhase === '1-splash') {
      setShowSplash(true);
      navigator.vibrate(200);
      return
    }
    setShowSplash(false)
  }, [gameStore.currentPhase])

  return (
    <div className="d-flex flex-column mt-3" style={{ height: '100%'}}>
      { showLounge
        ? <Lounge />
        : null
      }
      { showSplash && gameStore.currentData
        ? <Splash data={gameStore.currentData as Phase1SplashData}/>
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

      { showOtherControls
        ? (
          <div className="d-flex flex-column z-index-above">
            <div>
              <CtrlText
                label={'Text Prompt'}
                messageField={'textPrompt'}
                textArea={true}
              />
            </div>
            <div
              className="d-flex position-absolute justify-content-between py-2 px-2 w-100 bg-black"
              style={{ zIndex: 10, borderTop: '1px solid black', bottom: '0px' }}
            >
              {CtrlButtons(4, props.firedMouseUp)}
            </div>
          </div>
        )
        : null
      }
    </div>
  )
};

export default observer(CtrlEden);