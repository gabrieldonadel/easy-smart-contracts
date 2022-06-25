import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getFirestore,
  UpdateData,
} from "firebase/firestore/";

import { FirebaseApp } from "./config";

const firestoreDB = getFirestore(FirebaseApp);

const collectionDataPoint = <T>(collectionPath: string) => {
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

const docDataPoint = <T>(docPath: string) => {
  const docRef = doc(firestoreDB, docPath).withConverter<T>({
    toFirestore: (data: T) => data,
    fromFirestore: (snap) => snap.data() as T,
  });

  return {
    get: async () => getDoc(docRef),
    update: async (data: UpdateData<T>) => updateDoc(docRef, data),
    delete: async () => deleteDoc(docRef),
    docRef,
  };
};

export const getGroceryList = (groceryListId) => {
  const groceryDocRef = doc(firestoreDB, "groceryLists", groceryListId);
  return getDoc(groceryDocRef);
};

export interface UserContracts {
  name: string;
  xml: string;
}

const db = {
  userContracts: (userId: string) =>
    collectionDataPoint<UserContracts>(`user/${userId}/contract`),
  userContract: (userId: string, contractId: string) =>
    docDataPoint<UserContracts>(`user/${userId}/contract/${contractId}`),
};

export { db };
export default db;
