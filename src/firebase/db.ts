import { addDoc, collection, getDocs, getFirestore } from "firebase/firestore/";

import { FirebaseApp } from "./config";

const firestoreDB = getFirestore(FirebaseApp);

const dataPoint = <T>(collectionPath: string) => {
  const collectionRef = collection(
    firestoreDB,
    collectionPath
  ).withConverter<T>({
    toFirestore: (data: T) => data,
    fromFirestore: (snap) => snap.data() as T,
  });

  return {
    add: async (data: T) => addDoc(collectionRef, data),
    get: async () => getDocs(collectionRef),
    collectionRef,
  };
};

interface UserContracts {
  id: string;
  name: string;
  xml: string;
}

const db = {
  userContracts: (userId: string) =>
    dataPoint<UserContracts>(`user/${userId}/contract`),
};

export { db };
export default db;
