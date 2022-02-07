import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from '../../../hooks/useStores';

const Home: React.FC = (props) => {
  const { userStore } = useStores();

  console.log('running home')

  return (
    <div>Home ({ userStore.name })</div>
  )
};

export default observer(Home);