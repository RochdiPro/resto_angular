import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = `http://41.228.33.200:3335/`;

 
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http: HttpClient) {
  }
  //Obtenir liste des categorie
  categories(): Observable<any> {
    return this.http.get(infonet + 'Categories', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //Obtenir liste des unite
  unites(): Observable<any> {
    return this.http.get(infonet + 'Unites', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //Obtenir liste des imprimante
  imprimantes(): Observable<any> {
    return this.http.get(infonet + 'Imprimantes', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //Obtenir liste des balance
  balances(): Observable<any> {
    return this.http.get(infonet + 'Balances', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //Obtenir un balance avec id
  balance(id: any): Observable<any> {
    return this.http.get(infonet + 'Balance', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //Obtenir un caisse avec id
  caisse(id: any): Observable<any> {
    return this.http.get(infonet + 'Caisse', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //Obtenir un caisse avec id
  imprimante(id: any): Observable<any> {
    return this.http.get(infonet + 'Imprimante', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //Obtenir liste des Caisse
  caisses(): Observable<any> {
    return this.http.get(infonet + 'Caisses', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //Obtenir liste des produits
  Produits(): Observable<any> {
    return this.http.get(infonet + 'Produits', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //filtre produit par code a barre 
  produit_code_barre(code: any) {
    return this.http.get(infonet + 'Produit_Par_Code_Barre', {
      params: {
        Code: code
      }, observe: 'body'
    }).pipe()
  }

  //Supprimer produit
  supprimer_produit(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Produit/', {
      params: {
        Id_Produit: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }

  //Obtenir un Produit avec id
  produit(id: any): Observable<any> {
    return this.http.get(infonet + 'Produit', {
      params: {
        Id_Produit: id
      }, observe: 'body'
    }).pipe()
  }

  //Obtenir un unite avec id
  unite(id: any): Observable<any> {
    return this.http.get(infonet + 'Unite', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }
  //Obtenir liste des utilisateurs
  utilisateurs(): Observable<any> {
    return this.http.get(infonet + 'Utilisateurs', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  // lister les achats 
  achats(): Observable<any> {
    return this.http.get(infonet + 'Achats', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  // get un achat avec id
  achat(id: any): Observable<any> {
    return this.http.get(infonet + 'Achat', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //Ajouter unite
  ajouter_unite(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Unite", form);
  }

  //Ajouter imprimante
  ajouter_imprimante(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Imprimante", form);
  }
  //Ajouter balance
  ajouter_balance(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Balance", form);
  }
  //Ajouter caisse
  ajouter_caisse(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Caisse", form);
  }

  //Modifier unite
  modifier_unite(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Unite', form);
  }
  //Modifier caisse
  modifier_caisse(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Caisse', form);
  }
  //Modifier balance
  modifier_balance(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Balance', form);
  }
  //Modifier imprimante
  modifier_imprimante(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Imprimante', form);
  }

  //Supprimer unite
  supprimer_unite(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Unite/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }

  //Supprimer Caisse
  supprimer_caisse(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Caisse/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //Supprimer balance
  supprimer_balance(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Balance/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //Supprimer unite
  supprimer_imprimante(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Imprimante/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //Supprimer achat
  supprimer_achat(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Achat/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }

  //Ajouter categorie
  ajouter_categorie(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Categorie", form);
  }

  //Ajouter utilisateur
  ajouter_utilisateur(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Utilisateur", form);
  }
  //Supprimer utilisateur
  supprimer_utilisateur(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Utilisateur/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //Modifier categorie
  modifier_utilisateur(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Utilisateur', form);
  }

  //Obtenir un Utilisateur avec id
  utilisateur(id: any): Observable<any> {
    return this.http.get(infonet + 'Utilisateur', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //Modifier categorie
  modifier_categorie(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Categorie', form);
  }
  //Supprimer categorie
  supprimer_categorie(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Categorie/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //Ajouter produit
  ajouter_produit(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Produit", form);
  }

  //modifier produit avec id
  modifier_produit(form: any): Observable<Object> {
    return this.http.post(infonet + "/Modifier_Produit_Struct", form);
  }

  //Modifier prix du produit
  modifier_prix(form: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Prix', form);
  }
  // filtre produit 
  filtre_produit(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any, champ4: any, valeur4: any, champ5: any, valeur5: any) {
    return this.http.get(infonet + 'Filtre_Produit', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,
        Champ5: champ5,
        Valeur5: valeur5,

      }, observe: 'body'
    }).pipe()

  }


  // filtre utilisateur 
  filtre_utilisateur(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any) {
    return this.http.get(infonet + 'Filtre_Utilisateur', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,

      }, observe: 'body'
    }).pipe()

  }


  // filtre achat
  filtre_achat(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any, champ4: any, valeur4: any, champ5: any, valeur5: any) {
    return this.http.get(infonet + 'Filtre_Achat', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,
        Champ5: champ5,
        Valeur5: valeur5,

      }, observe: 'body'
    }).pipe()

  }

  //Ajouter achat
  ajouter_achat(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Achat", form);
  }

  //modifier achat
  modifier_achat(form: any): Observable<Object> {
    return this.http.post(infonet + "/Modifier_Achat", form);
  }

  //VAlider - achat 
  valider_achat(id: any): Observable<Object> {
    return this.http.get(infonet + 'Entree', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //recuperer détails Achat
  Detail_achat(id: any): Observable<any> {

    return this.http.get(infonet + 'Detail_Achat/'
      , {
        params: {
          Id: id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError()))

  }


  //recuperer détails Achat
  image_produit(id: any): Observable<any> {

    return this.http.get(infonet + 'Produit_Image/'
      , {
        params: {
          Id_Produit: id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError()))

  }


  //verifier le id et pwd pour utilisateur si true return un user 
  connexion(id: any, pwd: any): Observable<any> {
    return this.http.get(infonet + 'Connexion_Utilisateur', {
      params: {
        Identifiant: id,
        Mot_de_passe: pwd
      }, observe: 'body'
    }).pipe()
  }

  // lister les tva 
  tvas(): Observable<any> {
    return this.http.get(infonet + 'Tvas', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //Ajouter tva
  ajouter_tva(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Tva", form);
  }

  //Supprimer tva
  supprimer_tva(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Tva/', {
      params: {
        Id: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }


  //Ajouter vente
  ajouter_vente(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Vente", form);
  }

  //modifier vente
  modifier_vente(form: any): Observable<Object> {
    return this.http.post(infonet + "/Modifier_Vente", form);
  }

  //recuperer détails Achat
  Detail_vente(id: any): Observable<any> {

    return this.http.get(infonet + 'Detail_Vente/'
      , {
        params: {
          Id: id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError()))

  }


  //VAlider - achat 
  valider_vente(id: any): Observable<Object> {
    return this.http.get(infonet + 'Sortie_Vente', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }


  // lister les ventes 
  ventes(): Observable<any> {
    return this.http.get(infonet + 'Ventes', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }


  // get un vente avec id
  vente(id: any): Observable<any> {
    return this.http.get(infonet + 'Vente', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  //Obtenir liste des  Session_Caisse
  Session_Caisses(): Observable<any> {
    return this.http.get(infonet + 'Session_Caisses', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  //modifier Session_Caisses
  modifier_Session_Caisses(form: any): Observable<Object> {
    return this.http.post(infonet + "/Modifier_Session_Caisse", form);
  }


  //Ajouter Session_Caisses
  ajouter_Session_Caisses(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Session_Caisse", form);
  }

  //facturation de ticket
  facturation(form: any): Observable<Object> {
    return this.http.post(infonet + "/Facture_Vente", form);
  }


  //abondonner   ticket
  abondonner(id: any): Observable<Object> {
    return this.http.get(infonet + 'Abondoner_Vente', {
      params: {
        Id: id,
      }, observe: 'body'
    }).pipe()
  }

  // fermer le seesion avec id 
  fermer_Session_Caisses(form: any): Observable<Object> {
    return this.http.post(infonet + "/Fermer_Session_Caisse", form);
  }

  fermer_tous_Session_Caisses(id: any) {
    var formData: any = new FormData();
    formData.append('Utilisateur', id);
    return this.http.post(infonet + 'Fermer_Tous_Session', formData);

  }

  // ajout solde en session depuis un vente
  Ajouter_solde_Session_Caisses(form: any): Observable<Object> {
    return this.http.post(infonet + "/Solde_Session_Caisse", form);
  }

  // filtre vente 
  filtre_vente(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any, champ4: any, valeur4: any) {
    return this.http.get(infonet + 'Filtre_Vente', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,

      }, observe: 'body'
    }).pipe()

  }

  // filtre vente 
  filtre_vente_facture(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any, champ4: any, valeur4: any) {
    return this.http.get(infonet + 'Filtre_Vente_Facture', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,

      }, observe: 'body'
    }).pipe()

  }

  // filtre session caisse 
  filtre_session(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any, champ4: any, valeur4: any) {
    return this.http.get(infonet + 'Filtre_Session_Caisse', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,
      }, observe: 'body'
    }).pipe()

  }

  // check session ouvert 
  session_par_caisse(champ1: any, valeur1: any, champ2: any, valeur2: any) {
    return this.http.get(infonet + 'Session_Par_Caisse', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,

      }, observe: 'body'
    }).pipe()

  }


  //imprimer ticket
  imprimer(id: any, caisse: any): Observable<Object> {
    return this.http.get(infonet + 'Imprime_ticket', {
      params: {
        Id: id,
        Caisse: caisse,
      }, observe: 'body'
    }).pipe()
  }


  // vente par utilisateur 
  vente_utilisateur() {
    return this.http.get(infonet + 'Vente_Utilisateur', {
      observe: 'body'
    }).pipe()
  }
  // vente par mois 
  vente_mois() {
    return this.http.get(infonet + 'Vente_Mois', {
      observe: 'body'
    }).pipe()

  }
  // vente par année
  vente_annee() {
    return this.http.get(infonet + 'Vente_Annee', {
      observe: 'body'
    }).pipe()

  }
  // vente par mois en  année x
  get_vente_anne(id: any) {
    return this.http.get(infonet + 'Vente_Mois_Annee', {
      params: {
        Id: id,
      }, observe: 'body'
    }).pipe()
  }

  // vente par utilisateur en anne  x
  get_utilisateur_annee(id: any) {
    return this.http.get(infonet + 'Vente_Utilisateur_Annee', {
      params: {
        Id: id,
      }, observe: 'body'
    }).pipe()
  }

  // mise a jour variable balance 
  mettre_a_jour() {
    return this.http.post(infonet + 'Mettre_a_jour', {
      observe: 'body'
    }).pipe()
  }

  // get_somme des ticket non facture  
  get_somme_ticket_non_facture() {
    return this.http.post(infonet + 'Get_Somme_Facture', {
      observe: 'body'
    }).pipe()
  }

  // Facturation des ticket non facture  
  Facturation() {
    return this.http.post(infonet + 'Facturation', {
      observe: 'body'
    }).pipe()
  }

  // lister les facture  
  factures() {
    return this.http.get(infonet + 'Factures', {
      observe: 'body'
    }).pipe()
  }

  //Obtenir un facture avec id
  facture(id: any): Observable<any> {
    return this.http.get(infonet + 'Facture', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

  // obtenire la liste des ticket en facture systeme
  groupe_facture_ticket(id: any) {
    return this.http.get(infonet + 'groupe_facture_ticket', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe()
  }

// reset les valeur utilisateur
Init_Utilisateur( ) {
  return this.http.post(infonet + 'Init_Utilisateur', {
    observe: 'body'
  }).pipe()
}
 

  // execice comptable 
  execice  (form: any): Observable<Object> {
      return this.http.post(infonet + "/Exercice", form);
    }
 
 

  
  // filtre facture avec 3 champs 
  filtre_facture(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any) {
    return this.http.get(infonet + 'Filtre_Facture', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3, 

      }, observe: 'body'
    }).pipe()
  }


  // importer donnees de base de données 
  importer(  form:any) { 
    return this.http.post(infonet + "/Importer", form);
   }

  // exporter donnees de base de données 
  exporter(id: any) {
     let authKey = localStorage.getItem('jwt_token');
    const httpOptions = {
      responseType: 'blob' as 'json',
      
    };  
    return this.http.get(infonet+'/Exporter', httpOptions);
  }



  // last id facture
  id_facture( ) {
    return this.http.get(infonet + 'id_facture'  ).pipe()
  }
  id_vente( ) {
    return this.http.get(infonet + 'id_vente'  ).pipe()
  }
  id_achat( ) {
    return this.http.get(infonet + 'id_achat'  ).pipe()
  }


  //jounall 
   //Ajouter achat
   ajouter_action(form: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Journal", form);
  }

  //Message d'erreur
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
