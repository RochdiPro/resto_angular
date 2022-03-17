import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceService } from '../service.service';
 
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-prix',
  templateUrl: './prix.component.html',
  styleUrls: ['./prix.component.scss']
})
export class PrixComponent implements OnInit {

  
  liste_produit: any;
  liste_categorie: any;
  liste_unite: any;
  displayedColumns: string[] = [  'Image',  'nom', 'categorie', 'unite','prix_achat','prix_vente',  'tva','prix_vente_ttc' ];

  dataSource = new MatTableDataSource<table>();
  
  @ViewChild(MatPaginator) paginator:any= MatPaginator;
  @ViewChild(MatSort, { static: false }) sort:any= MatSort;
  
  form: any = new FormGroup({
    id: new FormControl(""),
    nom: new FormControl(""),
    code: new FormControl(""),
    categorie: new FormControl(""),
    unite: new FormControl(""),
  });

  constructor(public service: ServiceService) 
  {
    this.get_produit();
    this.get_categories();
    this.get_unites();
  }

  // lister les produits 
  get_produit() {
    this.service.Produits().subscribe((data:any) => {
     this.liste_produit = data
     for (let i = 0; i <  data.length; i++) {
       data[i].prix_vente_ttc =Number( data[i].prix_vente*(1+( data[i].tva / 100))).toFixed(3); 
       data[i].prix_vente=Number(data[i].prix_vente).toFixed(3);
       data[i].prix_achat=Number(data[i].prix_achat).toFixed(3);
       

     }
     
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

    
 // modifier le prix ht 
 obj:any;a:any;
  prix(  id: any ) {
    this.service.produit(id).subscribe((data) => {
      this.obj=data;
      Swal.fire({ 
        title: 'Prix Produit HT ',
        html:
        'Prix HT <input id="swal-input1" value="'+this.obj.prix_vente+'" class="swal2-input"  >',  
        focusConfirm: false,
        preConfirm: () => {
          return [(<HTMLInputElement>document.getElementById('swal-input1')).value,          
        ]
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        this.a = result.value       
        if (result.isConfirmed) {
          var formData: any = new FormData();
          formData.append('Id', id);
          formData.append('Prix_Vente',  this.a[0]);
           if (this.a[0] == ''   ) {
            Swal.fire({
              title: 'Erreur ',
              text: 'Vérifier vos données  ',
              icon: 'warning',
              confirmButtonText: 'ok',
            })
          }
          else {
            this.service.modifier_prix(formData).subscribe((data) => {
              this.get_produit();
              Swal.fire(
                'succés',
                'Mise a jour de prix avec succés',
                'success'
              )  
            })
          }  
        }
      })
    });
  }


  // modifier le prix ttc 
  prix_ttc(  id: any ,   tva :any) {
   this.service.produit(id).subscribe((data) => {
     this.obj=data;
     let p = Number ( Math.round(Number(this.obj.prix_vente) * Number(1+(tva/100))*1000)/1000).toFixed(3)
      Swal.fire({ 
       title: 'Prix Produit TTC',
       html:
       'Prix TTC <input id="swal-input1" value="'+Number(p).toFixed(3)+'" class="swal2-input"  >',  
       focusConfirm: false,
       preConfirm: () => {
         return [(<HTMLInputElement>document.getElementById('swal-input1')).value,          
       ]
       },
       allowOutsideClick: () => !Swal.isLoading()
     }).then((result) => {
       this.a = result.value       
       if (result.isConfirmed) {
         var formData: any = new FormData();     
         let prix_ht = Number ( (Number(this.a[0]) / Number(100+ (tva))  )*100 ).toFixed(3)
         formData.append('Id', id);
         formData.append('Prix_Vente', prix_ht);                
         if (this.a[0] == ''   ) {
           Swal.fire({
             title: 'Erreur ',
             text: 'Vérifier vos données  ',
             icon: 'warning',
             confirmButtonText: 'ok',
           })
         }
         else {
           this.service.modifier_prix(formData).subscribe((data) => {
             this.get_produit();
             Swal.fire(
               'succés',
               'Mise a jour de prix avec succés',
               'success'
             )  
           })
         }  
       }
     })
   });
 }

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // filtre 4 champs pour les produits 
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
  categorie : any;
  code: any;
  valeur: any;
  unite: any;
  Code_Barre: any;
  tva:any
  prix_achat: any;
  prix_vente: any;
  prix_vente_ttc: any;
}