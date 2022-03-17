import { Component, Inject, OnInit, ViewChild, ɵɵpureFunction1 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ServiceService } from '../config/service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { ThrowStmt } from '@angular/compiler';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { table } from 'console';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Printer, PrintOptions } from '@awesome-cordova-plugins/printer/ngx';
import { platform } from 'os';
import { Platform } from '@angular/cdk/platform';






@Component({
  selector: 'app-vente',
  templateUrl: './vente.component.html',
  styleUrls: ['./vente.component.scss']
})
export class VenteComponent implements OnInit {
  data: any = [];
  data2: any = [];
  clt: any = "Passager";
  nticket: any = "00001";
  page = 0;
  size = 15;
  total: any = 0;
  benifice: any = 0;
  valide: any = false
  payee: any = false
  btn_valide: any = false;
  table_reglement: any = []
  etat_paiement: any = false;
  formData: any;
  id_vente: any;
  id_ticket_modifier: any;
  total_ticket_modifier: any;
  benefice_ticket_modifier: any;
  recu: any;
  rendu: any;
  id_ticket: any;

  data_vente: any;
  Detail: any; xmldata: any; objxml: any = {};
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  produit: FormGroup;
  liste_categorie: any;
  categorie: any;
  mode_type: any = true;
  form: any = new FormGroup({
    id: new FormControl(""),
    nom: new FormControl(""),
    code: new FormControl(""),
    categorie: new FormControl(""),
    unite: new FormControl(""),
  });

  test_modifier = false;

  choix: any = " ";
  table: any = [];
  user: any; session: any;
  liste_tva: any = [];

  constructor(private plt: Platform, public dialog: MatDialog, public service: ServiceService, private route: ActivatedRoute, private router: Router, private datePipe: DatePipe, private printer: Printer) {

    this.user = JSON.parse(localStorage.getItem("User") + "");
    this.session = JSON.parse(localStorage.getItem("session") + "");
    this.produit = new FormGroup({
      nom: new FormControl(''),
      categorie: new FormControl(''),
      image: new FormControl(''),
      unite: new FormControl(''),
      prix_achat: new FormControl(''),
      prix_vente: new FormControl(''),
    });
    this.get_categories();
    this.get_produits();
    this.choix = "";
  }

  // lister les produit et ajouter le valeur  tva 
  get_produits() {
    this.service.Produits().subscribe((data: any) => {
      this.data2 = data
      for (let i = 0; i < this.data2.length; i++) {
        this.data2[i].prix_vente = Number(this.data2[i].prix_vente * (1 + (this.data2[i].tva / 100))).toFixed(3);
      }
      this.getData({ pageIndex: this.page, pageSize: this.size });
    })
  }
  set_categorie(ch: any) {
    this.choix = ch;
  }

  ngOnInit(): void {


  }

  // calculer assite et tva 
  obj_tva: any = {}
  calcule_tva() {
    this.liste_tva = [];
    for (let i = 0; i < this.table.length; i++) {
      this.obj_tva = {};
      this.obj_tva.tva = this.table[i].tva;
      this.obj_tva.val = Number(Number(this.table[i].prix_vente - Number(this.table[i].prix_vente * (1 - (this.table[i].tva / 100)))) * this.table[i].qte_v).toFixed(3)
      this.obj_tva.montant = Number((this.table[i].prix)).toFixed(3)
      let test_tva = false;
      if (this.liste_tva.length == 0) {
        this.liste_tva.push(this.obj_tva)

      } else {
        for (let k = 0; k < this.liste_tva.length; k++) {
          if (this.obj_tva.tva == this.liste_tva[k].tva) {
            this.liste_tva[k].val = Number(Number(this.liste_tva[k].val) + Number(this.obj_tva.val)).toFixed(3)
            this.liste_tva[k].montant = Number(Number(this.liste_tva[k].montant) + Number(this.obj_tva.montant)).toFixed(3)
            test_tva = true;
          }
        }
        if (test_tva == false) {
          this.liste_tva.push(this.obj_tva)
        }
      }
    }

  }

