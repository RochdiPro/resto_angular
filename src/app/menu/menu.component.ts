import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  session: any; user: any;
  constructor(private router: Router) {

    
    this.session =  localStorage.getItem("session")  
    if(this.session[0])
    {
      this.session = JSON.parse(localStorage.getItem("session") + "");
    }
    this.user = JSON.parse(localStorage.getItem("User") + "");

  }



  vente() {
    console.log("ffff")
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
  donnees() {
    if (this.user.role == "admin") {
      this.router.navigate(['/menu/config/donnees']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }

  }

  rapport() {
    if (this.user.role == "admin") {
      this.router.navigate(['/menu/config/statistique']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }

  }
  factures() {
    if (this.user.role == "admin") {
      this.router.navigate(['/menu/config/factures']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }
  }
  tickets() {
    if (this.user.role == "admin"   ) {
      this.router.navigate(['/menu/config/tickets']);
    } else {

      Swal.fire({
        icon: 'error',
        title: '',
        text: " accès non autorisé ",
      })
    }
  }
  lister_achat() {
    if (this.user.role == "admin"  || this.user.role == "achat" ) {
      this.router.navigate(['/menu/lister_achat']);
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
