import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
 import { ServiceService } from '../service.service';
 
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 
import Swal from 'sweetalert2';
@Component({
  selector: 'app-produit',
  templateUrl: './produit.component.html',
  styleUrls: ['./produit.component.scss']
})


export class ProduitComponent implements OnInit {

  liste_produit: any;
  liste_categorie: any;
  liste_unite: any;
  displayedColumns: string[] = ['editer','qte', 'Image', 'id', 'nom', 'categorie', 'unite', 'valeur', 'prix_vente','code', 'sup' ];

  dataSource = new MatTableDataSource<table>();
  @ViewChild(MatSort, { static: false }) sort:any= MatSort;
  @ViewChild(MatPaginator) paginator:any= MatPaginator;
  
  form: any = new FormGroup({
    id: new FormControl(""),
    nom: new FormControl(""),
    code: new FormControl(""),
    categorie: new FormControl(""),
    unite: new FormControl(""),
  });

  constructor(public service: ServiceService) {
    this.get_produit();
    this.get_categories();
    this.get_unites();

  }


  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get_produit() {
    this.service.Produits().subscribe((data) => {
     // this.liste_produit = data
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a:any, b:any) => a.id  > b.id ? -1 : 1);
      this.dataSource.data = data as table[]; 
      this.liste_produit.paginator = this.paginator;
    })
  }
  // get liste des categories
  get_categories() {
    this.service.categories().subscribe((data) => {
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

  // get liste des unites
  get_unites() {
    this.service.unites().subscribe((data) => {
      this.liste_unite = data
    })
  }


  
  supprimer(  id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_produit(id);
        this.get_produit()
        Swal.fire(
          'Produit Supprimé avec succès!',
          '',
          'success'
        )        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
      this.get_produit()
    })
  }
  ngOnInit(): void {

  }

  filtre() {
    if(this.categorie==undefined){this.categorie=""}
    if(this.unite==undefined){this.unite=""}
    this.service.filtre_produit(
      "id", this.form.get('id')?.value,
     "nom", this.form.get('nom')?.value,
      "Code_Barre", this.form.get('code')?.value,
      "unite", this.unite,
      "categorie", this.categorie).subscribe((data)=>{
       
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a:any, b:any) => a.id  > b.id ? -1 : 1);
      this.dataSource.data = data as table[]; 
      this.liste_produit.paginator = this.paginator;

    });
   }

}

export class table {
  id: any;
  nom: any;
  qte:any;
  categorie : any;
  code: any;
  valeur: any;
  unite: any;
  Code_Barre: any;
}