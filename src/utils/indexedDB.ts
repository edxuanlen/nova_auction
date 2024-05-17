export interface BlockData {
    blockNumber: number;
    unionKeyPath: string;
    data: any[];
}

export class IndexedDBHelper {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null;

    static ApyHistory: string = "ApyHistory";
    static DividendHistory: string = "DividendHistory";
    static BidHistory: string = "BidHistory";

    constructor(dbName: string, storeName: string) {
        this.dbName = dbName;
        this.storeName = storeName;
        this.db = null;
    }

    open(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, 1);

            request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
                this.db = request.result;
                if (!this.db.objectStoreNames.contains(IndexedDBHelper.ApyHistory)) {
                    this.db.createObjectStore(IndexedDBHelper.ApyHistory, {
                        keyPath: ['blockNumber', 'unionKeyPath'],
                    });
                }
                if (!this.db.objectStoreNames.contains(IndexedDBHelper.DividendHistory)) {
                    this.db.createObjectStore(IndexedDBHelper.DividendHistory, {
                        keyPath: ['blockNumber', 'unionKeyPath']
                    });
                }
                if (!this.db.objectStoreNames.contains(IndexedDBHelper.BidHistory)) {
                    this.db.createObjectStore(IndexedDBHelper.BidHistory, {
                        keyPath: ['blockNumber', 'unionKeyPath']
                    });
                }
            };

            request.onsuccess = (event: Event) => {
                this.db = request.result;
                resolve();
            };

            request.onerror = (event: Event) => {
                console.error("IndexedDB error:", request.error);
                reject(request.error);
            };
        });
    }

    addData(data: BlockData): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database has not been initialized');
                return;
            }
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.add(data);

            request.onsuccess = () => resolve();
            request.onerror = (e: Event) => {
                console.error("Error adding data to IndexedDB", request.error);
                reject(request.error);
            };
        });
    }

    getAllData(): Promise<BlockData[]> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database has not been initialized');
                return;
            }
            const transaction = this.db.transaction(this.storeName, "readonly");
            const store = transaction.objectStore(this.storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result as BlockData[]);
            request.onerror = (e: Event) => {
                console.error("Error reading data from IndexedDB", request.error);
                reject(request.error);
            };
        });
    }

    clear(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject('Database has not been initialized');
                return;
            }
            const transaction = this.db.transaction(this.storeName, "readwrite");
            const store = transaction.objectStore(this.storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = (e: Event) => {
                console.error("Error clearing data from IndexedDB", request.error);
                reject(request.error);
            };
        });
    }

}
