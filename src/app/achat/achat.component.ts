 import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
 
import Swal from 'sweetalert2';
import { ServiceService } from '../config/service.service';
import { AjouterArticlesComponent } from './ajouter-articles/ajouter-articles.component';
import { DocumentViewer, DocumentViewerOptions } from '@awesome-cordova-plugins/document-viewer/ngx';
import { FileOpener } from '@awesome-cordova-plugins/file-opener/ngx';
//import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@angular/cdk/platform';
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-achat',
  templateUrl: './achat.component.html',
  styleUrls: ['./achat.component.scss']
})
export class AchatComponent implements AfterViewInit {

  entree_deja: any;
  ancien_date: any;
  liste_produits: any = [];
  res_data: any
  total: any = 0;
  total_ht: any = 0;
  id: any;
  Detail: any; xmldata: any;
  objxml: any = {}
  test: any = false;
  test2: any = false;
  form: any = new FormGroup({
    fournisseur: new FormControl(""),
    id_facture: new FormControl(""),
    type: new FormControl(""),
    date: new FormControl(""),
  });
  pric_timbre: any = 0;
  session: any; user: any;
  unite: any = {};
  liste_tva: any = [];
  /**
   * 
    en cas -1 je peux ajouter un nouveau achat sinon je recoupais le donner d'achat en cas si n'est pas affecté et modifiez-le 
   */
  // 
  constructor(   public dialog: MatDialog, private datePipe: DatePipe, private service: ServiceService, private route: ActivatedRoute, private http: HttpClient, private router: Router) {
    this.session = JSON.parse(localStorage.getItem("session") + "");
    this.user = JSON.parse(localStorage.getItem("User") + "");
    this.form = new FormGroup({
      fournisseur: new FormControl(""),
      id_facture: new FormControl(""),
      type: new FormControl(""),
      date: new FormControl(""),

    });

    this.id = this.route.snapshot.params.id
    if (this.route.snapshot.params.id + "" == "-1") {
      this.test = true
    }
    else {
      this.test2 = true;
      this.service.achat(this.route.snapshot.params.id).subscribe((detail: any) => {
        this.entree_deja = detail.etat;
        this.ancien_date = detail.date_Facture;
        this.form = new FormGroup({
          fournisseur: new FormControl("" + detail.fournisseur),
          type: new FormControl("" + detail.type),
          id_facture: new FormControl("" + detail.id_Fournisseur),
          date: new FormControl(this.datePipe.transform(detail.date_Facture, 'yyyy-MM-dd')),

        });
      })
      this.service.Detail_achat(this.route.snapshot.params.id).subscribe((detail: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.Detail = reader.result;
          var parseString = require('xml2js').parseString;
          let data1
          parseString(atob(this.Detail.substr(28)), function (err: any, result: any) {
            data1 = result.Achat;
          })
          this.xmldata = data1
          this.unite.nom = "-"
          if (this.xmldata.Produits[0].Produit != undefined) {
            for (let j = 0; j < this.xmldata.Produits[0].Produit.length; j++) {
              this.objxml = {}
              this.objxml.id = this.xmldata.Produits[0].Produit[j].Id.toString()
              this.objxml.qte = this.xmldata.Produits[0].Produit[j].Qte.toString()
              this.objxml.nom = this.xmldata.Produits[0].Produit[j].Nom.toString()
              this.objxml.prix = Number(this.xmldata.Produits[0].Produit[j].prix_u_ht.toString()).toFixed(3)
              this.objxml.prix_ttc = Number(this.xmldata.Produits[0].Produit[j].prix_ttc.toString()).toFixed(3)
              this.objxml.total_ttc = Number(this.xmldata.Produits[0].Produit[j].total_ttc.toString()).toFixed(3)
              this.objxml.code = this.xmldata.Produits[0].Produit[j].code.toString()
              this.objxml.tva = this.xmldata.Produits[0].Produit[j].tva.toString()
              this.objxml.unite = this.unite
              this.ajouter_article_table(this.objxml)
            }


          }
        }
        reader.readAsDataURL(detail);
      })
    }
  }

  // choisir le type d'achat et ajoute 0.6 dt  en totale en cas de facture 
  choix_type(ev: any) {
    if (ev.value == "facture") {
      this.pric_timbre = 0.6;
    } else { this.pric_timbre = 0 }
    this.calcule_total();

  }
  ngOnInit(): void {

  }

  ngAfterViewInit(): void {

  }


  //** open Dialog */
  openDialog() {
    const dialogRef = this.dialog.open(AjouterArticlesComponent, {
      height: '600px', width:'100%', data: {
      }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.res_data = res.data
      if (res != undefined) {
        this.total = 0;
        for (let i = 0; i < this.res_data.length; i++) {
          this.ajouter_article_table(this.res_data[i])
        }

      }
    });
  }

  // ajouter un produit a la liste des produits 
  prod_trouve: any = false; obj_tva: any;
  ajouter_article_table(obj: any) {

    if (this.liste_produits.length == 0) {
      obj.prix = Number(obj.prix).toFixed(3)
      obj.prix_ttc = Number(obj.prix_ttc).toFixed(3)

      this.liste_produits.push(obj)
    }
    else {
      this.prod_trouve = false;
      for (let i = 0; i < this.liste_produits.length; i++) {
        if (obj.id == this.liste_produits[i].id) {
          this.liste_produits[i].qte = Number(this.liste_produits[i].qte) + Number(obj.qte)
          this.liste_produits[i].prix = Number(obj.prix).toFixed(3)
          this.liste_produits[i].prix_ttc = Number(obj.prix_ttc).toFixed(3)
          this.liste_produits[i].total_ttc = Number(Number(this.liste_produits[i].qte) * obj.prix_ttc).toFixed(3)
          this.liste_produits[i].total_ht = Number(Number(this.liste_produits[i].qte) * obj.prix).toFixed(3)
          this.prod_trouve = true

        }
      }
      if (this.prod_trouve == false) {
        obj.prix = Number(obj.prix).toFixed(3)
        obj.prix_ttc = Number(obj.prix_ttc).toFixed(3)
        this.liste_produits.push(obj)
      }
    }
    this.calcule_total();
    this.calcule_tva();

  }


  // calculer assite et tva 
  calcule_tva() {
    this.liste_tva = [];
    for (let i = 0; i < this.liste_produits.length; i++) {
      this.obj_tva = {};
      this.obj_tva.tva = this.liste_produits[i].tva;
      this.obj_tva.val = Number((this.liste_produits[i].prix_ttc - this.liste_produits[i].prix) * this.liste_produits[i].qte).toFixed(3)
      console.log(this.liste_produits[i].prix_ttc + "-" + this.liste_produits[i].prix + " - " + this.liste_produits[i].qte);
      this.obj_tva.montant = Number((this.liste_produits[i].prix) * this.liste_produits[i].qte).toFixed(3)
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


  //  ajouter un achat du stock  ou base de donner 
  resultat_ajout_achat: any;
  save_data() {

    if (this.form.get('fournisseur').value == "" || this.form.get('id_facture').value == "" || this.form.get('type').value == "" || this.form.get('date').value == null || this.liste_produits.length == 0) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Vérifier vos données ',
      })
    } else {
      var formData: any = new FormData();
      var doc = document.implementation.createDocument("Achat", "", null);
      var Achat = doc.createElement("Achat");
      var total = doc.createElement("Total"); total.innerHTML = this.total
      var user = doc.createElement("Utilisateur"); user.innerHTML = "655"
      var Produits = doc.createElement("Produits");
      var tvas = doc.createElement("Tvas");
      for (let i = 0; i < this.liste_tva.length; i++) {
        var tva = doc.createElement('TVA'); tva.innerHTML = this.liste_tva[i].tva
        var t = doc.createElement('Taxe'); t.innerHTML = this.liste_tva[i].tva
        var t1 = doc.createElement('Valeur'); t1.innerHTML = this.liste_tva[i].val
        var t2 = doc.createElement('Montant' + this.liste_tva[i].montant); t2.innerHTML = this.liste_tva[i].montant
        tva.appendChild(t)
        tva.appendChild(t1)
        tva.appendChild(t2)
        tvas.appendChild(tva);

      }
      for (let i = 0; i < this.liste_produits.length; i++) {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.liste_produits[i].id
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.liste_produits[i].nom
        var code = doc.createElement('code'); code.innerHTML = this.liste_produits[i].code
        var prix_u = doc.createElement('prix_u_ht'); prix_u.innerHTML = this.liste_produits[i].prix
        var prix_ttc = doc.createElement('prix_ttc'); prix_ttc.innerHTML = this.liste_produits[i].prix_ttc
        var total_ttc = doc.createElement('total_ttc'); total_ttc.innerHTML = this.liste_produits[i].total_ttc
        var qte = doc.createElement('Qte'); qte.innerHTML = this.liste_produits[i].qte
        var tva8 = doc.createElement('tva'); tva8.innerHTML = this.liste_produits[i].tva
        var unite = doc.createElement('unite'); unite.innerHTML = this.liste_produits[i].unite.id
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(code);
        Produit.appendChild(prix_u);
        Produit.appendChild(prix_ttc);
        Produit.appendChild(total_ttc);
        Produit.appendChild(qte);
        Produit.appendChild(tva8);
        Produit.appendChild(unite);
        Produits.appendChild(Produit);
      }
      Achat.appendChild(user)
      Achat.appendChild(tvas)
      Achat.appendChild(total)
      Achat.appendChild(Produits)
      doc.appendChild(Achat)
      console.log(doc)
      let url = "assets/achat.xml";
      fetch(url)
        .then(response => response.text())
        .then(data => {
          let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
          var myBlob = new Blob([xml2string], { type: 'application/xml' });
          var myFile = this.convertBlobFichier(myBlob, "assets/achat.xml");

          formData.append('Detail', myFile);
          formData.append('Utilisateur', this.user.id);
          formData.append('Total', this.total);
          formData.append('Fournisseur', this.form.get('fournisseur').value)
          formData.append('Type', this.form.get('type').value)
          formData.append('Date', this.form.get('date').value)
          formData.append('Id_Facture', this.form.get('id_facture').value)
          if (this.test) {
            this.service.ajouter_achat(formData).subscribe((data) => {
              this.resultat_ajout_achat = data
              this.service.valider_achat(this.resultat_ajout_achat.id).subscribe((dataa) => { })
              Swal.fire({
                icon: 'success',
                confirmButtonColor: 'green',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Imprimer',
                cancelButtonText: 'Quitter',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.generatePDF()
                  this.router.navigate(['/menu/lister_achat']);
                }
              })
              this.router.navigate(['/menu/lister_achat']);
            });

          }

        });
    }
  }

  //  ajouter un achat du stock  ou base de donner 
  conserver_data() {

    if (this.form.get('fournisseur').value == "" || this.form.get('id_facture').value == "" || this.form.get('type').value == "" || this.form.get('date').value == null || this.liste_produits.length == 0) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Vérifier vos données ',
      })
    } else {
      var formData: any = new FormData();
      var doc = document.implementation.createDocument("Achat", "", null);
      var Achat = doc.createElement("Achat");
      var total = doc.createElement("Total"); total.innerHTML = this.total
      var user = doc.createElement("Utilisateur"); user.innerHTML = "655"
      var Produits = doc.createElement("Produits");
      var tvas = doc.createElement("Tvas");
      for (let i = 0; i < this.liste_tva.length; i++) {
        var tva = doc.createElement('TVA'); tva.innerHTML = this.liste_tva[i].tva
        var t = doc.createElement('Taxe'); t.innerHTML = this.liste_tva[i].tva
        var t1 = doc.createElement('Valeur'); t1.innerHTML = this.liste_tva[i].val
        var t2 = doc.createElement('Montant' + this.liste_tva[i].montant); t2.innerHTML = this.liste_tva[i].montant
        tva.appendChild(t)
        tva.appendChild(t1)
        tva.appendChild(t2)
        tvas.appendChild(tva);

      }
      for (let i = 0; i < this.liste_produits.length; i++) {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.liste_produits[i].id
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.liste_produits[i].nom
        var code = doc.createElement('code'); code.innerHTML = this.liste_produits[i].code
        var prix_u = doc.createElement('prix_u_ht'); prix_u.innerHTML = this.liste_produits[i].prix
        var prix_ttc = doc.createElement('prix_ttc'); prix_ttc.innerHTML = this.liste_produits[i].prix_ttc
        var total_ttc = doc.createElement('total_ttc'); total_ttc.innerHTML = this.liste_produits[i].total_ttc
        var qte = doc.createElement('Qte'); qte.innerHTML = this.liste_produits[i].qte
        var tva8 = doc.createElement('tva'); tva8.innerHTML = this.liste_produits[i].tva
        var unite = doc.createElement('unite'); unite.innerHTML = this.liste_produits[i].unite.id
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(code);
        Produit.appendChild(prix_u);
        Produit.appendChild(prix_ttc);
        Produit.appendChild(total_ttc);
        Produit.appendChild(qte);
        Produit.appendChild(tva8);
        Produit.appendChild(unite);
        Produits.appendChild(Produit);
      }
      Achat.appendChild(user)
      Achat.appendChild(tvas)
      Achat.appendChild(total)
      Achat.appendChild(Produits)
      doc.appendChild(Achat)
      console.log(doc)
      let url = "assets/achat.xml";
      fetch(url)
        .then(response => response.text())
        .then(data => {
          let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
          var myBlob = new Blob([xml2string], { type: 'application/xml' });
          var myFile = this.convertBlobFichier(myBlob, "assets/achat.xml");

          formData.append('Detail', myFile);
          formData.append('Utilisateur', this.user.id);
          formData.append('Total', this.total);
          formData.append('Fournisseur', this.form.get('fournisseur').value)
          formData.append('Type', this.form.get('type').value)
          formData.append('Date', this.form.get('date').value)
          formData.append('Id_Facture', this.form.get('id_facture').value)
          if (this.test) {
            this.service.ajouter_achat(formData).subscribe((data) => {
              this.resultat_ajout_achat = data
              Swal.fire({
                icon: 'success',
                confirmButtonColor: 'green',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Imprimer',
                cancelButtonText: 'Quitter',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.generatePDF()
                  this.router.navigate(['/menu/lister_achat']);
                }
              })
              this.router.navigate(['/menu/lister_achat']);
            });

          }

        });
    }
  }

  //  entree data en stock 
  affecter_data() {
    if (this.entree_deja == "en cours") {
      this.service.valider_achat(this.id).subscribe((dataa) => {
      })
    }

    this.router.navigate(['/menu/lister_achat']);

  }

  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File><unknown>theBlob;
  }
  // modifier ligne de table
  a: any;
  modifierobj(obj: any) {

    Swal.fire({
      title: 'Produit',
      html:
        'Qte <input id="swal-input2"  type="number" value="' + obj.qte + '" class="swal2-input" placeholder="' + obj.qte + '">',

      focusConfirm: false,
      preConfirm: () => {
        return [
          (<HTMLInputElement>document.getElementById('swal-input2')).value,

        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value

      if (result.isConfirmed) {
        obj.qte = this.a[0]
        obj.total_ttc = Number(obj.prix_ttc * obj.qte).toFixed(3)
        this.calcule_total();
        this.calcule_tva();

      }
      Swal.fire(
        'Modifier',
        ' ',
        'success'
      )

    })

  }

  



  ch: any
  modeleSrc: any;
  e: any = {}
  pdfObj:any;
  //impression de la fiche recption
  generatePDF() {

    var body: any = [];
    var body2: any = [];
    var body3: any = [];
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
    for (let i = 0; i < this.liste_produits.length; i++) {
      var obj = new Array();
      this.e = { text: this.liste_produits[i].id, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.liste_produits[i].nom }
      obj.push(this.e)

      this.e = { text: this.liste_produits[i].qte, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.liste_produits[i].unite.nom, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.liste_produits[i].prix, alignment: 'right' }
      obj.push(this.e)

      this.e = { text: this.liste_produits[i].tva, alignment: 'center' }
      obj.push(this.e)

      this.e = { text: this.liste_produits[i].prix_ttc, alignment: 'right' }
      obj.push(this.e)

      let p = Number((this.liste_produits[i].prix) * (this.liste_produits[i].qte)).toFixed(3)
      this.e = { text: p, alignment: 'right' }
      obj.push(this.e);

      this.e = { text: this.liste_produits[i].total_ttc, alignment: 'right' }
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
    this.e = { text: Number(this.pric_timbre).toFixed(3), alignment: 'right' }
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
    var def = {
      defaultStyle: {
        alignment: 'centre'

      },
      pageMargins: [40, 100, 40, 180],
      info: {
        title: 'achat',
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
          text: 'Achat',
          fontSize: 18,
          color: 'black',
          bold: true,
          relativePosition: { x: 250, y: 20 }
        },
        {
          text: '' + this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          fontSize: 6,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 10 },

        },
        {
          text: 'Fournisseur : ' + this.form.get('fournisseur').value,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 70, y: 60 }
        },
        {
          text: ' N° Facture : ' + this.form.get('id_facture').value,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 70, y: 80 }
        },
        {
          text: ' Date : ' + this.datePipe.transform(this.form.get('date').value, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 70, y: 100 }
        },

      ],
      content: [

        {
          table: {
            widths: [30, 100, 30, 30, 45, 27, 50, 50, 50],
            body: body,
          },
          fontSize: 10,
          margin: [10, 40, 10, 20],
        } 
        ,
        {
          table: {
            widths: [25, 50, 50],
            body: body2,
          },
          fontSize: 10,
          margin: [10, 20, 10, 50],
        },
        {
          table: {
            widths: [50, 55, 15],
            body: body3,
          },
          fontSize: 10,
          margin: [383, 0, 0, 0],
          layout: 'noBorders',
        }
      ],

    };

   
     
    this.pdfObj = pdfMake.createPdf(def); 
      pdfMake.createPdf(def).open({ defaultFileName: 'achat' + new Date() + '.pdf' });
      const options: DocumentViewerOptions = {
        title: 'My PDF'
      } 
  }


  // modifer be si tout 
  modifer_be() {
    if (this.form.get('fournisseur').value == "" || this.form.get('id_facture').value == "" || this.form.get('type').value == "" || this.form.get('date').value == null || this.liste_produits.length == 0) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Vérifier vos données ',
      })
    } else {
      var formData: any = new FormData();
      var doc = document.implementation.createDocument("Achat", "", null);
      var Achat = doc.createElement("Achat");
      var total = doc.createElement("Total"); total.innerHTML = this.total
      var user = doc.createElement("Utilisateur"); user.innerHTML = "655"
      var Produits = doc.createElement("Produits");
      var tvas = doc.createElement("Tvas");
      for (let i = 0; i < this.liste_tva.length; i++) {
        var tva = doc.createElement('TVA'); tva.innerHTML = this.liste_tva[i].tva
        var t = doc.createElement('Taxe'); t.innerHTML = this.liste_tva[i].tva
        var t1 = doc.createElement('Valeur'); t1.innerHTML = this.liste_tva[i].val
        var t2 = doc.createElement('Montant' + this.liste_tva[i].montant); t2.innerHTML = this.liste_tva[i].montant
        tva.appendChild(t)
        tva.appendChild(t1)
        tva.appendChild(t2)
        tvas.appendChild(tva);

      }
      for (let i = 0; i < this.liste_produits.length; i++) {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.liste_produits[i].id
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.liste_produits[i].nom
        var code = doc.createElement('code'); code.innerHTML = this.liste_produits[i].code
        var prix_u = doc.createElement('prix_u_ht'); prix_u.innerHTML = this.liste_produits[i].prix
        var prix_ttc = doc.createElement('prix_ttc'); prix_ttc.innerHTML = this.liste_produits[i].prix_ttc
        var total_ttc = doc.createElement('total_ttc'); total_ttc.innerHTML = this.liste_produits[i].total_ttc
        var qte = doc.createElement('Qte'); qte.innerHTML = this.liste_produits[i].qte
        var tva8 = doc.createElement('tva'); tva8.innerHTML = this.liste_produits[i].tva
        var unite = doc.createElement('unite'); unite.innerHTML = this.liste_produits[i].unite.id
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(code);
        Produit.appendChild(prix_u);
        Produit.appendChild(prix_ttc);
        Produit.appendChild(total_ttc);
        Produit.appendChild(qte);
        Produit.appendChild(tva8);
        Produit.appendChild(unite);
        Produits.appendChild(Produit);
      }
      Achat.appendChild(user)
      Achat.appendChild(tvas)
      Achat.appendChild(total)
      Achat.appendChild(Produits)
      doc.appendChild(Achat)
      console.log(doc)
      let url = "assets/achat.xml";
      fetch(url)
        .then(response => response.text())
        .then(data => {
          let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
          var myBlob = new Blob([xml2string], { type: 'application/xml' });
          var myFile = this.convertBlobFichier(myBlob, "assets/achat.xml");

          formData.append('Detail', myFile);
          formData.append('Utilisateur', this.user.id);
          formData.append('Total', this.total);
          formData.append('Fournisseur', this.form.get('fournisseur').value)
          formData.append('Type', this.form.get('type').value)
          let newDate = new Date(this.form.get('date').value);
          formData.append('Date', newDate)
          formData.append('Id_Facture', this.form.get('id_facture').value)
          formData.append('Id', this.id)

          this.service.modifier_achat(formData).subscribe((data) => {


            this.resultat_ajout_achat = data
            Swal.fire({
              icon: 'success',
              confirmButtonColor: 'green',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Imprimer',
              cancelButtonText: 'Quitter',
            }).then((result) => {
              if (result.isConfirmed) {
                this.generatePDF()
                this.router.navigate(['/menu/lister_achat']);
              }
            })
            this.router.navigate(['/menu/lister_achat']);
          });



        });
    }


  }
  // recuperer le unite de produit
  get_unite(id: any) {
    this.service.produit(id).subscribe((data55) => {
      for (let i = 0; i < this.liste_produits.length; i++) {
        if (this.liste_produits[i].id == id) {
          this.liste_produits[i].unite = data55.unite
        }

      }
    })


  }

  // supprimer article 
  supp(i: any, id: any) {
    this.liste_produits.splice(i, 1)
    this.calcule_total();

  }

  // calcule total 
  calcule_total() {
    let s = 0;
    let s2 = 0;
    for (let j = 0; j < this.liste_produits.length; j++) {
      s = Number(s) + Number(this.liste_produits[j].total_ttc);
      s2 = Number(s2) + Number(this.liste_produits[j].total_ht);
    }
    s = Number(s) + Number(this.pric_timbre);
    this.total = (Number(s)).toFixed(3)
    this.total_ht = (Number(s2)).toFixed(3)
  }


  // modifier be et affecter le 
  modifer_be_affecter() {
    if (this.form.get('fournisseur').value == "" || this.form.get('id_facture').value == "" || this.form.get('type').value == "" || this.form.get('date').value == null || this.liste_produits.length == 0) {
      Swal.fire({
        icon: 'error',
        title: '',
        text: 'Vérifier vos données ',
      })
    } else {
      var formData: any = new FormData();
      var doc = document.implementation.createDocument("Achat", "", null);
      var Achat = doc.createElement("Achat");
      var total = doc.createElement("Total"); total.innerHTML = this.total
      var user = doc.createElement("Utilisateur"); user.innerHTML = "655"
      var Produits = doc.createElement("Produits");
      var tvas = doc.createElement("Tvas");
      for (let i = 0; i < this.liste_tva.length; i++) {
        var tva = doc.createElement('TVA'); tva.innerHTML = this.liste_tva[i].tva
        var t = doc.createElement('Taxe'); t.innerHTML = this.liste_tva[i].tva
        var t1 = doc.createElement('Valeur'); t1.innerHTML = this.liste_tva[i].val
        var t2 = doc.createElement('Montant' + this.liste_tva[i].montant); t2.innerHTML = this.liste_tva[i].montant
        tva.appendChild(t)
        tva.appendChild(t1)
        tva.appendChild(t2)
        tvas.appendChild(tva);

      }
      for (let i = 0; i < this.liste_produits.length; i++) {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.liste_produits[i].id
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.liste_produits[i].nom
        var code = doc.createElement('code'); code.innerHTML = this.liste_produits[i].code
        var prix_u = doc.createElement('prix_u_ht'); prix_u.innerHTML = this.liste_produits[i].prix
        var prix_ttc = doc.createElement('prix_ttc'); prix_ttc.innerHTML = this.liste_produits[i].prix_ttc
        var total_ttc = doc.createElement('total_ttc'); total_ttc.innerHTML = this.liste_produits[i].total_ttc
        var qte = doc.createElement('Qte'); qte.innerHTML = this.liste_produits[i].qte
        var tva8 = doc.createElement('tva'); tva8.innerHTML = this.liste_produits[i].tva
        var unite = doc.createElement('unite'); unite.innerHTML = this.liste_produits[i].unite.id
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(code);
        Produit.appendChild(prix_u);
        Produit.appendChild(prix_ttc);
        Produit.appendChild(total_ttc);
        Produit.appendChild(qte);
        Produit.appendChild(tva8);
        Produit.appendChild(unite);
        Produits.appendChild(Produit);
      }
      Achat.appendChild(user)
      Achat.appendChild(tvas)
      Achat.appendChild(total)
      Achat.appendChild(Produits)
      doc.appendChild(Achat)
      console.log(doc)
      let url = "assets/achat.xml";
      fetch(url)
        .then(response => response.text())
        .then(data => {
          let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
          var myBlob = new Blob([xml2string], { type: 'application/xml' });
          var myFile = this.convertBlobFichier(myBlob, "assets/achat.xml");

          formData.append('Detail', myFile);
          formData.append('Utilisateur', this.user.id);
          formData.append('Total', this.total);
          formData.append('Fournisseur', this.form.get('fournisseur').value)
          formData.append('Type', this.form.get('type').value)
          let newDate = new Date(this.form.get('date').value);
          formData.append('Date', newDate)
          formData.append('Id_Facture', this.form.get('id_facture').value)
          formData.append('Id', this.id)

          this.service.modifier_achat(formData).subscribe((data) => {
            this.resultat_ajout_achat = data
            this.service.valider_achat(this.resultat_ajout_achat.id).subscribe((dataa) => { })

            Swal.fire({
              icon: 'success',
              confirmButtonColor: 'green',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Imprimer',
              cancelButtonText: 'Quitter',
            }).then((result) => {
              if (result.isConfirmed) {
                this.generatePDF()
                this.router.navigate(['/menu/lister_achat']);
              }
            })
            this.router.navigate(['/menu/lister_achat']);
          });



        });
    }
  }

}

