import React, { useCallback } from 'react';
import { PromptItem } from '../../../stores/gameStore';
import { useSocket } from '../../../hooks/useSocket';

const PromptVote = ({ items }: { items: PromptItem[] }) => {
  const socket = useSocket();

  const handleVote = useCallback((id: PromptItem['id']) => {
    console.log('handleVote', id)
    socket.emit('OSC_CTRL_MESSAGE', {
      message: 'audience_action',
      type: 'prompt_vote',
      value: id
    });
  }, [])

  return (
    <div>
      { items.map(item => {
        return (
          <div key={item.id}>
            <h3>{item.prompt}</h3>
            <input type="radio" onSelect={(evt) => handleVote(item.id)}/>
            <label htmlFor={`vote_${item.id}`}>
              <div>{item.prompt}</div>
              <div className="text-muted">{item.hint}</div>
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default PromptVote