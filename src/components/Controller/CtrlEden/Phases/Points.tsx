import React, { useEffect, useState } from 'react'
import { useStores } from '../../../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { motion } from 'framer-motion';
import { Player } from '../../../../stores/socketStore';
import { Result } from './Voting';
import ResultsImageGallery from '../ImageGallery/ResultsImageGallery';
import ListItemPlayer from '../ListItemPlayer';

const Points = () => {
  const { gameStore, socketStore } = useStores()

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
          <div className="fs-4 fw-bold">Scores</div>
        </motion.div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            duration: 0.5,
            ease: 'backOut'
        }}
        >
          {JSON.stringify(gameStore.pointsData)}
          <div className={`fs-5 d-flex flex-column z-index-above mt-2 mb-2`}>
            PlayerName | Points 50
            ######################
          </div>
          <div className={`fs-5 d-flex flex-column z-index-above mt-2 mb-2`}>
            PlayerName | Points 25
            ############
          </div>
          <div className={`fs-5 d-flex flex-column z-index-above mt-2 mb-2`}>
            PlayerName | Points 5
            ###
          </div>
          <div className={`fs-5 d-flex flex-column z-index-above mt-2 mb-2`}>
            PlayerName | Points 0
            -
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default observer(Points)