import React, { useEffect, useState } from 'react'
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { Phase4RoundData } from '../../../stores/gameStore';
import { motion } from 'framer-motion';

const Voting = ({ data }: { data: Phase4RoundData }) => {
  const { gameStore, socketStore } = useStores()
  const [ ownResult, setOwnResult ] = useState<{player_index:number, image: string}|null>(null)
  // @todo: if currentClient === one of the players
    // don't allow voting but still show results
  // else provide vote functionality
    // border, buttons, etc
  useEffect(() => {
    if (gameStore.players && socketStore.connectionState.clientId) {
      const currentPlayer = gameStore.players.filter(player => player.id === socketStore.connectionState.clientId)[0]
      console.log(currentPlayer)
      if (currentPlayer) {
        setOwnResult(gameStore.votingData?.results.filter(result => result.player_index === currentPlayer.client_index)[0] || null)
      }
    }
  }, [gameStore.votingData, gameStore.players, socketStore.connectionState.clientId]);

  console.log(ownResult)

  return (
    <div
      className="d-flex flex-column" style={{ height: '100vh', width: '100vw' }}
    >
      <div className="p-2 mt-2 text-center w-100 d-flex flex-column">
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
          <div className="fs-5 d-flex flex-column z-index-above mt-2 mb-4">
            Tap your favorite creation to vote
          </div>
        </motion.div>
      </div>

      <div className="d-flex flex-column flex-grow-1">
        <div className="d-flex flex-wrap">
          {gameStore.votingData?.results.map((result, index) => (
            <div key={result.image} className="w-50">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + (0.5 * index), duration: 0.5, ease: 'backOut', origin: 0 }}
                key={result.image} src={result.image} alt={result.image} className="object-fit-contain"
                style={{ maxWidth: '100%', filter: ownResult?.player_index === result.player_index ? 'grayscale(1)' : '' }}
              />
            </div>
          ))}
        </div>

        <div className="mt-auto w-100 px-4 mb-4">
          <motion.div
            initial={{ y: '100vh' }}
            animate={{ y: 0 }}
            transition={{ delay: 5, duration: 0.5, ease: 'backOut' }}
          >
            <div
              className="w-100 d-flex flex-column justify-content-center align-items-center position-relative overflow-hidden rounded-4 mb-3 py-2"
              style={{ background: 'rgb(25,25,25)' }}
            >
              <div className="mb-2" style={{ color: '#0a73d5' }}>Gathering votes</div>
              <div className="dot-floating mb-2"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default observer(Voting)