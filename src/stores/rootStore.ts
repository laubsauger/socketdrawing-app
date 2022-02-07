// import { AuthStore } from './AuthStore'
import { UserStore } from './userStore';

export class RootStore {
  // authStore: AuthStore;
  userStore: UserStore;

  constructor() {
    // this.authStore = new AuthStore();
    this.userStore = new UserStore(this); // Pass `this` into stores for easy communication
  }
}