  code_barre_produit: any;
  code_barre_qte: any;
  test_balance: any = false;
  // ajouter article avec le code à barre
  ajouter_article_code_a_barre(event: any) {

    if (event.key == "Enter") {
      let tab = this.form.get('code')?.value
      if (tab[0] == 2) {
        this.code_barre_produit = tab[0] + tab[1] + tab[2] + tab[3] + tab[4] + tab[5] + tab[6]
        this.code_barre_qte = tab[7] + tab[8] + tab[9] + tab[10] + tab[11]
        this.form.controls["code"].setValue("");
        this.service.filtre_produit(
          "id", "",
          "nom", "",
          "Code_Barre", this.code_barre_produit,
          "unite", "",
          "categorie", "").subscribe((data: any) => {

            if (data.length > 0) {
              if (tab[0] == 2) {
                data[0].qte_v = Number(Number(this.code_barre_qte) / 1000).toFixed(3)
                data[0].prix_vente = Number(data[0].prix_vente * (1 + (data[0].tva / 100))).toFixed(3);

                this.test_balance = true
              }
              this.ajouter_table(data[0])

            }
            else {
              Swal.fire({
                icon: 'error',
                title: '',
                text: 'Produit Inconnu ',
              })

            }
          });
      }
      else {
        this.service.filtre_produit(
          "id", "",
          "nom", "",
          "Code_Barre", this.form.get('code')?.value,
          "unite", "",
          "categorie", "").subscribe((data: any) => {

            if (data.length > 0) {

              data[0].qte_v = 1
              data[0].prix_vente = Number(data[0].prix_vente * (1 + (data[0].tva / 100))).toFixed(3); 
              this.ajouter_table(data[0]) 
            }
            else {
              Swal.fire({
                icon: 'error',
                title: '',
                text: 'Produit Inconnu ',
              })

            }
          });
      }     
      this.vide_code_bare="" 
    } 
  }

  vide_code_bare:any=""
  
