import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatKeyboardModule } from 'angular-onscreen-material-keyboard';
 import { ServiceService } from 'src/app/config/service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajouter-articles',
  templateUrl: './ajouter-articles.component.html',
  styleUrls: ['./ajouter-articles.component.scss']
})
export class AjouterArticlesComponent implements OnInit {
  keyWord: any = [];
  prouduits: any = [];
  fromPage: any;
  prodChecked: any = [];
  dsiable: boolean = true;
  Quantite: any = 1;
  line: any = {}
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  newAttribute: any = {}
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  Montant_Fodec: any = 0;
  Total_HT: any = 0;
  Ch_Globale: any = 0;
  Remise: any = 0;
  Prix: any = 0;
  Montant_TVA: any = 0;
  dataArticle: any;
  loading: boolean = true;
  prodInStock: any = [];
  champ: string = "Sélectionnez votre option";
  value: any;
  searchFilter: any = '';
  query: any;
  id: any = "";
  nom: any = "";
  prix: any;

  liste_categorie: any;
  liste_unite: any;
  @Output() prodEvent = new EventEmitter();
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;

  form: any = new FormGroup({
    id: new FormControl(""),
    nom: new FormControl(""),
    code: new FormControl(""),
    categorie: new FormControl(""),
    unite: new FormControl(""),
  });
  constructor(private Service: ServiceService, public dialogRef: MatDialogRef<AjouterArticlesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.get_categories();
    this.get_unites();
  }

  ngOnInit(): void {
    this.addProuduit();
  }


  // ajouter les articles   
  addProuduit() {
    this.loading = true;
    let prod: any = [];
    this.Service.Produits().subscribe((prod: any) => {
      this.loading = true;
      for (let i = 0; i < prod.length; i++) {
        this.newAttribute.qte = prod[i].qte
        this.newAttribute.id = prod[i].id;
        this.newAttribute.nom = prod[i].nom;
        this.newAttribute.code = prod[i].code_Barre;
        this.newAttribute.categorie = prod[i].categorie;
        this.newAttribute.tva = prod[i].tva;
        this.newAttribute.unite = prod[i].unite;
        this.newAttribute.prix = "0";
        this.newAttribute.prix_ttc = "0";
        this.newAttribute.total_ttc = "0";
        this.newAttribute.qte = "1";
        this.prouduits.push(this.newAttribute);
        this.newAttribute = {};
        this.prouduits.sort = this.sort;
        this.prouduits.paginator = this.paginator;

      }
      this.loading = false;
    })
  }

  // changer le prix  
  changer_prix(event: any, item: any) {   
      item.prix = event.target.value    
      item.prix_ttc =Number( item.prix * (1+ (item.tva /100))  ).toFixed(3)
      item.total_ttc =Number(Number(item.qte) * Number(item.prix_ttc)).toFixed(3)  


  }

  // changer le prix ttc 
  changer_prix_ttc(event: any, item: any)
  {
    item.prix_ttc = event.target.value  
    item.total_ttc =Number(Number(item.qte) * Number(item.prix_ttc)).toFixed(3)      
    item.prix = item.prix_ttc / ((item.tva / 100) + 1 )
    item.prix = Math.round(item.prix * 1000) / 1000 

  }
  // changer le quantite 
  changer_qte(event: any, item: any) {    
    if( event.target.value > 0)
    {
      item.qte = event.target.value
      item.total_ttc =Number(Number(item.qte) * Number(item.prix_ttc)).toFixed(3)  

    }
  }

  // get liste des unites
  get_unites() {
    this.Service.unites().subscribe((data) => {
      this.liste_unite = data
    })
  }

  // get liste des categories
  get_categories() {
    this.Service.categories().subscribe((data) => {
      this.liste_categorie = data
    })
  }
  // choix de categorie 
  choix_categorie(ev: any) {
    this.categorie = ev.value;
    this.filtre();
  }
  unite: any; categorie: any;
  // choix de unite 
  choix_unite(ev: any) {
    this.unite = ev.value;
    this.filtre();

  }

  //** Get All Product */
  checkCheckBoxvalue(event: any, prod: any) {
    if (event.target.checked) {
      this.dsiable = false;
      this.prodChecked.push(prod);
    }
    else {
      this.prodChecked = this.prodChecked.filter((value: any) => {
        return value.id != prod.id;
      });
    }
  }
  test: any = true;
  sendProd() {
    this.test = true;
    for (let i = 0; i < this.prodChecked.length; i++) {

      if ((parseFloat(this.prodChecked[i].qte) < 0.1) || (parseFloat(this.prodChecked[i].prix) < 0.001)) {
        this.test = false;
      }
    }
    if (this.test == false) {
      Swal.fire({
        title: 'Erreur ',
        text: 'Vérifier vos données  ',
        icon: 'warning',
        confirmButtonText: 'ok',
      })
    } else {

      this.dialogRef.close({ event: 'close', data: this.prodChecked });
      this.dialogRef.afterClosed().subscribe(result => {
        this.fromPage = result;
      });
      this.prodChecked = [];
    }
  }


  filtre() {
    if (this.categorie == undefined) { this.categorie = "" }
    if (this.unite == undefined) { this.unite = "" }
    this.Service.filtre_produit(
      "id", "",
      "nom", this.form.get('nom')?.value,
      "Code_Barre", this.form.get('code')?.value,
      "unite", "",
      "categorie", this.categorie).subscribe((prod: any) => {
        this.loading = true;
        this.prouduits = []
        for (let i = 0; i < prod.length; i++) {
          this.newAttribute.qte = prod[i].qte
          this.newAttribute.id = prod[i].id;
          this.newAttribute.nom = prod[i].nom;
          this.newAttribute.code = prod[i].code_Barre;
          this.newAttribute.categorie = prod[i].categorie;
          this.newAttribute.unite = prod[i].unite;
          this.prouduits.push(this.newAttribute);
          this.newAttribute = {};
          this.prouduits.sort = this.sort;
          this.prouduits.paginator = this.paginator;

        }
        this.loading = false;

      });
  }

}


