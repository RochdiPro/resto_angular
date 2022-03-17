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
  selector: 'app-lister',
  templateUrl: './lister.component.html',
  styleUrls: ['./lister.component.scss']
})
export class ListerComponent implements OnInit {

  liste_produit:any; 
  liste_Utilisateur: any;
  displayedColumns: string[] = [  'modifier','type',  'id', 'utilisateur', 'etat','total' ,  'sup' ];
  etat:any="";type:any;
  dataSource = new MatTableDataSource<table>();
  
   @ViewChild(MatPaginator) paginator:any= MatPaginator;
   @ViewChild(MatSort, { static: false }) sort:any= MatSort;
  
  form: any = new FormGroup({
    id: new FormControl(""),
    type: new FormControl(""),     
    etat: new FormControl(""),
    fournisseur : new FormControl(""), 
    date : new FormControl(""),
    date_facture : new FormControl(""),         
  });

  constructor(public service: ServiceService ,  private datePipe: DatePipe ,  private router: Router) { 
    this.achats();
   }
  achats() {
    this.service.achats().subscribe((data) => {
      for (let i = 0; i <  data.length; i++) {
        data[i].total=Number(data[i].total).toFixed(3);
      }
       this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a:any, b:any) => a.id  > b.id ? -1 : 1);
      this.dataSource.data = data as table[]; 
      this.liste_produit.paginator = this.paginator;
    })
  }
  user:any;
   
 
  choix(ev: any) {
    this.user = ev.value;
    this.filtre();
  }
 
  choix_etat(ev: any) {
    this.etat = ev.value;
    this.filtre();
  }
  choix_type(ev: any) {
    this.type = ev.value;
    this.filtre();
  }
  
   fournisseur:any;
   type_achat:any;
   id_facture:any;
   date_facture:any;
   Detail:any;
   xmldata:any;
   objxml:any;
   liste_produits:any=[];
  //voire un achat en forme pdf
  pdf (  id: any) {
     this.service.achat(id).subscribe((detail: any) => { 
        this.fournisseur=detail.fournisseur
        this.type_achat= detail.type
        this.id_facture = detail.id_Fournisseur 
        this.date_facture =(this.datePipe.transform(detail.date_Facture, 'yyyy-MM-dd'))       
    })
    this.service.Detail_achat( id).subscribe((detail: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.Detail = reader.result;
        var parseString = require('xml2js').parseString;
        let data1
        parseString(atob(this.Detail.substr(28)), function (err: any, result: any) {
          data1 = result.Achat;
        })
        this.xmldata = data1
      
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
            
            this.liste_produits.push(this.objxml)
          }


        }
        this.generatePDF()
      }
      reader.readAsDataURL(detail);
    })
  }


  ch: any
  modeleSrc: any;
  //impression de la fiche recption
  generatePDF() {

    var body: any = [];
    var obj = new Array();
    let s=0;
    obj.push("Id");
    obj.push("Nom");
    obj.push("Qte");
    obj.push("Prix U HT");
    obj.push("%TVA");
    obj.push("Prix U ttc");
    obj.push("Total TTC");
    body.push(obj);
    for (let i = 0; i < this.liste_produits.length; i++) {
      var obj = new Array();
      obj.push(this.liste_produits[i].id);
      obj.push(this.liste_produits[i].nom);
      obj.push(this.liste_produits[i].qte);
      obj.push(this.liste_produits[i].prix);
      obj.push(this.liste_produits[i].tva);
      obj.push(this.liste_produits[i].prix_ttc);      
      obj.push(this.liste_produits[i].total_ttc);
      s=Number(s)+Number(this.liste_produits[i].total_ttc);
      body.push(obj);
    }
    console.log(this.liste_produits)

    console.log(body)
    var def = {
      defaultStyle: {
        // alignment: 'justify'
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
          text: 'Total : ' +Number(s).toFixed(3)+ ' DT    ',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 440, y: 60 }
        },

        {
          text: '' + this.datePipe.transform(new Date(), 'dd/MM/yyyy'),
          fontSize: 6,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 10 },

        },
        {
          text: 'Fournisseur : ' + this.fournisseur,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 70, y: 60 }
        },
        {
          text: ' Id_facture : ' + this.id_facture,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 70, y: 80 }
        },
        {
          text: ' Date : ' + this.datePipe.transform(this.date_facture, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 70, y: 100 }
        },

      ],

      content: [

        {
          table: {
            widths: [40, 170, 30, 50,27, 50,50],
            body: body,
          },
          fontSize: 10,
          margin: [10, 40, 10, 300]
        }


      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'achat' + new Date() + '.pdf' });

  }
  
  ngOnInit(): void {

  }

   
  // edit un achat 
  edit( id :any , etat:any)
  {
    console.log(etat)
    if(etat == "en cours")
    {
      this.router.navigate(['/menu/achat/'+id]); 
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: '',
        text: "vous n'avez pas le droit de modifier un achat déjà affecté",
      })
    }
  }
 // filtre 4 champs 
 filtre_date:any;filtre_date2:any;
  filtre() {
  
    if(this.type==undefined){this.type=""}
    if(this.etat==undefined){this.etat=""}
    if (this.form.get('date')?.value == null || this.form.get('date')?.value == undefined || this.form.get('date')?.value == "") {
      this.filtre_date = "";
    }
    else { this.filtre_date = this.datePipe.transform(this.form.get('date')?.value, 'yyyy-MM-dd'); }

    if (this.form.get('date_facture')?.value == null || this.form.get('date_facture')?.value == undefined || this.form.get('date_facture')?.value == "") {
      this.filtre_date2 = "";
    }
    else { this.filtre_date2 = this.datePipe.transform(this.form.get('date_facture')?.value, 'yyyy-MM-dd'); }
    this.service.filtre_achat(
    "date", this.filtre_date,
    "date_facture", this.filtre_date2,
     "type", this.type,
     "fournisseur",this.form.get('fournisseur')?.value,
      "etat", this.etat   ).subscribe((data:any)=>{
        for (let i = 0; i <  data.length; i++) {
          data[i].total=Number(data[i].total).toFixed(3);
        }
      this.dataSource.data = data as table[];
      this.liste_produit = data;
      this.liste_produit = this.liste_produit.sort((a:any, b:any) => a.id  > b.id ? -1 : 1);
      this.dataSource.data = data as table[]; 
      this.liste_produit.paginator = this.paginator;

    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

}

export class table {
  id: any;
  id_utilisateur: any;
  totale : any;
  etat : any;
  type:any;
   
}