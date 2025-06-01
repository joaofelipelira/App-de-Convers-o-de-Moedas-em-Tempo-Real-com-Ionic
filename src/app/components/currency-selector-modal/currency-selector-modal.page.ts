import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-currency-selector-modal',
  templateUrl: './currency-selector-modal.page.html',
  styleUrls: ['./currency-selector-modal.page.scss'],
  standalone: false 
})
export class CurrencySelectorModalPage {

  @Input() allCurrencies: any[] = [];
  @Input() currentSelectedCurrency: string = '';

  filteredCurrencies: any[] = [];
  searchTerm: string = '';

  private currencyToCountryMap: { [key: string]: string } = {
    'USD': 'US', 'BRL': 'BR', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP',
    'CAD': 'CA', 'AUD': 'AU', 'CHF': 'CH', 'CNY': 'CN', 'SEK': 'SE',
    'NZD': 'NZ', 'MXN': 'MX', 'SGD': 'SG', 'HKD': 'HK', 'NOK': 'NO',
    'KRW': 'KR', 'TRY': 'TR', 'RUB': 'RU', 'INR': 'IN', 'ZAR': 'ZA',
  };

  constructor(private modalController: ModalController) {}

  ionViewWillEnter() {
    this.filteredCurrencies = [...this.allCurrencies];
  }

  filterItems(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    if (this.searchTerm === '') {
      this.filteredCurrencies = [...this.allCurrencies];
    } else {
      this.filteredCurrencies = this.allCurrencies.filter(currency => {
        const code = currency[0].toLowerCase();
        const name = currency[1].toLowerCase();
        return code.includes(this.searchTerm) || name.includes(this.searchTerm);
      });
    }
  }

  selectCurrency(currency: any) {
    this.modalController.dismiss(currency[0]);
  }

  cancel() {
    this.modalController.dismiss(null);
  }

  getFlagUrl(currencyCode: string): string {
    const countryCode = this.currencyToCountryMap[currencyCode] || currencyCode.substring(0, 2);
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }
}