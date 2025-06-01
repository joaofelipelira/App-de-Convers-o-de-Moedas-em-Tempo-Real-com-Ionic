import { Component, OnInit } from '@angular/core';
import { HistoryService } from '../services/history.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: false
})
export class HistoricoPage implements OnInit {
  conversions: any[] = [];

  private currencyToCountryMap: { [key: string]: string } = {
    'USD': 'US', 'BRL': 'BR', 'EUR': 'EU', 'GBP': 'GB', 'JPY': 'JP',
    'CAD': 'CA', 'AUD': 'AU', 'CHF': 'CH', 'CNY': 'CN', 'SEK': 'SE',
    'NZD': 'NZ', 'MXN': 'MX', 'SGD': 'SG', 'HKD': 'HK', 'NOK': 'NO',
    'KRW': 'KR', 'TRY': 'TR', 'RUB': 'RU', 'INR': 'IN', 'ZAR': 'ZA',

  };

  constructor(
    private historyService: HistoryService,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.loadHistory();
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  loadHistory() {
    this.conversions = this.historyService.getConversions().reverse();
  }

  getFlagUrl(currencyCode: string): string {
    const countryCode = this.currencyToCountryMap[currencyCode] || currencyCode.substring(0, 2);
    return `https://flagcdn.com/w20/${countryCode.toLowerCase()}.png`;
  }

  async clearHistory() {
    const alert = await this.alertController.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza de que deseja limpar todo o histórico de conversões?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Limpar',
          handler: () => {
            this.historyService.clearHistory();
            this.conversions = [];
          }
        }
      ]
    });

    await alert.present();
  }
}