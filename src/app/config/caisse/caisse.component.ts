import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-caisse',
  templateUrl: './caisse.component.html',
  styleUrls: ['./caisse.component.scss']
})
export class CaisseComponent implements OnInit {


  liste_produit: any;
  liste_caisse: any;
  liste_Utilisateur: any;
  displayedColumns: string[] = ['id', 'caisse', 'utilisateur', 'fond', 'solde', 'etat', 'date_debut', 'date_fin', 'sup'];

  dataSource = new MatTableDataSource<table>();
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;

  form: any = new FormGroup({
    id: new FormControl(""),
    caisse: new FormControl(""),
    utilisateur: new FormControl(""),
    fond: new FormControl(""),
    date: new FormControl(""),

  });

  user: any;
  constructor(public service: ServiceService, private datePipe: DatePipe) {
    this.get_session();
    this.get_caisses();
    this.get_utilisateur();
    this.user = JSON.parse(localStorage.getItem("User") + "");


  }



  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  get_session() {
    this.service.Session_Caisses().subscribe((data:any) => {
      // this.liste_produit = data
     
      for (let i = 0; i <  data.length; i++) {
        data[i].fond=Number(data[i].fond).toFixed(3);
        data[i].solde=Number(data[i].solde).toFixed(3)
     }
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a: any, b: any) => a.id > b.id ? -1 : 1);
      this.dataSource.data = data as table[];
      this.liste_produit.paginator = this.paginator;
    })
  }
  // get liste des caisses
  get_caisses() {
    this.service.caisses().subscribe((data) => {
      this.liste_caisse = data
    })
  }

  // choix de caisse 
  caisse: any;; etat: any
  choix_caisse(ev: any) {
    this.caisse = ev.value.id;
    this.filtre();
  }

  // choix de utilisateur 
  utilisateur: any;
  choix_utilisateur(ev: any) {
    this.utilisateur = ev.value.id;
    this.filtre();

  }

  // choix de etat   
  choix_etat(ev: any) {
    this.etat = ev.value;
    this.filtre();

  }

  // get liste des unites
  get_utilisateur() {
    this.service.utilisateurs().subscribe((data) => {
      this.liste_Utilisateur = data
    })
  }
  test_session_ouvert: any;


  // verifier pour  ajouter le session 
  verifier_avant_ouvrire() {

    this.service.filtre_session(
      "id_Caisse", this.caisse,
      "id_Utlisateur", this.utilisateur,
      "Date_debut", "",
      "etat", "ouvert").subscribe((data: any) => {
        if (data.length > 0) { this.test_session_ouvert = false }

        if (this.test_session_ouvert == false) {
          Swal.fire({
            icon: 'error',
            title: '',
            text: 'session déja ouvert ',
          })
        }
        if (this.form.get('fond')?.value == undefined || this.form.get('fond')?.value == "" || this.caisse == undefined || this.caisse == "" || this.utilisateur == undefined || this.utilisateur == "") {
          Swal.fire({
            icon: 'error',
            title: '',
            text: '  Champs Vide  ',
          })
          this.test_session_ouvert = false;
        }

       
          this.service.session_par_caisse("id_Caisse", this.caisse, "etat", "ouvert").subscribe((data22: any) => {
             
            if (data22.length > 0) {
              Swal.fire({
                icon: 'error',
                title: '',
                text: ' Caisse ouvert',
              })
            }
            else {
              this.ouvrire();
            }
          })
     

      })

  }

  // ovrire session  caisse 
  ouvrire() {

    this.test_session_ouvert = true;
    var formData: any = new FormData();
    formData.append('Utilisateur', this.utilisateur);
    formData.append('Caisse', this.caisse)
    formData.append('Fond', this.form.get('fond')?.value)
    formData.append('Etat', "ouvert")

    this.service.ajouter_Session_Caisses(formData).subscribe((data: any) => {
      if (this.user.id == data.utilisateur.id) {
        let tab = []
        tab.push(data)
        localStorage.setItem('session', JSON.stringify(tab));
      }
      Swal.fire(
        'Caisse ouvert',
        '',
        'success'
      )
      this.get_session()
      this.filtre()
    })
  }

  // fermer session avec id 
  fermer(id: any) {
    var formData: any = new FormData();

    formData.append('Id', id);
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, Fermé',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.fermer_Session_Caisses(formData).subscribe((data: any) => {
          if (data.utilisateur.id == this.user.id) {
            localStorage.setItem('session', '');

          }
        });
        this.get_session()
        Swal.fire(
          'Session Fermer!',
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
      this.get_session()
    })
  }
  ngOnInit(): void {

  }

  // filtre 5 champs 
  filtre_date: any;
  filtre() {
    if (this.caisse == undefined) { this.caisse = "" }
    if (this.etat == undefined) { this.etat = "" }
    if (this.form.get('date')?.value == null || this.form.get('date')?.value == undefined || this.form.get('date')?.value == "") {
      this.filtre_date = "";
    }
    else { this.filtre_date = this.datePipe.transform(this.form.get('date')?.value, 'yyyy-MM-dd'); }
    if (this.utilisateur == undefined) { this.utilisateur = "" }
    this.service.filtre_session(
      "id_Caisse", this.caisse,
      "id_Utlisateur", this.utilisateur,
      "etat", this.etat,
      "date_debut", this.filtre_date,

    ).subscribe((data:any) => {
      for (let i = 0; i <  data.length; i++) {
        data[i].fond=Number(data[i].fond).toFixed(3);
        data[i].solde=Number(data[i].solde).toFixed(3)
     }
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a: any, b: any) => a.id > b.id ? -1 : 1);
      this.dataSource.data = data as table[];
      this.liste_produit.paginator = this.paginator;


    });
  }

}

export class table {
  id: any;
  etat: any;
  fond: any;
  solde: any;
  utilisateur: any;
  caisse: any;
  date_debut: any;
  date_fin: any;
}