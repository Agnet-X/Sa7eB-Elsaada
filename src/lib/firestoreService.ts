import { doc, getDoc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';
import { db } from './firebase';
import { Product, Order, Review, HeroVideo, ButcherVideo, OfferItem, StoreSettings } from '../types';

const STORE_DOC_PATH = 'store_state/main';

export interface StoreData {
  products: Product[];
  storeSettings: StoreSettings;
  heroVideos: HeroVideo[];
  galleryVideos: ButcherVideo[];
  offers: OfferItem[];
  orders: Order[];
  reviews: Review[];
}

/**
 * Subscribe to real-time updates from Firestore.
 * Returns an unsubscribe function to stop listening.
 */
export function subscribeToStoreData(
  onUpdate: (data: StoreData | null) => void,
  onError?: (error: Error) => void
): Unsubscribe {
  const storeDocRef = doc(db, STORE_DOC_PATH);

  return onSnapshot(
    storeDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as StoreData;
        onUpdate(data);
      } else {
        // Document doesn't exist yet
        onUpdate(null);
      }
    },
    (error) => {
      console.error('Firestore subscription error:', error);
      if (onError) onError(error);
    }
  );
}

/**
 * Fetch store data once (no real-time).
 * Useful for initial load or fallback.
 */
export async function fetchStoreData(): Promise<StoreData | null> {
  try {
    const storeDocRef = doc(db, STORE_DOC_PATH);
    const snapshot = await getDoc(storeDocRef);
    
    if (snapshot.exists()) {
      return snapshot.data() as StoreData;
    }
    return null;
  } catch (error) {
    console.error('Error fetching store data:', error);
    throw error;
  }
}

/**
 * Update store data (full document replacement).
 * Used by admin to save all changes.
 */
export async function updateStoreData(data: StoreData): Promise<void> {
  try {
    const storeDocRef = doc(db, STORE_DOC_PATH);
    await setDoc(storeDocRef, data, { merge: false });
  } catch (error) {
    console.error('Error updating store data:', error);
    throw error;
  }
}

/**
 * Update partial store data (merge specific fields).
 * Useful for updating only products, orders, settings, etc.
 */
export async function updatePartialStoreData(partialData: Partial<StoreData>): Promise<void> {
  try {
    const storeDocRef = doc(db, STORE_DOC_PATH);
    await setDoc(storeDocRef, partialData, { merge: true });
  } catch (error) {
    console.error('Error updating partial store data:', error);
    throw error;
  }
}

/**
 * Check if Firebase is configured.
 * Returns true if all required env vars are present.
 */
export function isFirebaseConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  );
}
