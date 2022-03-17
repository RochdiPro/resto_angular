import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatLabel } from '@angular/material/form-field';
import { ChartDataSets, ChartOptions } from 'chart.js';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';
@Component({
  selector: 'app-statistique',
  templateUrl: './statistique.component.html',
  styleUrls: ['./statistique.component.scss']
})
export class StatistiqueComponent implements OnInit {

  titre: any = []
  valeur: any = []
  titre_annee: any = []
  valeur_annee: any = []
  type2: any = 'doughnut'
  barChartType: any = 'bar';
  barChartData: any = []
  ch_anne : any  ;  
  form: any = new FormGroup({
    anne: new FormControl("")
     
  });
  constructor(public service: ServiceService) {
    

    this.service.vente_utilisateur().subscribe((data: any) => {
      this. get_vente_utilisateur_annee(data)
    })

    this.service.vente_annee().subscribe((data: any) => {
      for (let i = 0; i < data.length; i++) {
        this.titre_annee.push(data[i][1]);
        this.valeur_annee.push(data[i][0]);
      }
    })

    this.service.vente_mois().subscribe((data: any) => {     
      this.get_vente_mois_anne(data) 
    }) 
  }

  // changer anne et get data   
  public get_vente_mois_anne(data:any)
  {
    let tab = []
    let m1 = 0; let m2 = 0; let m3 = 0; let m4 = 0;
    let m8 = 0; let m5 = 0; let m6 = 0; let m7 = 0;
    let m9 = 0; let m10 = 0; let m11 = 0; let m12 = 0;

    for (let i = 0; i < data.length; i++) {
      if (data[i][1] == "01") {
       m1 = data[i][0]
     } else if (data[i][1] == "02") {
       m2 = data[i][0]
     }
     else if (data[i][1] == "03") {
       m3 = data[i][0]
     }
     else if (data[i][1] == "04") {
       m4 = data[i][0]
     }
     else if (data[i][1] == "05") {
       m5 = data[i][0]
     }
     else if (data[i][1] == "06") {
       m6 = data[i][0]
     }
     else if (data[i][1] == "07") {
       m7 = data[i][0]
     }
     else if (data[i][1] == "08") {
       m8 = data[i][0]
     }
     else if (data[i][1] == "09") {
       m9 = data[i][0]
     }
     else if (data[i][1] == "10") {
       m10 = data[i][0]
     }
     else if (data[i][1] == "11") {
       m11 = data[i][0]
     }
     else if (data[i][1] == "12") {
       m12 = data[i][0]
     }
   }

   this.barChartData = [
    { data: [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12], label: 'Mois' },

  ];

  }

  // changer annee et get data utilisateur 
  get_vente_utilisateur_annee(data:any)
  {
    for (let i = 0; i < data.length; i++) {
      this.service.utilisateur(data[i][1]).subscribe((data22: any) => {
        this.titre.push(data22.nom);
      })
      this.valeur.push(data[i][0]);
    }
  }

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  public barChartLegend = true;


  ngOnInit() {
  }


  choix_anne(ev: any) {
    Swal.fire({
      icon: 'success',      
      cancelButtonText: 'ok',
    })
    this.barChartData = [  ];    
    this.titre  = []
    this.valeur  = []
        this.service.get_vente_anne (ev.value).subscribe((data:any)=>{
          this.get_vente_mois_anne(data)
        })

        this.service.get_utilisateur_annee(ev.value).subscribe((data:any)=>{
          this.get_vente_utilisateur_annee(data);
        })
  }


}