  // ajouter produit au tableaux
  ajouter_table(prod: any) {
    this.btn_valide = true
    this.valide = false
    if (this.payee) { this.table = []; this.payee = false; this.table_reglement = []; this.total = 0 }
    this.payee = false

    if (prod.qte == 0) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Quantité non disponible en stock ',
      })
    }
    else {

      let t = -1
      let somme = 0
      let somme2 = 0
      for (let i = 0; i < this.table.length; i++) {
        if (prod.id == this.table[i].id) { t = i }
      }
      if (t == -1) {
        if (this.test_balance == false) {
          prod.qte_v = Number(1);
          prod.prix = Number(Number(prod.prix_vente) * Number(prod.qte_v)).toFixed(3)

          somme = prod.prix
          somme2 = prod.prix_achat
          this.table.push(prod);
        }
        else {
          prod.prix = Number(Number(prod.prix_vente) * Number(prod.qte_v)).toFixed(3)
          somme = prod.prix
          somme2 = prod.prix_achat
          this.table.push(prod);
        }


      }
      else {
        if (this.test_balance == false) {
          if (prod.qte < (Number(this.table[t].qte_v) + 1)) {
            Swal.fire({
              icon: 'error',
              title: '',
              text: 'Quantité non disponible en stock ',
            })
          }
          else {
            this.table[t].qte_v = Number(this.table[t].qte_v) + 1
            this.table[t].prix = Number(Number(this.table[t].prix_vente) * Number(this.table[t].qte_v)).toFixed(3)
            somme = this.table[t].prix
          }
        }
        else {
          this.table[t].qte_v = Number(this.table[t].qte_v) + prod.qte_v
          this.table[t].prix = Number(Number(this.table[t].prix_vente) * Number(this.table[t].qte_v)).toFixed(3)
          somme = this.table[t].prix

        }

      }
      //this.total = Number(Number(this.total) + Number(somme)).toFixed(3)
      // this.benifice = Number(this.benifice) + Number(somme2)

    }
    this.test_balance = false
    this.calcule_total();
    this.calcule_tva();
  }
  // lister les images 
  getData(obj: any) {
    let index = 0,
      startingIndex = obj.pageIndex * obj.pageSize,
      endingIndex = startingIndex + obj.pageSize;

    this.data = this.data2.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }


  // filte generale
  filtre() {
    if (this.categorie == undefined) { this.categorie = "" }

    this.service.filtre_produit(
      "id", this.form.get('id')?.value,
      "nom", this.form.get('nom')?.value,
      "Code_Barre", "",
      "unite", "",
      "categorie", this.categorie).subscribe((data) => {

        this.data2 = data
        this.getData({ pageIndex: this.page, pageSize: this.size });

      });
  }

  // filtre pour les categorie
  filtre_cat(categorie: any, ch: any) {
    this.choix = categorie;
    this.categorie = ch
    this.filtre();
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
    this.choix = ""
    this.filtre()
  }

  // mode d'affichage a travers les url 
  mode() {
    this.mode_type = !(this.mode_type)
    if (this.mode_type) {
      this.router.navigate(['/vente']);
    }
    if (this.mode_type == false) {
      this.router.navigate(['/menu/vente']);
    }
  }

  // supprimer une ligne de table 
  supprimer(i: any, t: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez le',
      cancelButtonText: 'Non, garde le'
    }).then((res) => {
      if (res.value) {
        this.table.splice(i, 1);
        this.total = Number(this.total) - Number(t)
        if (this.total == 0) { this.btn_valide = false }

      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    }
    );
  }


  //  Facturation
  a: any;
  facture() {

    Swal.fire({
      title: 'Facture',
      html:
        'Client <input id="swal-input2"  type="text" value="" class="swal2-input" placeholder="Passager"   [matKeyboard]="' + "de-CH" + '" > <br>' +
        'ID fiscale <input id="swal-input3"  type="text" value="" class="swal2-input" placeholder="Passager"   [matKeyboard]="' + "de-CH" + '" >',

      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input2')).value, (<HTMLInputElement>document.getElementById('swal-input3')).value,]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value

      if (result.isConfirmed) {

        this.facturation(this.id_vente, this.a[0], this.a[1])

      }
      Swal.fire(
        'Facture',
        ' ',
        'success'
      )

    })

  }

  // calcule total
  calcule_total() {
    let s = 0;
    let s2 = 0;
    for (let i = 0; i < this.table.length; i++) {
      s = s + Number(this.table[i].prix);
      s2 = s2 + Number(this.table[i].prix_achat);
    }
    this.total = Number(s).toFixed(3);
    this.benifice = s2
  }

  ch: any
  modeleSrc: any;
  e: any;
  //impression 
  generatePDF(client: any, id: any, id_fiscale: any) {

    var body: any = [];
    var body2: any = [];
    var body3: any = [];
    var obj = new Array();
    var obj = new Array();
    this.e = { text: 'Id', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Nom Produit', }
    obj.push(this.e)
    this.e = { text: 'Qte', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Unite', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Prix U HT', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: '%TVA', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Prix U ttc', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Total HT', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Total TTC', alignment: 'center' }
    obj.push(this.e)
    body.push(obj);

    for (let i = 0; i < this.table.length; i++) {
      var obj = new Array();
      this.e = { text: this.table[i].id, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.table[i].nom }
      obj.push(this.e)

      this.e = { text: this.table[i].qte_v, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.table[i].unite.nom, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.table[i].prix_vente, alignment: 'right' }
      obj.push(this.e)

      this.e = { text: this.table[i].tva, alignment: 'center' }
      obj.push(this.e)

      let pd = Number((Number(this.table[i].prix_vente) / Number(100 + (this.table[i].tva))) * 100).toFixed(3)
      this.e = { text: pd, alignment: 'right' }
      obj.push(this.e)

      let p = Number((this.table[i].prix_vente) * (this.table[i].qte_v)).toFixed(3)
      this.e = { text: p, alignment: 'right' }
      obj.push(this.e);

      let pt = Number((Number(pd) * Number((this.table[i].qte_v)))).toFixed(3)

      this.e = { text: pt, alignment: 'right' }
      obj.push(this.e)
      body.push(obj);
    }


    var obj = new Array();
    this.e = { text: '%Tva', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Assiette', alignment: 'center' }
    obj.push(this.e)
    this.e = { text: 'Valeur', alignment: 'center' }
    obj.push(this.e)
    body2.push(obj);

    for (let i = 0; i < this.liste_tva.length; i++) {
      var obj = new Array();
      this.e = { text: this.liste_tva[i].tva, alignment: 'center' }
      obj.push(this.e)
      this.e = { text: Number(this.liste_tva[i].montant).toFixed(3), alignment: 'right' }
      obj.push(this.e)
      this.e = { text: Number(this.liste_tva[i].val).toFixed(3), alignment: 'right' }
      obj.push(this.e)
      body2.push(obj);
    }

    var obj = new Array();
    obj.push("Total HT :");
    this.e = { text: Number(this.total).toFixed(3), alignment: 'right' }
    obj.push(this.e)
    obj.push(' DT');
    body3.push(obj);

    var obj = new Array();
    obj.push("Timbre :");
    this.e = { text: "0.600", alignment: 'right' }
    obj.push(this.e)
    obj.push(' DT');
    body3.push(obj);

    var obj = new Array();
    obj.push("Total TTC :");
    this.e = { text: Number(this.total).toFixed(3), alignment: 'right' }
    obj.push(this.e)
    obj.push(' DT');
    body3.push(obj);
    var obj = new Array();

    var ch = ""
    for (let i = 0; i < this.table_reglement.length; i++) {
      ch = ch + this.table_reglement[i].mode + " : " + this.table_reglement[i].montant + "\n"
    }



    var def = {


      defaultStyle: {
        // alignment: 'justify'
      },
      pageMargins: [40, 100, 40, 180],
      info: {
        title: 'Vente',
      },
      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
                {
                  text: currentPage.toString() + '/' + pageCount,
                }
              ],
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: 'Facture',
          fontSize: 18,
          color: 'black',
          bold: true,
          relativePosition: { x: 250, y: 20 }
        },

        {
          text: 'Client : ' + client + '',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 80 }
        },
        {
          text: 'Identifiant : ' + id_fiscale + '',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 100 }
        },
        ,
        {
          text: 'N° Facture  : ' + id + '',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 40 }
        },

        {
          text: '' + this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          fontSize: 6,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 10 },

        },
        {
          text: 'N° Ticket : ' + this.id_vente,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 60 },

        }

      ],
      content: [
        {
          table: {
            widths: [30, 100, 30, 30, 45, 27, 50, 50, 50],
            body: body,
          },
          fontSize: 10,
          margin: [10, 40, 30, 20],
        }
        ,
        {
          text: "Assiette TVA",
          fontSize: 12,
          color: 'black',
        },
        {
          table: {
            widths: [40, 70, 70],
            body: body2,
          },
          fontSize: 10,
          margin: [10, 20, 10, 50]
        },
        ,
        {
          table: {
            widths: [50, 55, 15],
            body: body3,
          },
          fontSize: 10,
          margin: [383, 0, 0, 0],
          layout: 'noBorders',
        },
        {
          text: "Réglements",
          fontSize: 12,
          color: 'black',
        },

        {
          text: ch,
          fontSize: 8,
          color: 'black',

        },


      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'achat' + new Date() + '.pdf' });

  }
  popupWin: any

  // generation des tickets
  generate_ticket() {
    let ch = ""
    for (let i = 0; i < this.table.length; i++) {
      ch = ch + "<tr><td width='10%'>" + this.table[i].qte_v + "</td> <td  width='50%'>" + this.table[i].nom + "</td> <td  width='20%'>" + Number(this.table[i].prix_vente).toFixed(3) + "</td> <td  width='20%'>" + Number(this.table[i].prix).toFixed(3) + "</td></tr>"
    }
    let printContents =
      " <img style='width: 30%; margin-left: 33%; '  src='./../../assets/images/affecter.jpg'>" +
      "<br> " +
      "<h1 style='text-align: center; '>  Infonet </h1> " +
      "<p style='text-align: center; '>  Date :" + this.datePipe.transform(this.data_vente.date, 'dd/MM/yyyy HH:mm:ss') + "   </p> " +

      "<h3 style='text-align: center; '>  Ticket N°  " + this.id_ticket + "  </h3> " +

      "<table >   " +
      "   <tr> " +
      "   <td>Agent :</td>" +
      "   <td> " + this.user.nom + " </td>" +
      "   <td> </td>" +
      "   <td>Caisse :</td>" +
      "   <td> " + this.session[0].caisse.nom + "</td>" +

      "  </tr>" +
      "</table>" +
      "<table >   " +
      "   <tr> " +
      "   <th width='10%'>Qte</th>" +
      "   <th width='50%' style=' text-align: left;'>Désignation</th>" +
      "   <th width='20%'>Prix_U</th>" +
      "   <th width='20%'>Total</th>" +
      "  </tr>" +
      ch +

      "</table>" +
      "<h4 style='text-align: right;' >  Montant Total : " + Number(this.total).toFixed(3) + " DT </h4 > " +
      "<p   >  Reçu : " + Number(this.recu).toFixed(3) + " Rendu : " + Number(this.rendu).toFixed(3) + " </p > " +
      "<p style='text-align: center; '>  Merci pour votre visite </p>"

      ;

    let options: PrintOptions = {
      name: 'MyDocument',

    }
    this.printer.print(printContents, options);




    if (this.plt.isBrowser) {
      this.popupWin = window.open('', 'test', 'top=0,left=0,height=auto,width=auto,toolbar=0,scrollbars=0,status=0');
      this.popupWin.document.open();

      this.popupWin.document.write(`
       <html>
         <head>  
           <script>
           function fn()
           {           
             window.print();window.close();
             }
           </script>
           <style  >
           @media print{ .doNotPrint{display:none !important;} } 
           </style>
            
         </head>
          <body onload="fn()">${printContents} </body>
       </html>`
      );
      this.popupWin.document.close();
    }




  }


  calcule(event: any, obj: any) {
    if (Number(event.target.value) > obj.qte) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Quantité non disponible en stock ',
      })
    }
    else {
      obj.prix = Number(obj.prix_vente) * Number(event.target.value)
      obj.qte_v = Number(event.target.value);
      this.calcule_total()
    }
  }


  // valide un achat pour impression 
  valide_achat() { this.valide = true }

  // reglement ticket 
  reglement() {

    const dialogRef = this.dialog.open(reglement_dialogue, {
      width: '80%',
      height: '70%',
      data: { total: this.total, table: this.table_reglement, recu: this.recu, rendu: this.rendu }
    });
    dialogRef.afterClosed().subscribe(result => {

      let somme = 0
      for (let i = 0; i < this.table_reglement.length; i++) {
        somme = somme + Number(this.table_reglement[i].montant);

      }
      this.recu = Number(somme).toFixed(3);
      this.rendu = Number(somme - Number(this.total)).toFixed(3);
      if (Number(somme) > Number(this.total) || Number(somme) == Number(this.total)) {
        this.payee = true
        if (this.test_modifier) {
          this.conserver_data_update();
          this.test_modifier = false;
          this.valide = false;
        }
        else {
          this.conserver_data();
          this.valide = false;

        }
      }
    });
  }

  //  generere xml  file  dans le cas :  modification de ticket 
  conserver_data_update() {
    this.formData = new FormData();
    var doc = document.implementation.createDocument("Vente", "", null);
    var Vente = doc.createElement("Vente");
    var total_fac = doc.createElement("Total"); total_fac.innerHTML = Number(this.total).toFixed(3)
    var user = doc.createElement("Utilisateur"); this.user.id
    var Produits = doc.createElement("Produits");
    var Reglements = doc.createElement("Reglements");
    var tvas = doc.createElement("Tvas");
    for (let i = 0; i < this.liste_tva.length; i++) {
      var tva = doc.createElement('TVA'); tva.innerHTML = this.liste_tva[i].tva
      var t = doc.createElement('Taxe'); t.innerHTML = this.liste_tva[i].tva
      var t1 = doc.createElement('Valeur'); t1.innerHTML = this.liste_tva[i].val
      var t2 = doc.createElement('Montant'); t2.innerHTML = this.liste_tva[i].montant
      tva.appendChild(t)
      tva.appendChild(t1)
      tva.appendChild(t2)
      tvas.appendChild(tva);

    }
    for (let i = 0; i < this.table.length; i++) {

      var Produit = doc.createElement('Produit')
      var id = doc.createElement('Id'); id.innerHTML = this.table[i].id
      var Nom = doc.createElement('Nom'); Nom.innerHTML = this.table[i].nom
      var code = doc.createElement('code'); code.innerHTML = this.table[i].code_Barre
      var prix_u = doc.createElement('prix_u'); prix_u.innerHTML = this.table[i].prix_vente
      var total = doc.createElement('total'); total.innerHTML = this.table[i].prix
      var qte = doc.createElement('Qte'); qte.innerHTML = this.table[i].qte_v
      var unite = doc.createElement('unite'); unite.innerHTML = this.table[i].unite.id
      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(code);
      Produit.appendChild(prix_u);
      Produit.appendChild(total);
      Produit.appendChild(qte);
      Produit.appendChild(unite);
      Produits.appendChild(Produit);

    }
    for (let i = 0; i < this.table_reglement.length; i++) {
      var Reglement = doc.createElement('Reglement')
      var Type = doc.createElement('Type'); Type.innerHTML = this.table_reglement[i].mode
      var Montant = doc.createElement('Montant'); Montant.innerHTML = this.table_reglement[i].montant
      var info = doc.createElement('info'); info.innerHTML = this.table_reglement[i].info
      Reglement.appendChild(Type);
      Reglement.appendChild(Montant);
      Reglement.appendChild(info);
      Reglements.appendChild(Reglement);
    }
    Vente.appendChild(user)
    Vente.appendChild(tvas)
    Vente.appendChild(total_fac)
    Vente.appendChild(Reglements)
    Vente.appendChild(Produits)
    doc.appendChild(Vente)
    let url = "assets/vente.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/achat.xml");
        this.formData.append('Detail', myFile);
        this.formData.append('Utilisateur', this.user.id);
        this.formData.append('Type', "ticket");
        this.formData.append('Client', this.clt);
        this.formData.append('Total', this.total);
        this.formData.append('Caisse', this.session[0].id);

        this.service.modifier_vente(this.formData).subscribe((data: any) => {
          this.id_ticket = data.id
          this.id_vente = data.id;
          this.data_vente = data
          let formData2 = new FormData();
          let res = Number(Number(this.total) - Number(this.benifice))

          formData2.append('Id', this.session[0].id); formData2.append('Solde', (Number(this.total) - Number(this.total_ticket_modifier)) + ""); formData2.append('Benefice', res + "");
          this.service.Ajouter_solde_Session_Caisses(formData2).subscribe((d) => { })

          Swal.fire({
            icon: 'success',
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            showCancelButton: true,
            showDenyButton: true,
            denyButtonColor: '#3085d6',
            confirmButtonText: 'Ticket',
            denyButtonText: `Facture`,
            cancelButtonText: 'Quitter',
          }).then((result) => {

            if (result.isConfirmed) {
              this.generate_ticket()
            } else if (result.isDenied) {
              this.facture()
            }

          })

        })

      });
  }


  //  generere xml  file  dans le cas ajouter n ticket  
  conserver_data() {
    this.formData = new FormData();
    var doc = document.implementation.createDocument("Vente", "", null);
    var Vente = doc.createElement("Vente");
    var total_fac = doc.createElement("Total"); total_fac.innerHTML = Number(this.total).toFixed(3)
    var user = doc.createElement("Utilisateur"); this.user.id
    var Produits = doc.createElement("Produits");
    var Reglements = doc.createElement("Reglements");
    var tvas = doc.createElement("Tvas");
    for (let i = 0; i < this.liste_tva.length; i++) {
      var tva = doc.createElement('TVA'); tva.innerHTML = this.liste_tva[i].tva
      var t = doc.createElement('Taxe'); t.innerHTML = this.liste_tva[i].tva
      var t1 = doc.createElement('Valeur'); t1.innerHTML = this.liste_tva[i].val
      var t2 = doc.createElement('Montant'); t2.innerHTML = this.liste_tva[i].montant
      tva.appendChild(t)
      tva.appendChild(t1)
      tva.appendChild(t2)
      tvas.appendChild(tva);

    }
    for (let i = 0; i < this.table.length; i++) {

      var Produit = doc.createElement('Produit')
      var id = doc.createElement('Id'); id.innerHTML = this.table[i].id
      var Nom = doc.createElement('Nom'); Nom.innerHTML = this.table[i].nom
      var code = doc.createElement('code'); code.innerHTML = this.table[i].code_Barre
      var prix_u = doc.createElement('prix_u'); prix_u.innerHTML = this.table[i].prix_vente
      var total = doc.createElement('total'); total.innerHTML = this.table[i].prix
      var qte = doc.createElement('Qte'); qte.innerHTML = this.table[i].qte_v
      var unite = doc.createElement('unite'); unite.innerHTML = this.table[i].unite.id
      Produit.appendChild(id);
      Produit.appendChild(Nom);
      Produit.appendChild(code);
      Produit.appendChild(prix_u);
      Produit.appendChild(total);
      Produit.appendChild(qte);
      Produit.appendChild(unite);
      Produits.appendChild(Produit);

    }
    for (let i = 0; i < this.table_reglement.length; i++) {
      var Reglement = doc.createElement('Reglement')
      var Type = doc.createElement('Type'); Type.innerHTML = this.table_reglement[i].mode
      var Montant = doc.createElement('Montant'); Montant.innerHTML = this.table_reglement[i].montant
      var info = doc.createElement('info'); info.innerHTML = this.table_reglement[i].info
      Reglement.appendChild(Type);
      Reglement.appendChild(Montant);
      Reglement.appendChild(info);
      Reglements.appendChild(Reglement);
    }
    Vente.appendChild(user)
    Vente.appendChild(tvas)
    Vente.appendChild(total_fac)
    Vente.appendChild(Reglements)
    Vente.appendChild(Produits)
    doc.appendChild(Vente)
    let url = "assets/vente.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/achat.xml");
        this.formData.append('Detail', myFile);
        this.formData.append('Utilisateur', this.user.id);
        this.formData.append('Type', "ticket");
        this.formData.append('Client', this.clt);
        this.formData.append('Total', this.total);
        this.formData.append('Caisse', this.session[0].id);

        this.service.ajouter_vente(this.formData).subscribe((data: any) => {
          this.id_vente = data.id;
          this.data_vente = data
          this.id_ticket = data.id
          this.service.valider_vente(this.id_vente).subscribe((d) => {
          })
          let formData2 = new FormData();
          let res = Number(Number(this.total) - Number(this.benifice))
          formData2.append('Id', this.session[0].id); formData2.append('Solde', this.total); formData2.append('Benefice', res + "");
          this.service.Ajouter_solde_Session_Caisses(formData2).subscribe((d) => { })

          Swal.fire({
            icon: 'success',
            confirmButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            showCancelButton: true,
            showDenyButton: true,
            denyButtonColor: '#3085d6',
            confirmButtonText: 'Ticket',
            denyButtonText: `Facture`,
            cancelButtonText: 'Quitter',
          }).then((result) => {

            if (result.isConfirmed) {
              this.generate_ticket()
            } else if (result.isDenied) {
              this.facture()
            }

          })

        })

      });
  }

  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  // convertire un ticket en facture 
  facturation(id_vente: any, client: any, id: any) {
    let formData3 = new FormData();
    formData3.append('Id', id_vente);
    formData3.append('Client', client);
    formData3.append('Id_Fiscale', id);
    this.service.facturation(formData3).subscribe((d1: any) => {
      this.generatePDF(client, d1.id, d1.id_Fiscale);
    })

  }

  // modifier ou bien abondonner un ticket 
  modifier_ticket() {
    this.payee = false
    this.payee = false;
    this.valide = false;
    this.test_modifier = true

    Swal.fire({
      title: 'Ticket',
      html:
        '<table><tr><td>N° ticket : </td><td><input id="swal-input1" value="" class="swal2-input"   ></td></tr> ' +
        '<tr><td>Code Admin : </td><td><input  type="password" id="swal-input2" value="" class="swal2-input"    ></td></tr> </table>',
      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
        (<HTMLInputElement>document.getElementById('swal-input2')).value
        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value
      if (this.a[1] == "0000") {
        this.table = []
        this.btn_valide = true
        this.id_ticket_modifier = this.a[0]

        if (result.isConfirmed) {
          this.service.Detail_vente(this.a[0]).subscribe((detail: any) => {
            // this.data_vente.id=this.a[0]
            const reader = new FileReader();
            reader.onloadend = () => {
              this.Detail = reader.result;
              var parseString = require('xml2js').parseString;
              let data1
              parseString(atob(this.Detail.substr(28)), function (err: any, result: any) {
                data1 = result.Vente;
              })
              this.xmldata = data1
              this.total = 0;
              if (this.xmldata.Produits[0].Produit != undefined) {
                for (let j = 0; j < this.xmldata.Produits[0].Produit.length; j++) {
                  this.service.produit(this.xmldata.Produits[0].Produit[j].Id.toString()).subscribe((da: any) => {
                    this.objxml = da
                    this.objxml.qte_v = this.xmldata.Produits[0].Produit[j].Qte.toString()
                    this.objxml.prix_vente = this.xmldata.Produits[0].Produit[j].prix_u.toString()
                    this.objxml.prix = Number(Number(this.objxml.prix_vente) * Number(this.objxml.qte_v)).toFixed(3);
                    this.service.unite(this.xmldata.Produits[0].Produit[j].unite.toString()).subscribe((data55) => {
                      this.objxml.unite = data55
                    })
                    this.table.push(this.objxml)
                    this.total = Number(Number(this.total) + Number(this.objxml.prix)).toFixed(3);
                  })
                }

              }
            }
            reader.readAsDataURL(detail);
          })

          this.service.vente(this.a[0]).subscribe((data_update: any) => {
            this.total_ticket_modifier = data_update.total
          })

        }
      }
    })

  }

  //open_cash_drawer 
  w: any;
  open_cash_drawer() {


    this.w = window.open("windowUrl", "windowName", 'left=0,top=0,width=0,height=0');
    this.w.print();
    this.w.close();
  }



}





