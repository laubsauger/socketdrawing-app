import { useContext } from 'react';
import { RootStore } from '../stores/rootStore';
import { StoreContext } from '../contexts'

export const useStores = (): RootStore => useContext(StoreContext);