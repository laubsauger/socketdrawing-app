import React, { useEffect, useState } from 'react'
import { useStores } from '../../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import VotingImageGallery from '../ImageGallery/VotingImageGallery';
import VoteButton from '../VoteButton';
import 'react-circular-progressbar/dist/styles.css';
import Timer from '../Timer';

export type Result = { player_index: number, image: string, votes?: number, prompt?: string }

const Voting = ({firedMouseUp}: {firedMouseUp: boolean}) => {
  const { gameStore, socketStore } = useStores()
  // const [ownResult, setOwnResult] = useState<Result | null>(null)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [resultInView, setResultInView] = useState<Result | null>(gameStore.votingData?.results ? gameStore.votingData.results[0] : null)

  const [ roundTimer, setRoundTimer ] = useState<number|undefined>(undefined)
  const { timer } = gameStore.votingData || {}

  // useEffect(() => {
  //   if (gameStore.players && socketStore.connectionState.clientId) {
  //     const currentPlayer = gameStore.players.filter(player => player.id === socketStore.connectionState.clientId)[0]
  //     if (currentPlayer) {
  //       setOwnResult(gameStore.votingData?.results.filter(result => result.player_index === currentPlayer.client_index)[0] || null)
  //     }
  //   }
  // }, [gameStore.votingData, gameStore.players, socketStore.connectionState.clientId]);

  useEffect(() => {
    if (!timer) {
      return
    }

    setRoundTimer(timer)
    const decreaseTimerInterval = setInterval(() => {
      setRoundTimer(prevTimer => prevTimer && prevTimer > 0 ? prevTimer - 0.25 : 0);
    }, 250)

    return () => {
      clearInterval(decreaseTimerInterval)
    }
  }, [timer]);

  return (
    <div
      className="d-flex flex-column overflow-hidden" style={{ width: '100vw' }}
    >
      <div className={`p-2 mt-2 text-center w-100 d-flex flex-column`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          <div className="fs-4 fw-bold">{gameStore.roundData?.prompt}</div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'backOut' }}
        >
          <div className={`fs-5 d-flex flex-column z-index-above mt-2 mb-2`}>
            Choose your favorite submission
          </div>
        </motion.div>
      </div>

      {/*{selectedResult*/}
      {/*  ? <div className="position-absolute d-flex flex-column justify-content-center" onClick={() => setSelectedResult(null)} style={{ height: '100vh', width: '100vw' }}>*/}
      {/*      <div className={`p-2 mt-2 text-center w-100 d-flex flex-column`}>*/}
      {/*        <div className="fs-4 fw-bold">Your selection</div>*/}
      {/*      </div>*/}
      {/*      <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }}>*/}
      {/*        <ImageZoom imageUrl={selectedResult.image} />*/}
      {/*      </motion.div>*/}
      {/*      <Button variant="dark" className="mt-auto mx-2 mb-2" onClick={() => setSelectedResult(null)}><>Change vote</></Button>*/}
      {/*    </div>*/}
      {/*  : <div className="d-flex flex-column flex-grow-1">*/}
       <div className="d-flex flex-column ">
         {/*<div className="d-flex flex-wrap">*/}
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 1, duration: 0.5, ease: 'backOut' }}
             className="d-flex flex-column"
           >
             <VotingImageGallery
               onSlideChanged={setResultInView}
               votedResult={selectedResult}
               votableResults={
                // gameStore.votingData?.results.filter(result => ownResult?.player_index !== result?.player_index)
                gameStore.votingData?.results
              }
              initialResultInView={resultInView || undefined}
             />

            <Timer currentTime={roundTimer} duration={timer} />

             <div className="mx-2 mb-2 d-flex justify-content-center">
              <VoteButton
                selectedResult={selectedResult}
                resultInView={resultInView}
                className="w-100"
                onClick={() => setSelectedResult(resultInView)}
                released={firedMouseUp}
              />
             </div>
           </motion.div>
       </div>
    </div>
)
}

export default observer(Voting)