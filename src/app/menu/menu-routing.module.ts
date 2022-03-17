import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteRoutingModule } from '../vente/vente-routing.module';
import { LienComponent } from './lien/lien.component';

import { MenuComponent } from './menu.component';

const routes: Routes = [{
  path: '', component: MenuComponent, children: [
    {
      path: 'accueil', component: LienComponent
    },
    
    { path: 'vente', loadChildren: () => import('./../vente/vente.module').then(m => m.VenteModule) },
    { path: 'achat/:id', loadChildren: () => import('./../achat/achat.module').then(m => m.AchatModule) },
    { path: 'config', loadChildren: () => import('./../config/config.module').then(m => m.ConfigModule) },
    { path: 'caisse', loadChildren: () => import('./../config/caisse/caisse.module').then(m => m.CaisseModule) },
    { path: 'config/categorie', loadChildren: () => import('./../config/categorie/categorie.module').then(m => m.CategorieModule) },
    { path: 'config/produit', loadChildren: () => import('./../config/produit/produit.module').then(m => m.ProduitModule) },
    { path: 'config/utilisateur', loadChildren: () => import('./../config/utilisateur/utilisateur.module').then(m => m.UtilisateurModule) },
    { path: 'config/caisse', loadChildren: () => import('./../config/caisse/caisse.module').then(m => m.CaisseModule) },
    { path: 'config/balance', loadChildren: () => import('./../config/balance/balance.module').then(m => m.BalanceModule) }, 
    { path: 'config/prix',    loadChildren: () => import('./../config/prix/prix.module').then(m => m.PrixModule) },
    { path: 'config/ajouter-produit/:id', loadChildren: () => import('./../config/ajouter-produit/ajouter-produit.module').then(m => m.AjouterProduitModule) },
    { path: 'config/ajouter-utilisateur', loadChildren: () => import('./../config/ajouter-utilisateur/ajouter-utilisateur.module').then(m => m.AjouterUtilisateurModule) },
    { path: 'config/ajouter-balance', loadChildren: () => import('./../config/ajouter-ballance/ajouter-ballance.module').then(m => m.AjouterBallanceModule) },
    { path: 'lister_achat', loadChildren: () => import('./../achat/lister/lister.module').then(m => m.ListerModule) },
    { path: 'config/tickets', loadChildren: () => import('./../config/tickets/tickets.module').then(m => m.TicketsModule) },
    { path: 'config/factures', loadChildren: () => import('./../config/facture/facture.module').then(m => m.FactureModule) },
    { path: 'config/statistique', loadChildren: () => import('./../config/statistique/statistique.module').then(m => m.StatistiqueModule) },
    { path: 'config/donnees', loadChildren: () => import('./../config/donnees/donnees.module').then(m => m.DonneesModule) },

  ]
}]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
