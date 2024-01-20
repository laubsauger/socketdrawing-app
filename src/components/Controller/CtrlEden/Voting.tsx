import React, { EventHandler, useEffect, useState } from 'react'
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import ImageGallery from './ImageGallery';
import VoteButton from './VoteButton';


const ownResultStyles = () => {
  return {
    filter: 'grayscale(1)',
    padding: '16px'
  }
}
type Result = { player_index: number, image: string }

const Voting = ({firedMouseUp}: {firedMouseUp: boolean}) => {
  const { gameStore, socketStore } = useStores()
  const [ownResult, setOwnResult] = useState<Result | null>(null)
  const [selectedResult, setSelectedResult] = useState<Result | null>(null)
  const [resultInView, setResultInView] = useState<Result | null>(null)
  const [ firstRender, setFirstRender ] = useState(true)
  console.log(selectedResult)

  useEffect(() => {
    if (gameStore.players && socketStore.connectionState.clientId) {
      const currentPlayer = gameStore.players.filter(player => player.id === socketStore.connectionState.clientId)[0]
      if (currentPlayer) {
        setOwnResult(gameStore.votingData?.results.filter(result => result.player_index === currentPlayer.client_index)[0] || null)
      }
    }
  }, [gameStore.votingData, gameStore.players, socketStore.connectionState.clientId]);



  return (
    <div
      className="d-flex flex-column overflow-hidden" style={{ height: '100vh', width: '100vw' }}
    >
      <div className={`p-2 mt-2 text-center w-100 d-flex flex-column`}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          <div className="fs-4 fw-bold">Voting</div>
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
       <div className="d-flex flex-column flex-grow-1">
         {/*<div className="d-flex flex-wrap">*/}
           <motion.div
             initial={{ scale: 0 }}
             animate={{ scale: 1 }}
             transition={{ delay: 1, duration: 0.5, ease: 'backOut' }}
             className="d-flex flex-column flex-grow-1"
           >
             <ImageGallery
               onSlideChanged={setResultInView}
               votableResults={
                gameStore.votingData?.results.filter(result => ownResult?.player_index !== result?.player_index)
              }
             />
             <div className="mx-2 mt-auto mb-2 d-flex justify-content-center">
              <VoteButton
                selectedResult={selectedResult}
                resultInView={resultInView}
                className="w-100"
                onClick={() => setSelectedResult(resultInView)}
                released={firedMouseUp}
              />
             </div>
           </motion.div>
             {/*{gameStore.votingData?.results.map((result, index) => (*/}
             {/*  <div*/}
             {/*    key={result.image}*/}
             {/*    className={`w-50`}*/}
             {/*  >*/}
             {/*    {ownResult?.player_index === result.player_index ?*/}
             {/*      null*/}
             {/*      :*/}
             {/*      <CtrlButton*/}
             {/*        type='div'*/}
             {/*        channelName={`b${result.player_index}`}*/}
             {/*        onClick={() => {*/}
             {/*          setFirstRender(false)*/}
             {/*          setSelectedResult(result)*/}
             {/*        }}*/}
             {/*      >*/}
             {/*        <motion.img*/}
             {/*          initial={firstRender ? { scale: 0 } : false}*/}
             {/*          animate={{ scale: 1 }}*/}
             {/*          transition={{ delay: 1 + (0.5 * index), duration: 0.5, ease: 'backOut', origin: 0 }}*/}
             {/*          key={result.image}*/}
             {/*          src={result.image}*/}
             {/*          alt={result.image}*/}
             {/*          style={{*/}
             {/*            maxWidth: '100%',*/}
             {/*            padding: '6px',*/}
             {/*            objectFit: 'contain'*/}
             {/*          }}*/}
             {/*        />*/}
             {/*      </CtrlButton>*/}
             {/*    }*/}
             {/*  </div>*/}
             {/*))}*/}
         {/*</div>*/}
       </div>
      {/*}*/}
    </div>
)
}

export default observer(Voting)