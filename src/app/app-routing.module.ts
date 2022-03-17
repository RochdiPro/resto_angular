import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
   { path: '', loadChildren: () => import('./connexion/connexion.module').then(m => m.ConnexionModule) },

  { path: 'connexion', loadChildren: () => import('./connexion/connexion.module').then(m => m.ConnexionModule) },
  { path: 'vente', loadChildren: () => import('./vente/vente.module').then(m => m.VenteModule) },
  { path: 'achat/:id', loadChildren: () => import('./achat/achat.module').then(m => m.AchatModule) },
  { path: 'lister_achat', loadChildren: () => import('./achat/lister/lister.module').then(m => m.ListerModule) },
  { path: 'config', loadChildren: () => import('./config/config.module').then(m => m.ConfigModule) },
  { path: 'config/produit', loadChildren: () => import('./config/produit/produit.module').then(m => m.ProduitModule) },
  { path: 'config/utilisateur', loadChildren: () => import('./config/utilisateur/utilisateur.module').then(m => m.UtilisateurModule) },
  { path: 'config/caisse', loadChildren: () => import('./config/caisse/caisse.module').then(m => m.CaisseModule) },
  { path: 'config/categorie', loadChildren: () => import('./config/categorie/categorie.module').then(m => m.CategorieModule) },
  { path: 'config/balance', loadChildren: () => import('./config/balance/balance.module').then(m => m.BalanceModule) }, 
  { path: 'config/prix',    loadChildren: () => import('./config/prix/prix.module').then(m => m.PrixModule) },
  { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.MenuModule) },
  { path: 'config/ajouter-produit/:id', loadChildren: () => import('./config/ajouter-produit/ajouter-produit.module').then(m => m.AjouterProduitModule) },
  { path: 'config/ajouter-utilisateur', loadChildren: () => import('./config/ajouter-utilisateur/ajouter-utilisateur.module').then(m => m.AjouterUtilisateurModule) },
  { path: 'config/ajouter-balance', loadChildren: () => import('./config/ajouter-ballance/ajouter-ballance.module').then(m => m.AjouterBallanceModule) },
   { path: 'config/tickets', loadChildren: () => import('./config/tickets/tickets.module').then(m => m.TicketsModule) },
   { path: 'config/facture', loadChildren: () => import('./config/facture/facture.module').then(m => m.FactureModule) },
   { path: 'config/statistique', loadChildren: () => import('./config/statistique/statistique.module').then(m => m.StatistiqueModule) },
   { path: 'config/donnees', loadChildren: () => import('./config/donnees/donnees.module').then(m => m.DonneesModule) },
 ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