//component dialogue reglement
@Component({
  selector: 'reglement',
  templateUrl: 'reglement.html',
})
export class reglement_dialogue {
  table: any;
  obj: any = {}
  form: any = FormGroup;
  total: any;
  rest: any = 0;
  retour: any = 0;
  recu: any;
  rendu: any;

  constructor(private datePipe: DatePipe, private fb: FormBuilder, public dialogRef: MatDialogRef<reglement_dialogue>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.table = data.table
    this.recu = data.recu = this.total
    this.rendu = data.rendu = 0
    this.total = Number(data.total).toFixed(3);;
    this.obj = {}
    this.obj.mode = "especes"
    this.obj.montant = this.total
    this.obj.info = ""
    if (this.table.length < 1) { this.table.push(this.obj) } else { this.calcule() }


  }
  savemode(i: any, event: any) {
    this.table[i].mode = event.target.value
  }
  saveinfo(i: any, event: any) {
    this.table[i].info = event.target.value
  }
  savenmontant(i: any, event: any) {
    this.table[i].montant = event.target.value
    this.calcule();
  }

  calcule() {
    let somme = 0
    this.rest = 0
    for (let i = 0; i < this.table.length; i++) {
      somme = somme + Number(this.table[i].montant);
    }
    this.rest = (Number(this.total) - Number(somme)).toFixed(3);
    this.retour = (Number(somme) - Number(this.total)).toFixed(3);
    if (this.retour < 0) { this.retour = 0 }
    if (this.rest < 0) { this.rest = 0 }
    this.rendu = this.retour;
    this.recu = somme


  }

  supp(index: any) {
    this.table.splice(index, 1);
  }

  add() {

    this.obj = {}
    this.obj.mode = "especes"
    this.obj.montant = "0"
    this.obj.info = ""
    this.table.push(this.obj)
  }
  s: any = 0;
  valide() {

    this.dialogRef.close();
    console.log(this.recu)

  }
  //fermer dialogue
  fermerDialogue() {

    this.dialogRef.close();

  }

}

