import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import CtrlText from '../CtrlText';
import { CtrlButtons } from '../index';
import { useStores } from '../../../hooks/useStores';
import { Badge } from 'react-bootstrap';
import { motion } from "framer-motion"

type Props = {
  firedMouseUp: boolean
}

export type Phase0LoungeData = {
  title: string,
  description: string,
  image: string,
  player_count: number
}
const Splash = ({data}: { data: Phase0LoungeData}) => {
  return (
    <div className="position-absolute w-100 h-100 z-index-above d-flex flex-column align-items-center bg-black justify-content-center">
      <motion.img
        src={data.image}
        alt={data.title}
        className="position-absolute w-auto mw-100 h-100"
        style={{ objectFit: 'cover', objectPosition: 'center' }}
        animate={{ scale: 1}}
        initial={{ scale: 100 }}
        transition={{ ease: "easeOut", duration: 1.25 }}
      />

      <div className="h-100  p-4 d-flex flex-column align-items-center justify-content-between z-index-above">
          <motion.div
            className="fw-bold fs-1 mb-4 text-white p-4 rounded-4 bg-black p-2" style={{ boxShadow: '0 1rem 3rem rgb(0 0 0) !important;'}}
            initial={{scale: 3, opacity: 0}}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2, ease: 'backOut',  duration: 0.75 }}
          >
            {data.title}
          </motion.div>
        <div>
          <motion.div
            className="fs-3 text-primary p-3 rounded-4 bg-black p-2"
            initial={{ scale: 3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.75,  ease: 'backOut', duration: 0.75 }}
          >
            <div>
              <div className="fs-5 mb-4 text-info font-monospace">
                {data.description}
              </div>
            </div>

            <motion.div
              className="fs-4 d-flex gap-2 justify-content-between">
              <Badge bg="primary">
                {data.player_count} Players
              </Badge>
              <Badge bg="dark">
                Crowd Vote
              </Badge>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

const CtrlEden = (props: Props) => {
  const [showOtherControls, setShowOtherControls] = useState(false)
  const { socketStore, gameStore } = useStores();

  const [showSplash, setShowSplash] = useState(false)

  useEffect(() => {
    console.log('CtrlEden - useEffect::currentPhase', gameStore.currentPhase)
    if (gameStore.currentPhase === '1-splash') {
      setShowSplash(true);
      return
    }
    setShowSplash(false)
  }, [gameStore.currentPhase])

  return (
    <div className="d-flex flex-column" style={{ height: '100%'}}>
      { gameStore.currentPhase ? gameStore.currentPhase : 'unknown / undefined phase' }
      { showSplash && gameStore.currentData
        ? <Splash data={gameStore.currentData as Phase0LoungeData}/>
        : null
      }
      <div className="p-2 border-bottom d-flex gap-2 justify-content-between">
        <div className="d-flex align-items-center gap-2">
          {/* //@todo: game.name, game.id */}
          <strong>{socketStore.currentInstance?.name}</strong>
          {/* //@todo: game.round */}
          <Badge bg="dark">Round 1</Badge>
        </div>
        <div className="d-flex align-items-center gap-2">
          {/* //@todo: game.phase (type Phases) */}
          {/*<Badge bg="light">Lounge</Badge>*/}
          <Badge bg="light">Splash</Badge>
          {/*<Badge bg="light">Player Selection</Badge>*/}
          {/*<Badge bg="warning">Prompting</Badge>*/}
          {/*<Badge bg="info">Voting</Badge>*/}
          {/*<Badge bg="success">Results</Badge>*/}
        </div>
      </div>

      {/* //@todo: game.controls */}
      <CtrlText
        singleUse={true}
        label={'Name'}
        messageField='userName'
        onSubmitSuccess={() => setShowOtherControls(true)}
      />
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