import { initializeApp } from "firebase/app";
import {
  ref,
  onValue,
  onChildChanged,
  DataSnapshot,
  onChildAdded,
  query,
  limitToLast,
  orderByChild,
  startAfter,
  getDatabase,
} from "firebase/database";

import { EventEmitter } from "events";
import { encodeRepo } from "./utils";
import { IBuildInfo } from "./types";

// TODO: move these to env maybe?
const firebaseConfig = {
  apiKey: "AIzaSyDfvbeE4loh8UGNeGV86oAop6n_JOnU1iU",
  authDomain: "buildtray.firebaseapp.com",
  projectId: "buildtray",
  storageBucket: "buildtray.appspot.com",
  messagingSenderId: "268408377959",
  appId: "1:268408377959:web:d784ad777ed6895554bac2",
};

export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

declare interface FirebaseService {
  on(event: "build", listener: (data: IBuildInfo) => void): this;
}

class FirebaseService extends EventEmitter {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public listeners: any = [];

  /**
   * Subscribe to something like repos/<entity>/<repo>
   * and push an data on the emit for repoSnapshot
   * @param fullName An org/repo name that exists in the databse
   */
  subscribeToRepo(fullName: string) {
    const buildPath = `repos/${encodeRepo(fullName)}/builds`;
    const localRef = ref(database, buildPath);

    const time = Math.floor(+new Date() / 1000);
    const updatedRepo = query(localRef, orderByChild("createdAt"), startAfter(time), limitToLast(1));

    // find by run id
    // TODO: might be useful later on
    // const findBuildBuildId = query(localRef, orderByChild("id"), equalTo(2223461950), limitToLast(1));

    // when a build is added, emit the build
    const onChildAddedListener = onChildAdded(updatedRepo, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName,
      });
    });

    // when a build is changed, emit the updated build
    const onChildChangedListener = onChildChanged(localRef, (snapshot: DataSnapshot) => {
      this.emit("build", {
        ...snapshot.val(),
        fullName,
      });
    });

    this.listeners.push(onChildAddedListener);
    this.listeners.push(onChildChangedListener);
  }

  /**
   * Sorta don't know if this makes full sense to be a "service"
   * @param fullName An org/repo name that exists in the databse
   * @returns Promise<any[]>
   */
  getMostRecentBuilds(fullName: string): Promise<IBuildInfo[]> {
    return new Promise(resolve => {
      const buildPath = `repos/${encodeRepo(fullName)}/builds`;
      const localRef = ref(database, buildPath);
      const updatedRepo = query(localRef, orderByChild("createdAt"), limitToLast(5));

      const listener = onValue(updatedRepo, (snapshot: DataSnapshot) => {
        const val = snapshot.val();

        if (!val) {
          return resolve([]);
        }

        const fixed = Object.entries(val).map(([k, v]: [string, unknown]) => ({
          id: k,
          fullName,
          ...(v as Record<string, unknown>),
        }));

        resolve(fixed.reverse() as IBuildInfo[]);
      });

      this.listeners.push(listener);
    });
  }

  clearAllListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
    // reset all listers list
    this.listeners = [];
  }
}

export default new FirebaseService();