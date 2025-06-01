import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConversorPageRoutingModule } from './conversor-routing.module';

import { ConversorPage } from './conversor.page';
import { CurrencySelectorModalPageModule } from '../components/currency-selector-modal/currency-selector-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConversorPageRoutingModule,
    CurrencySelectorModalPageModule
  ],
  declarations: [ConversorPage],
})
export class ConversorPageModule {}