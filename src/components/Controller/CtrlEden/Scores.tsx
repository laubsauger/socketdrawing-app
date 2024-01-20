import React, { useEffect, useState } from 'react'
import { useStores } from '../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Player } from '../../../stores/socketStore';
import { Badge } from 'react-bootstrap';

const Scores = () => {
  const { gameStore, socketStore } = useStores()
  const [ ownResult, setOwnResult ] = useState<{player_index:number, image: string}|null>(null)

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

  console.log(socketStore.roomState.users)

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
          <div className="fs-4 fw-bold">Scores</div>
        </motion.div>
      </div>

      <div className="d-flex flex-column flex-grow-1">
        <div className="d-flex flex-wrap">
          {gameStore.scoreData?.scores.map((result, index) => (
            <div key={result.image} className="w-50">
              <motion.img
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1 + (0.5 * index), duration: 0.5, ease: 'backOut', origin: 0 }}
                key={result.image} src={result.image} alt={result.image} className="object-fit-contain"
                style={{ maxWidth: '100%'}}
              />
              {/*<div className={`CtrlButton-${getPlayer(result.player_index).color}`}>*/}
              <div className="d-flex gap-2 justify-content-between">
                <div>{result.player_index}</div>
                <Badge>{result.votes}</Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default observer(Scores)