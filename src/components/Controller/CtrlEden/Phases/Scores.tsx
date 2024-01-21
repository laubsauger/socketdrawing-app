import React, { useEffect, useState } from 'react'
import { useStores } from '../../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Player } from '../../../../stores/socketStore';
import { Result } from './Voting';
import ScoresImageGallery from '../ImageGallery/ScoresImageGallery';
import ListItemPlayer from '../ListItemPlayer';

const Scores = () => {
  const { gameStore, socketStore } = useStores()
  const [ ownResult, setOwnResult ] = useState<{player_index:number, image: string}|null>(null)
  const [resultInView, setResultInView] = useState<Result | null>(null)
  useEffect(() => {
    if (gameStore.players && socketStore.connectionState.clientId) {
      const currentPlayer = gameStore.players.filter(player => player.id === socketStore.connectionState.clientId)[0]
      console.log(currentPlayer)
      if (currentPlayer) {
        setOwnResult(gameStore.scoreData?.scores.filter(result => result.player_index === currentPlayer.client_index)[0] || null)
      }
    }
  }, [gameStore.scoreData, gameStore.players, socketStore.connectionState.clientId]);

  const getPlayer = (player_index: number): Player => {
    return gameStore.players.filter(player => player.client_index === player_index)[0]
  }

  return (
    <div
      className="d-flex flex-column" style={{ height: '100dvh', width: '100dvw' }}
    >
      <div className="p-0 p-2 text-center w-100 d-flex flex-column">
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
            Votes are in!
          </div>
        </motion.div>
      </div>

      <div className="d-flex flex-column flex-grow-1">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, duration: 0.5, ease: 'backOut' }}
          className="d-flex flex-column flex-grow-1"
        >
          <ScoresImageGallery
            onSlideChanged={setResultInView}
            results={
              gameStore.scoreData?.scores
            }
            // initialResultInView={undefined}
          />
          <div className="px-3 mt-4">
            <ListItemPlayer player={gameStore.players.filter(item => item.client_index === resultInView?.player_index)[0]}/>
            <div className="text-light">
              {resultInView?.prompt}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default observer(Scores)