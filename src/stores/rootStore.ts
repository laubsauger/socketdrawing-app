import { UserStore } from './userStore';
import { SocketStore } from './socketStore';

export class RootStore {
  // authStore: AuthStore;
  userStore: UserStore;
  socketStore: SocketStore;

  constructor() {
    // this.authStore = new AuthStore();
    this.userStore = new UserStore(this); // Pass `this` into stores for easy communication
    this.socketStore = new SocketStore(this); // Pass `this` into stores for easy communication
  }
}