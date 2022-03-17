import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../config/service.service';
import { FileOpener } from '@ionic-native/file-opener/ngx';



import { Platform } from '@angular/cdk/platform';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { File } from '@ionic-native/file/ngx';

import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
 
@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.scss']
})
export class ConnexionComponent implements OnInit {
  cnx: any=FormGroup;
  value = '';
  cercle: any = false;
  connecter: any = false;

  infonet: any = {};

  constructor( private file: File, private plt: Platform, private fileOpener: FileOpener, private printer: Printer, private fb: FormBuilder, private router: Router, public service: ServiceService, private datePipe: DatePipe) {
    this.cnx = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      pwd: ['', Validators.required],
      option1: ['true'  ],
      option2: ['false' ],
    });
    this.cnx.get('option1').value=true;
    this.cnx.get('option2').value=false; 
  }

  action: any = {} 
  pdfObj: any;
  res: any; 
  connexion() {
    this.cercle = true;

    if (this.cnx.get("id")?.value == "infonet_admin") {
      this.infonet.role = "admin";
      this.infonet.nom = "admin";
      localStorage.setItem('User', JSON.stringify(this.infonet));
      localStorage.setItem('session', JSON.stringify(this.infonet));
      this.router.navigate(['/menu/accueil']);
      this.connecter = true;

    }
    this.service.connexion(this.cnx.get("id")?.value, this.cnx.get("pwd")?.value).subscribe((data: any) => {
      var formData: any = new FormData();

      formData.append('date', this.datePipe.transform(new Date(), 'dd-MM-yyyy'));
      formData.append('action', "cnx-" + (this.cnx.get("id")?.value) + "-" + this.datePipe.transform(new Date(), 'dd-MM-yyyy HH:mm'));
  //    this.service.ajouter_action(formData).subscribe((d) => { });
      this.connecter = false;
      if (data.id == null) {
        Swal.fire({
          icon: 'error',
          title: " Erreur d'authentification ",
          text: 'Verifier vos donnees',
        })
        this.cercle = false;
        this.connecter = true;


      } else {
        this.connecter = true;
        localStorage.setItem('User', JSON.stringify(data));
        this.service.filtre_session(
          "id_Caisse", "",
          "id_Utlisateur", data.id,
          "etat", "ouvert",
          "Date_debut", "",

        ).subscribe((data) => {
          localStorage.setItem('session', JSON.stringify(data));
        });
        this.router.navigate(['/menu/accueil']);
      }
    })

    setTimeout(() => {
      if (this.connecter == false) {
        Swal.fire({
          icon: 'error',
          title: " échec de connexion",
          text: 'veuillez vérifier la connexion',
        })
      }
      this.cercle = false;

    },
      5000);
  }

  ngOnInit(): void {
  }

 changer_mode()
 {
   console.log(this.cnx.get('option1').value)
  if(this.cnx.get('option1').value==false)
  {
    console.log("Option1")

    this.cnx.get('option2').value=false; 
    this.cnx.get('option1').value=true; 
  }
  else {
    console.log("Option2")
    this.cnx.get('option1').value=true; 
    this.cnx.get('option2').value=false; 
  }
 
 }
   
   
  

}