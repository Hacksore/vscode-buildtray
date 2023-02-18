import { FirebaseApp, initializeApp } from "firebase/app";
import { ref, child, Database, get, getDatabase } from "firebase/database";

import { EventEmitter } from "events";

// TODO: move these to env maybe?
const firebaseConfig = {
  apiKey: "AIzaSyDBO3X54XXPYYDiL3XEcydaPquCNFzJYVU",
  authDomain: "biofun.firebaseapp.com",
  databaseURL: "https://biofun.firebaseio.com",
  projectId: "biofun",
  storageBucket: "biofun.appspot.com",
  messagingSenderId: "331493792247",
  appId: "1:331493792247:web:0fc34f987d3a67167976f2",
  measurementId: "G-HPNGCVE8RB"
};

export class FirebaseService extends EventEmitter {
  public app: FirebaseApp;
  public db: Database;

  constructor() {
    super();
    this.app = initializeApp(firebaseConfig);
    this.db = getDatabase(this.app);
  }

  getData() {
    return new Promise(async (res, rej) => {
      const dbRef = ref(this.db);
      const metaRef = child(dbRef, "userdata");
      try {
        const dataSnap = await get(metaRef);
        if (dataSnap.exists()) {            
          res(dataSnap.val());
        } else {
          console.log("No data available");
          rej("missing data");
        }
      } catch (err) {
        console.log("rejected", err);
        rej(err);
      }
    });
  }
}

export default new FirebaseService();
