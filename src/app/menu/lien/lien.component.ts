import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/config/service.service';
import Swal from 'sweetalert2';
 

@Component({
  selector: 'app-lien',
  templateUrl: './lien.component.html',
  styleUrls: ['./lien.component.scss']
})
export class LienComponent implements OnInit {
  user:any ;   session:any

  constructor(private router: Router , public service: ServiceService   ) { 
    this.user = JSON.parse(localStorage.getItem("User")+"");
    this.session = JSON.parse(localStorage.getItem("session") + "");

  }


  
  decnx()
  {
    this.router.navigate(['/']);
    Swal.fire({
      title: 'déconnexion ',
      icon: 'question',
      iconHtml: '؟',
      confirmButtonText: 'fermer session',
      denyButtonText:  'garder session',
        showDenyButton: true,
     
     }).then((result) => {

      if (result.isConfirmed) {
        var formData: any = new FormData();
         
        formData.append('Id', this.session[0].id);
        this.service.fermer_Session_Caisses(formData).subscribe((data)=>{   localStorage.setItem('session', ""); })
     
      } else if (result.isDenied) {
         
      }

    })
 
  }

  vente() {
    if (this.user.role == "admin"  || this.user.role == "vente" ) {
      this.session = JSON.parse(localStorage.getItem("session") + "");
      if (this.session[0] == undefined) {
        Swal.fire({
          icon: 'error',
          title: '',
          text: " vous n'avez pas de session ouverte",
        })
  
      }
      else {
        this.router.navigate(['/menu/vente']);
  
      }
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }
   
  }

  caisse() {
    if (this.user.role == "admin"   ) {
      this.router.navigate(['/menu/caisse']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }
  }
  config() {
    if (this.user.role == "admin"   ) {
      this.router.navigate(['/menu/config']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }
   
  }

  achat() {
    if (this.user.role == "admin"  || this.user.role == "achat" ) {
      this.router.navigate(['/menu/achat/-1']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }
  }


  ngOnInit(): void {
  }

}
