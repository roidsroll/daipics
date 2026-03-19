// lib/indexeddb.ts

const DB_NAME = 'daiPicsDB';
const DB_VERSION = 1;
const CART_STORE_NAME = 'cart';

export interface CartItem {
  itemId: string | number;
  title: string;
  src: string;
  quantity: number; // Added quantity
}

let db: IDBDatabase;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const target = event.target as IDBOpenDBRequest;
      const db = target.result;
      if (!db.objectStoreNames.contains(CART_STORE_NAME)) {
        db.createObjectStore(CART_STORE_NAME, { keyPath: 'itemId' });
      }
    };

    request.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest;
      db = target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      const target = event.target as IDBOpenDBRequest;
      console.error('IndexedDB error:', target.error);
      reject(target.error);
    };
  });
}

export async function addItemToCart(item: CartItem): Promise<void> {
  if (!db) {
    db = await openDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CART_STORE_NAME);
    
    // Check if item already exists
    const getRequest = store.get(item.itemId);
    
    getRequest.onsuccess = () => {
      const existingItem = getRequest.result as CartItem | undefined;
      if (existingItem) {
        // Increment quantity with fallback for existing items without quantity
        const currentQty = existingItem.quantity || 0;
        existingItem.quantity = currentQty + (item.quantity || 1);
        store.put(existingItem);
      } else {
        // Add new item with default quantity if not provided
        if (!item.quantity) item.quantity = 1;
        store.put(item);
      }
    };

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event) => {
      const target = event.target as IDBTransaction;
      console.error('Transaction error adding item to cart:', target.error);
      reject(target.error);
    };
  });
}

export async function getCartItems(): Promise<CartItem[]> {
  if (!db) {
    db = await openDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CART_STORE_NAME], 'readonly');
    const store = transaction.objectStore(CART_STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (event) => {
      const target = event.target as IDBRequest;
      console.error('Error getting cart items:', target.error);
      reject(target.error);
    };
  });
}

export async function updateItemQuantityInCart(itemId: string | number, quantity: number): Promise<void> {
  if (!db) {
    db = await openDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CART_STORE_NAME);

    if (quantity <= 0) {
      store.delete(itemId); // Remove item if quantity is 0 or less
    } else {
      const getRequest = store.get(itemId);
      getRequest.onsuccess = () => {
        const existingItem = getRequest.result as CartItem | undefined;
        if (existingItem) {
          existingItem.quantity = quantity;
          store.put(existingItem);
        }
      };
    }

    transaction.oncomplete = () => {
      resolve();
    };

    transaction.onerror = (event) => {
      const target = event.target as IDBTransaction;
      console.error('Transaction error updating item quantity in cart:', target.error);
      reject(target.error);
    };
  });
}

export async function removeItemFromCart(itemId: string | number): Promise<void> {
  if (!db) {
    db = await openDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CART_STORE_NAME);
    const request = store.delete(itemId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      const target = event.target as IDBRequest;
      console.error('Error removing item from cart:', target.error);
      reject(target.error);
    };
  });
}

export async function clearCart(): Promise<void> {
  if (!db) {
    db = await openDB();
  }
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([CART_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(CART_STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      const target = event.target as IDBRequest;
      console.error('Error clearing cart:', target.error);
      reject(target.error);
    };
  });
}
