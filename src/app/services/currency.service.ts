import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Network } from '@capacitor/network';
import { OfflineDataService } from './offline-data.service';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  private apiKey = 'CHAVE_API';
  private baseUrl = `https://v6.exchangerate-api.com/v6/${this.apiKey}`;

  constructor(
    private http: HttpClient,
    private offlineDataService: OfflineDataService
  ) { }

  getCurrencies(): Observable<any> {
    const url = `${this.baseUrl}/codes`;
    return this.http.get(url).pipe(
      catchError(error => {
        console.error('Erro ao buscar códigos de moedas da API:', error);
        return throwError(() => new Error('Não foi possível carregar a lista de moedas. Verifique sua conexão.'));
      })
    );
  }

  getExchangeRate(fromCurrency: string, toCurrency: string): Observable<any> {
    const apiCallUrl = `${this.baseUrl}/pair/${fromCurrency}/${toCurrency}`;
    const storageKey = `exchange_rate_${fromCurrency}_${toCurrency}`;
    const MAX_CACHE_AGE_MS = 1000 * 60 * 60 * 24;

    return new Observable(observer => {
      Network.getStatus().then(status => {
        if (status.connected) {
          console.log('Online: Tentando buscar taxa da API...');
          this.http.get(apiCallUrl)
            .pipe(
              tap((response: any) => {
                if (response.result === 'success') {
                  this.offlineDataService.set(storageKey, {
                    rate: response.conversion_rate,
                    timestamp: Date.now()
                  });
                  console.log(`Taxa ${fromCurrency}/${toCurrency} salva no cache.`);
                }
              }),
              catchError(apiError => {
                console.warn('Erro ao buscar taxa da API (online), tentando cache...', apiError);
                return this.getRateFromCache(storageKey);
              })
            )
            .subscribe(
              apiResponse => {
                observer.next(apiResponse);
                observer.complete();
              },
              error => {
                observer.error(error);
              }
            );
        } else {
          console.log('Offline: Tentando buscar taxa do cache...');
          this.getRateFromCache(storageKey).then(cachedData => {
            if (cachedData) {
              observer.next({ result: 'success', conversion_rate: cachedData.rate, fromCache: true });
              observer.complete();
            } else {
              observer.error(new Error('Offline e sem taxas armazenadas para esta conversão.'));
            }
          }).catch(cacheError => {
            console.error('Erro ao acessar o cache offline:', cacheError);
            observer.error(new Error('Erro ao acessar o armazenamento local offline.'));
          });
        }
      });
    });
  }

  private async getRateFromCache(storageKey: string): Promise<{ rate: number, timestamp: number } | null> {
    const cachedData = await this.offlineDataService.get(storageKey);
    if (cachedData && cachedData.rate && cachedData.timestamp) {

        console.log(`Taxa ${storageKey} encontrada no cache.`);
        return cachedData;

    }
    return null;
  }

  async clearExchangeRateCache() {
    const keys = await this.offlineDataService.clear();
    console.log('Cache de taxas de câmbio limpo.');
  }
}