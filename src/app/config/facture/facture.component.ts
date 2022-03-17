import { DatePipe } from '@angular/common';
import { AttrAst } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ServiceService } from 'src/app/config/service.service';
import Swal from 'sweetalert2';

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-facture',
  templateUrl: './facture.component.html',
  styleUrls: ['./facture.component.scss']
})
export class FactureComponent implements OnInit {

  liste_produit: any;
  liste_Utilisateur: any;
  displayedColumns: string[] = ['id', 'utilisateur', 'etat', 'total', 'sup'];
  etat: any = "";
  dataSource = new MatTableDataSource<table>();

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;

  form: any = new FormGroup({
    id: new FormControl(""),
    utilisateur: new FormControl(""),
    client: new FormControl(""),
    date: new FormControl(""),
  });

  constructor(public service: ServiceService, private datePipe: DatePipe, private router: Router) {
    this.factures();
    this.get_utilisateur();
  }

  user: any;

  factures() {
    this.service.factures().subscribe((data:any) => {
       
       for (let i = 0; i < data.length; i++) {
        data[i].prix=Number(Number(data[i].prix)+0.6).toFixed(3)

       }
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a: any, b: any) => a.id > b.id ? -1 : 1);
      this.dataSource.data = data as table[];
      this.liste_produit.paginator = this.paginator;

    });
  }
  choix(ev: any) {
    this.user = ev.value;
    this.filtre();
  }


  // get liste des unites
  get_utilisateur() {
    this.service.utilisateurs().subscribe((data) => {
      this.liste_Utilisateur = data
    })
  }

  ngOnInit(): void {

  }


  // filtre 4 champs 
  filtre_date: any; filtre_date2: any;
  filtre() {


    if (this.user == undefined) { this.user = "" }

    if (this.form.get('date')?.value == null || this.form.get('date')?.value == undefined || this.form.get('date')?.value == "") {
      this.filtre_date = "";
    }
    else { this.filtre_date = this.datePipe.transform(this.form.get('date')?.value, 'yyyy-MM-dd'); }


    this.service.filtre_facture(
      "date", this.filtre_date,
      "Client", this.form.get('client')?.value,
      "id", this.form.get('id')?.value,
    ).subscribe((data) => {
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a: any, b: any) => a.id > b.id ? -1 : 1);
      this.dataSource.data = data as table[];
      this.liste_produit.paginator = this.paginator;

    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // temps d'attente  
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  obj: any = {}
  liste_ticket: any = []
  Detail: any;
  xmldata: any;
  total: any;
  objxml: any;
  table: any = []
  table_reglement: any = []
  liste_tva: any = []
  liste_tva1: any = []
  imprimer_pdf(id: any) {
    this.service.facture(id).subscribe((data: any) => {
      this.liste_ticket = []
      this.total = data.prix;
      if (data.client == "system") {

        this.service.groupe_facture_ticket(id).subscribe((data2: any) => {
          this.generatePDF_system(data2, id)
        })

      }
      else {
        this.ticket(data.liste[0], data.client, data.id_Fiscale, id)
      }
    })
  }




  async ticket(id: any, client: any, id_f: any, id_facture: any) {
    this.table = []
    this.total = 0;
    this.table_reglement = []
    this.service.Detail_vente(id).subscribe((detail: any) => {
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
              this.objxml.prix = Number(this.objxml.prix_vente) * Number(this.objxml.qte_v)
              this.service.unite(this.xmldata.Produits[0].Produit[j].unite.toString()).subscribe((data55) => {
                this.objxml.unite = data55
              })
              this.table.push(this.objxml)
              this.total = Number(Number(this.total) + Number(this.objxml.prix)).toFixed(3);

            })
          }

        }
        if (this.xmldata.Reglements[0].Reglement != undefined) {
          for (let j = 0; j < this.xmldata.Reglements[0].Reglement.length; j++) {
            this.objxml = {}
            this.objxml.mode = this.xmldata.Reglements[0].Reglement[j].Type.toString()
            this.objxml.montant = this.xmldata.Reglements[0].Reglement[j].Montant.toString()
            this.table_reglement.push(this.objxml)
          }
        }
        if (this.xmldata.Tvas[0].TVA != undefined) {
          for (let j = 0; j < this.xmldata.Tvas[0].TVA.length; j++) {
            this.objxml = {}

            this.objxml.tva = this.xmldata.Tvas[0].TVA[j].Taxe.toString()
            this.objxml.montant = this.xmldata.Tvas[0].TVA[j].Montant.toString()
            this.objxml.val = this.xmldata.Tvas[0].TVA[j].Valeur.toString()
            this.liste_tva.push(this.objxml)
          }
        }
      }
      reader.readAsDataURL(detail);

    })


    await this.delai(500);
    this.generatePDF(client, id_f, id, id_facture)
  }


  generatePDF(client: any, id_f: any, id_ticket: any, id_facture: any) {

    var body: any = [];
    var body2: any = [];


    var obj = new Array();
    obj.push("Id");
    obj.push("Nom");
    obj.push("Qte");
    obj.push("Prix HT");
    obj.push("%TVA");
    obj.push("Prix TTC");
    obj.push("Total TTC");
    body.push(obj);
    for (let i = 0; i < this.table.length; i++) {
      var obj = new Array();
      obj.push(this.table[i].id);
      obj.push(this.table[i].nom);
      obj.push(this.table[i].qte_v);

      let p = this.table[i].prix_vente / ((this.table[i].tva / 100) + 1)
      p = Math.round(p * 1000) / 1000
      obj.push(Number(p).toFixed(3));
      obj.push(this.table[i].tva);
      obj.push(this.table[i].prix_vente);
      obj.push(this.table[i].prix);
      body.push(obj);
    }

    var obj = new Array();
    obj.push("");
    obj.push("timbre");
    obj.push("");
    obj.push("");
    obj.push("");
    obj.push("");
    obj.push("0.600");
    body.push(obj);


    var obj = new Array();
    obj.push("%Tva");
    obj.push("Montant");
    obj.push("Valeur");
    body2.push(obj);

    for (let i = 0; i < this.liste_tva.length; i++) {
      var obj = new Array();
      obj.push(this.liste_tva[i].tva);
      obj.push(Number(this.liste_tva[i].montant).toFixed(3));
      obj.push(Number(this.liste_tva[i].val).toFixed(3));
      body2.push(obj);
    }
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
          text: 'Total : ' + Number(this.total + 0.6).toFixed(3) + ' DT    ',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 60 }
        },
        {
          text: 'Client : ' + client + '',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 80 }
        },
        ,
        {
          text: 'N° Facture : ' + id_facture + '',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 50, y: 40 }
        },
        ,
        {
          text: 'N° ticket : ' + id_ticket + '',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 40 }
        },

        {
          text: 'Identifiant : ' + id_f + '',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 100 }
        },
        {
          text: '' + this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          fontSize: 6,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 10 },

        }
      ],

      content: [

        {
          table: {
            widths: [50, 150, 25, 50, 27, 60, 60],
            body: body,
          },
          fontSize: 10,
          margin: [10, 40, 10, 50]
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

    pdfMake.createPdf(def).open({ defaultFileName: 'vente' + new Date() + '.pdf' });

  }

  obj_tva: any = {}; obj5: any = {}
  generatePDF_system(liste: any, id_facture: any) {
    var body: any = [];
    var body2: any = [];
    var obj = new Array();
    this.liste_tva1 = [];
    obj.push("Id Ticket");
    obj.push("Total");
    body.push(obj);

    for (let i = 0; i < liste.length; i++) {
      var obj = new Array();
      obj.push(liste[i].id);
      obj.push(liste[i].totale);
      body.push(obj);


    }

    var obj = new Array();
    obj.push("timbre");
    obj.push("0.600");
    body.push(obj);



    var obj = new Array();
    obj.push("%Tva");
    obj.push("Montant");
    obj.push("Valeur");
    body2.push(obj);

    for (let i = 0; i < liste.length; i++) {
      for (let j = 0; j < liste[i].liste.length; j++) {
        this.obj5 = {}
        this.obj5.tva = (liste[i].liste[j].tva);
        this.obj5.montant = (Number(liste[i].liste[j].montant).toFixed(3));
        this.obj5.valeur = (Number(liste[i].liste[j].valeur).toFixed(3));
        this.liste_tva1.push(this.obj5);
      }

    }
    console.log(this.liste_tva1)

    this.liste_tva = [];
    for (let i = 0; i < this.liste_tva1.length; i++) {
      this.obj_tva = {};
      this.obj_tva.tva = this.liste_tva1[i].tva;
      this.obj_tva.val = this.liste_tva1[i].valeur
      this.obj_tva.montant = this.liste_tva1[i].montant
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
    console.log(this.liste_tva)

    for (let i = 0; i < this.liste_tva.length; i++) {
      var obj = new Array();
      obj.push(this.liste_tva[i].tva);
      obj.push(this.liste_tva[i].montant);
      obj.push(this.liste_tva[i].val);
      body2.push(obj);
    }
    console.log(body2)

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
          text: 'Total : ' + Number(this.total + 0.6).toFixed(3) + ' DT    ',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 60 }
        },
        {
          text: 'Client : Systeme',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 400, y: 80 }
        },
        ,
        {
          text: 'N° Facture : ' + id_facture + '',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 50, y: 40 }
        },

        {
          text: '' + this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          fontSize: 6,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 10 },

        }
      ],

      content: [

        {
          table: {
            widths: [50, 80],
            body: body,
          },
          fontSize: 10,
          margin: [10, 40, 10, 50]
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
        }



      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'vente' + new Date() + '.pdf' });
  }
}

export class table {
  id: any;
  client: any;
  prix: any;
  date: any;

}