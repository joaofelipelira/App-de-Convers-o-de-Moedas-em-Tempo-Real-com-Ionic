import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class OfflineDataService {
  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any): Promise<any> {
    if (this._storage) {
      return await this._storage.set(key, value);
    }
    console.warn('OfflineDataService: Storage não inicializado.');
    return null;
  }

  public async get(key: string): Promise<any> {
    if (this._storage) {
      return await this._storage.get(key);
    }
    console.warn('OfflineDataService: Storage não inicializado.');
    return null;
  }

  public async remove(key: string): Promise<any> {
    if (this._storage) {
      return await this._storage.remove(key);
    }
    console.warn('OfflineDataService: Storage não inicializado.');
    return null;
  }

  public async clear(): Promise<void> {
    if (this._storage) {
      return await this._storage.clear();
    }
    console.warn('OfflineDataService: Storage não inicializado.');
  }
}