import { DatePipe } from '@angular/common';
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
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.scss']
})
export class TicketsComponent implements OnInit {

  liste_produit: any;
  liste_Utilisateur: any;
  displayedColumns: string[] = ['id', 'utilisateur', 'etat', 'total', 'date', 'sup'];
  etat: any = ""; type: any = ""
  dataSource = new MatTableDataSource<table>();

  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: any = MatSort;

  form: any = new FormGroup({
    id: new FormControl(""),
    utilisateur: new FormControl(""),
    date: new FormControl(""),
    type: new FormControl(""),

  });
  ticket_non_facture: any;
  constructor(public service: ServiceService, private datePipe: DatePipe, private router: Router) {
    this.filtre();
    this.get_utilisateur();
    this.ticket_non_facture = 0
    this.service.get_somme_ticket_non_facture().subscribe((d) => {
       this.ticket_non_facture = Number(d).toFixed(3); })
  }

  user: any;
  choix(ev: any) {
    this.user = ev.value;
    this.filtre();
  }

  choix_type(ev: any) {
    this.type = ev.value;
    this.filtre();
  }

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





  ngOnInit(): void {

  }



  // ticket
  Detail: any; xmldata: any; objxml: any = {}; total: any = 0;
  table: any = []; client: any; table_reglement: any = [];
  id_vente: any;
  liste_tva: any = [];
  // temps d'attente  
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ticket(id: any) {
    this.table = []
    this.total = 0;
    this.table_reglement = []
    this.service.vente(id).subscribe((data: any) => {
      this.client = data.client
    })
    this.id_vente = id;
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
    this.generatePDF(this.client)
  }


  generatePDF(client: any) {

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
          text: 'Ticket',
          fontSize: 18,
          color: 'black',
          bold: true,
          relativePosition: { x: 250, y: 20 }
        },
        {
          text: 'Total : ' + Number(this.total).toFixed(3) + ' DT    ',
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
          text: 'N° Vente : ' + this.id_vente + '',
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

        }
      ],

      content: [

        {
          table: {
            widths: [50, 150, 25, 50, 27, 60, 60],
            body: body,
          },
          fontSize: 10,
          margin: [10, 0, 10, 50]
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
  // abondonner une ticket et entre de nauveaux au stock 
  abondonner(id: any) {
    this.service.abondonner(id).subscribe((data) => {
      this.filtre();

    })
  }


  // filtre 4 champs 
  filtre_date: any; filtre_date2: any;
  filtre() {

    if (this.user == undefined) { this.user = "" }

    if (this.form.get('date')?.value == null || this.form.get('date')?.value == undefined || this.form.get('date')?.value == "") {
      this.filtre_date = "";
    }
    else { this.filtre_date = this.datePipe.transform(this.form.get('date')?.value, 'yyyy-MM-dd'); }


    this.service.filtre_vente(
      "date", this.filtre_date,
      "type", this.type,
      "id_utlisateur", this.user,
      "id", this.form.get('id')?.value,
    ).subscribe((data:any) => {
      for (let i = 0; i <  data.length; i++) {
        data[i].total=Number(data[i].total).toFixed(3);
      }
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

  // facture les ticket choisi 
  facturation() {
    Swal.fire({
      icon: 'success',      
      cancelButtonText: 'ok',
    })
    if(this.ticket_non_facture==0){
    Swal.fire({
      icon: 'error',
      title: '',
      text: '  ',
    })}
    else{
    this.service.Facturation().subscribe((d) => { })
    window.location.reload();
    }
  }

}

export class table {
  id: any;
  id_utilisateur: any;
  totale: any;
  date: any;
  test: any

}