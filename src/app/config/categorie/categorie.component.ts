import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ServiceService } from '../service.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.scss']
})
export class CategorieComponent implements OnInit {
  form_unite: any = new FormGroup({
    unite: new FormControl(""),
  });
  form_categorie :any = new FormGroup({
    categorie: new FormControl(""),
  });
  liste_categorie: any;
  liste_unite: any;
  constructor(public service: ServiceService) {
    this.get_categories();
    this.get_unites();

  }
  // get liste des categories
  get_categories() {
    this.service.categories().subscribe((data) => {
      this.liste_categorie = data
    })
  }

  // get liste des unites
  get_unites() {
    this.service.unites().subscribe((data) => {
      this.liste_unite = data
    })
  }

  // supprimer unite avec id 
  Supprimer_unite(i: any, id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_unite(id)
        this.get_unites();
        Swal.fire(
          'Unité Supprimé avec succès!',          '',
          'success'
        )        
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
      this.get_unites();
    })
  }

  //supprimer_categorie avec id
  Supprimer_categorie(i: any, id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_categorie(id);
        this.get_categories();
        Swal.fire(
          'Catégorie Supprimé avec succès!',
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
      this.get_categories();
    })
  }

 // modifer catégorie 
  modifer_categorie(i: any, id: any , nom:any) {
    Swal.fire({
      title: 'Catégorie',
      text:"taper le nouveau nom pour la Catégorie : "+nom,
      input:   'text' ,       
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      showLoaderOnConfirm: true,
      preConfirm: (val) => {
       { return {"nom":val}  }
           
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        var formData: any = new FormData(); 
        formData.append('Id',id);
        formData.append('Nom', result.value?.nom);
        this.service.modifier_categorie(formData).subscribe((data)=>{
          this.get_categories();
        })        
      }
    })
  }

 // modifer unité 
  modifer_unite(i: any, id: any , nom :any) {
    Swal.fire({
      title: 'Unité',
      text:"taper le nouveau nom pour le Unité : "+nom,
      input:   'text' ,       
      showCancelButton: true,
      confirmButtonText: 'Modifier',
      showLoaderOnConfirm: true,
      preConfirm: (val) => {
       { return {"nom":val}  } 
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        var formData: any = new FormData(); 
        formData.append('Id',id);
        formData.append('Nom', result.value?.nom);
        this.service.modifier_unite(formData).subscribe((data)=>{
          this.get_unites();
        })        
      }
    })
  }

  Ajouter_unite() {
    var formData: any = new FormData(); 
    formData.append('Nom', this.form_unite.get('unite').value + "");
    this.service.ajouter_unite(formData).subscribe((data) => {     
       
      Swal.fire({
        title: "Unité ",
        text: "Unité ajouté avec succés",
        icon: 'success',                 
        confirmButtonColor: 'green',       
        confirmButtonText: 'Ok', 
      }) 
      this.form_unite.get('unite').value=""
    this.get_unites();
    }); 
    

  }
  Ajouter_categorie() {
    
    var formData: any = new FormData(); 
    formData.append('Nom', this.form_categorie.get('categorie').value + "");
    this.service.ajouter_categorie(formData).subscribe((data) => {            
      Swal.fire({
        title: "Catégorie ",
        text: "Catégorie ajouté avec succés",
        icon: 'success',         
        confirmButtonColor: 'green',       
        confirmButtonText: 'Ok',     
      
      }) 
      this.form_categorie.get('categorie').value=""
    this.get_categories();
    });

  }
  ngOnInit(): void {
  }


}

