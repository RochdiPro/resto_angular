import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-ajouter-utilisateur',
  templateUrl: './ajouter-utilisateur.component.html',
  styleUrls: ['./ajouter-utilisateur.component.scss']
})
export class AjouterUtilisateurComponent implements OnInit {

  user:any= FormGroup;
  constructor( public service: ServiceService ,  private router: Router) { 
    this.user = new FormGroup({
      nom: new FormControl(''),
      prenom: new FormControl(''),
      role: new FormControl(''),
      id: new FormControl(''),
      pwd: new FormControl(''),
     });
  }

  role: any;  
  // choix de unite 
  choix_role(ev: any) {
    this.role = ev.value;
  }
  
  Ajouter_produit() {
    if ( this.role == "" || this.user.get('nom').value == ""   ||  this.user.get('prenom').value == ""  ||  this.user.get('id').value == "" ||  this.user.get('pwd').value == "" ) {
      Swal.fire({
        title: 'Erreur ',
        text: 'Vérifier vos données  ',
        icon: 'warning',
        
        confirmButtonText: 'ok',
        
      })
     }
    else {
      var formData: any = new FormData();
      
      formData.append('Nom', this.user.get('nom').value);
      formData.append('Role', this.role)
      formData.append('Prenom',  this.user.get('prenom').value)
      formData.append('Identifiant', this.user.get('id').value);
      formData.append('Mot_de_passe', this.user.get('pwd').value);
      this.service.ajouter_utilisateur(formData).subscribe((data) => {
       
      }) 
      this.router.navigate(['/menu/config']);
    }

  }
 
  ngOnInit(): void {

  }

  



}

