import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceService } from '../service.service';
 
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-utilisateur',
  templateUrl: './utilisateur.component.html',
  styleUrls: ['./utilisateur.component.scss']
})
export class UtilisateurComponent implements OnInit {
 
  liste_produit: any;
  liste_categorie: any;
  liste_unite: any;
  displayedColumns: string[] = ['editer',   'id', 'nom', 'role', 'identifant', 'mot_de_passe',   'sup' ];

  dataSource = new MatTableDataSource<table>();
  
  @ViewChild(MatSort, { static: false }) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator:any= MatPaginator;
  
  form: any = new FormGroup({
    id: new FormControl(""),
    nom: new FormControl(""),     
    role: new FormControl(""),
    
  });

  constructor(public service: ServiceService) { 
    this.utilisateurs(); 
  }
  utilisateurs() {
    this.service.utilisateurs().subscribe((data) => {
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
  role: any;
   
  // choix de role 
  choix_role(ev: any) {
    this.role = ev.value;
    this.filtre();
  }
 

  // get liste des unites
  get_unites() {
    this.service.unites().subscribe((data) => {
      this.liste_unite = data
    })
  }


  //supprimerutilisateur
  supprimer (  id: any) {
    console.log(id)
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_utilisateur(id);
        this.utilisateurs() ;
        Swal.fire(
          'Utilisateur Supprimé avec succès!',
          '',
          'success'
        )
        this.utilisateurs() ;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
      this.utilisateurs();
    })
  }

  //  modifier utilisateur 
  obj:any ; a:any; 
  modifier (  id: any ) {
    this.service.utilisateur(id).subscribe((data) => {
      this.obj=data;
      Swal.fire({ 
        title: 'Utilisateur',
        html:
        '<table>'+
        '<tr><td>Nom</td><td> <input id="swal-input1" value="'+this.obj.nom+'" class="swal2-input"  placeholder="'+this.obj.nom+'" ></td></tr>'+
        '<tr><td>prenom</td><td><input id="swal-input2" value="'+this.obj.prenom+'" class="swal2-input"  placeholder="'+this.obj.prenom+'" >  </td></tr>'+    
        '<tr><td>Role</td><td><select id="swal-input5"  style="margin-top: 5%; width: 50%;"> <option value="achat"> Responsable d achat</option> <option value="vente"> Responsable de vente </option> <option value="admin"> Admin</option> </select> </td></tr>'+
        '<tr><td>Identifant</td><td><input id="swal-input3" value="'+this.obj.identifant+'" class="swal2-input"  placeholder="'+this.obj.identifant+'" ></td></tr>'+
        '<tr><td>Mot de passe</td><td><input id="swal-input4"  value="'+this.obj.mot_de_passe+'" class="swal2-input" placeholder="'+this.obj.mot_de_passe+'"></td></tr>'+
        '</table>' ,
        focusConfirm: false,
        preConfirm: () => {
          return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
          (<HTMLInputElement>document.getElementById('swal-input2')).value, 
          (<HTMLInputElement>document.getElementById('swal-input3')).value, 
          (<HTMLInputElement>document.getElementById('swal-input4')).value,
          (<HTMLInputElement>document.getElementById('swal-input5')).value, 
        ]
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        this.a = result.value
       
        if (result.isConfirmed) {
          var formData: any = new FormData();
          formData.append('Id', id);
          formData.append('Nom', this.a[0]);
          formData.append('Prenom', this.a[1]);
          formData.append('Identifiant', this.a[2]);
          formData.append('Mot_de_passe', this.a[3]);
          formData.append('Role', this.a[4]);
        
          if (this.a[0] == '' || this.a[1] == '' || this.a[2] == ''  || this.a[3] == ''  ) {
            Swal.fire({
              title: 'Erreur ',
              text: 'Vérifier vos données  ',
              icon: 'warning',
              confirmButtonText: 'ok',
            })
          }
          else {
            this.service.modifier_utilisateur(formData).subscribe((data) => {
              this.utilisateurs();
              Swal.fire(
                'succés',
                'Utilisateur Modifier avec succés',
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

  filtre() {
  
    if(this.role==undefined){this.role=""}
    this.service.filtre_utilisateur(
      "id", this.form.get('id')?.value,
     "nom", this.form.get('nom')?.value,
      "role", this.role     ).subscribe((data)=>{
       
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
  role : any;
  identifant: any;
  mot_de_passe: any;   
}