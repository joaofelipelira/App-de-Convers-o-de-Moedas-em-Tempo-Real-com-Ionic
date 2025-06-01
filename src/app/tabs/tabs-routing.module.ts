import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'conversor',
        loadChildren: () => import('../conversor/conversor.module').then(m => m.ConversorPageModule)
      },
      {
        path: 'historico',
        loadChildren: () => import('../historico/historico.module').then(m => m.HistoricoPageModule)
      },
      {
        path: '',
        redirectTo: '/tabs/conversor',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/conversor',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}