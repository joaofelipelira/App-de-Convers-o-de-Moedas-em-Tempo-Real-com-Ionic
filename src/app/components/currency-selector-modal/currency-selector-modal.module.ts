import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CurrencySelectorModalPageRoutingModule } from './currency-selector-modal-routing.module';

import { CurrencySelectorModalPage } from './currency-selector-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencySelectorModalPageRoutingModule
  ],
  declarations: [CurrencySelectorModalPage]
})
export class CurrencySelectorModalPageModule {}
