import { initializeApp, getApps } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { products } from "../src/data/products";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function migrate() {
  console.log(`Starting migration of ${products.length} products...`);
  let count = 0;
  for (const product of products) {
    try {
      await setDoc(doc(db, "products", product.id), product);
      console.log(`Migrated: ${product.name}`);
      count++;
    } catch (error) {
      console.error(`Error migrating ${product.name}:`, error);
    }
  }
  console.log(`Successfully migrated ${count} products.`);
  process.exit(0);
}

migrate();
