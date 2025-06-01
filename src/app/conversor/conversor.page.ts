import { Component, OnInit } from '@angular/core';
import { CurrencyService } from '../services/currency.service';
import { HistoryService } from '../services/history.service';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { CurrencySelectorModalPage } from '../components/currency-selector-modal/currency-selector-modal.page';
import { Network } from '@capacitor/network';

@Component({
  selector: 'app-conversor',
  templateUrl: './conversor.page.html',
  styleUrls: ['./conversor.page.scss'],
  standalone: false
})
export class ConversorPage implements OnInit {

  currencies: any[] = [];
  fromCurrency: string = 'USD';
  toCurrency: string = 'BRL';
  amount: number = 1;
  convertedAmount: number | null = null;
  rate: number | null = null;
  isLoadingCurrencies: boolean = true;
  isOnline: boolean = true;

  private currencyToCountryMap: { [key: string]: string } = {
    'USD': 'US', 'BRL': 'BR', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP',
    'CAD': 'CA', 'AUD': 'AU', 'CHF': 'CH', 'CNY': 'CN', 'SEK': 'SE',
    'NZD': 'NZ', 'MXN': 'MX', 'SGD': 'SG', 'HKD': 'HK', 'NOK': 'NO',
    'KRW': 'KR', 'TRY': 'TR', 'RUB': 'RU', 'INR': 'IN', 'ZAR': 'ZA',
  };

  constructor(
    private currencyService: CurrencyService,
    private historyService: HistoryService,
    private loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.loadCurrencies();
    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
      if (this.isOnline) {
        this.presentToast('Você está online!', 'success', 2000);
      } else {
        this.presentToast('Você está offline.', 'warning', 2000);
      }
    });
    Network.getStatus().then(status => {
      this.isOnline = status.connected;
    });
  }

  loadCurrencies() {
    this.isLoadingCurrencies = true;
    this.currencyService.getCurrencies().subscribe(
      (data) => {
        if (data.result === 'success') {
          this.currencies = data.supported_codes;
          console.log('Moedas carregadas:', this.currencies);
        } else {
          console.error('Erro ao carregar moedas:', data.result);
          this.presentToast('Erro ao carregar lista de moedas. Tente novamente mais tarde.', 'danger');
        }
        this.isLoadingCurrencies = false;
      },
      (error) => {
        console.error('Erro na requisição de moedas:', error);
        this.presentToast('Não foi possível carregar as moedas. Verifique sua conexão.', 'danger');
        this.isLoadingCurrencies = false;
      }
    );
  }

  onInputChange() {
    this.convertedAmount = null;
    this.rate = null;
  }

  async convertCurrency() {
    console.log('--- Tentando converter ---');
    console.log('fromCurrency:', this.fromCurrency);
    console.log('toCurrency:', this.toCurrency);
    console.log('amount:', this.amount);

    if (this.amount <= 0) {
      this.presentToast('Por favor, insira um valor positivo para a conversão.', 'warning');
      this.convertedAmount = null;
      this.rate = null;
      return;
    }

    if (this.fromCurrency && this.toCurrency && this.amount) {
      const loading = await this.loadingController.create({
        message: 'Convertendo...'
      });
      await loading.present();

      this.currencyService.getExchangeRate(this.fromCurrency, this.toCurrency).subscribe(
        (data) => {
          loading.dismiss();
          if (data.result === 'success') {
            this.rate = data.conversion_rate;
            if (this.rate !== null) {
              this.convertedAmount = this.amount * this.rate;

              this.historyService.addConversion({
                from: this.fromCurrency,
                to: this.toCurrency,
                amount: this.amount,
                convertedAmount: this.convertedAmount,
                rate: this.rate,
                isOffline: data.fromCache || false
              });

              if (data.fromCache) {
                this.presentToast('Conversão offline: Usando últimas taxas disponíveis.', 'secondary');
              } else {
                this.presentToast('Conversão realizada com sucesso!', 'success');
              }

            } else {
              this.convertedAmount = null;
              this.presentToast('Não foi possível obter a taxa de câmbio.', 'warning');
            }
            console.log(`Conversão: ${this.amount} ${this.fromCurrency} = ${this.convertedAmount} ${this.toCurrency} (Taxa: ${this.rate})`);
          } else {
            console.error('Erro ao converter:', data.message || data.result);
            this.convertedAmount = null;
            this.rate = null;
            this.presentToast(`Erro ao converter: ${data.message || data.result}.`, 'danger');
          }
        },
        (error) => {
          loading.dismiss();
          console.error('Erro na requisição de conversão:', error);
          this.convertedAmount = null;
          this.rate = null;
          let errorMessage = 'Ocorreu um erro. Verifique sua conexão com a internet e tente novamente.';
          if (error && error.message) {
            errorMessage = error.message;
          }
          this.presentToast(errorMessage, 'danger');
        }
      );
    } else {
      this.convertedAmount = null;
      this.rate = null;
      if (this.amount <= 0) {
        this.presentToast('Por favor, insira um valor positivo para a conversão.', 'warning');
      } else {
        this.presentToast('Por favor, selecione as moedas e digite um valor para converter.', 'warning');
      }
      console.warn('Por favor, selecione as moedas e digite um valor para converter.');
    }
  }

  swapCurrencies() {
    const temp = this.fromCurrency;
    this.fromCurrency = this.toCurrency;
    this.toCurrency = temp;
    this.onInputChange();
  }

  getFlagUrl(currencyCode: string): string {
    const countryCode = this.currencyToCountryMap[currencyCode] || currencyCode.substring(0, 2);
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }

  getCurrencyName(currencyCode: string): string {
    const currency = this.currencies.find(c => c[0] === currencyCode);
    return currency ? currency[1] : '';
  }

  async openCurrencySelectorModal(field: 'from' | 'to') {
    const modal = await this.modalController.create({
      component: CurrencySelectorModalPage,
      componentProps: {
        allCurrencies: this.currencies,
        currentSelectedCurrency: field === 'from' ? this.fromCurrency : this.toCurrency
      }
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'backdrop' || data === null) {
      console.log('Seleção de moeda cancelada.');
    } else {
      if (field === 'from') {
        if (data === this.toCurrency) {
          this.swapCurrencies();
          console.log('Moeda de origem igual à de destino. Auto-troca realizada.');
        } else {
          this.fromCurrency = data;
        }
      } else {
        if (data === this.fromCurrency) {
          this.swapCurrencies();
          console.log('Moeda de destino igual à de origem. Auto-troca realizada.');
        } else {
          this.toCurrency = data;
        }
      }
      this.onInputChange();
    }
  }

  async presentToast(message: string, color: string = 'primary', duration: number = 3000) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration,
      position: 'bottom',
      color: color,
      buttons: [
        {
          text: 'Fechar',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}