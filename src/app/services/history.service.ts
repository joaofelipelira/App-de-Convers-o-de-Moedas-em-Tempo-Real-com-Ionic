import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {
  private HISTORY_KEY = 'conversion_history';

  constructor() { }

  addConversion(conversion: { from: string; to: string; amount: number; convertedAmount: number; rate: number; isOffline?: boolean }) {
    const currentHistory = this.getConversions();
    currentHistory.push({ ...conversion, timestamp: new Date().toISOString() });
    localStorage.setItem(this.HISTORY_KEY, JSON.stringify(currentHistory));
  }

  getConversions(): any[] {
    const history = localStorage.getItem(this.HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  }

  clearHistory() {
    localStorage.removeItem(this.HISTORY_KEY);
  }
}