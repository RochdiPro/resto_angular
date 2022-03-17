import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-donnees',
  templateUrl: './donnees.component.html',
  styleUrls: ['./donnees.component.scss']
})
export class DonneesComponent implements OnInit {

  liste_tva:any=[]
  form: any = new FormGroup({
    achat: new FormControl(""),
    vente: new FormControl(""),     
    ticket: new FormControl(""),
            
  });
  id_facture:any ;  id_vente:any ; id_achat:any ;
  constructor(public service: ServiceService) { 
    this.service.tvas().subscribe((data:any)=>{
         this.liste_tva=data;
    }) 
    
   /*
    this.service.id_achat().subscribe((data:any)=>{this.id_achat=data;})
    this.service.id_vente().subscribe((data:any)=>{this.id_vente=data;})
    this.service.id_facture().subscribe((data:any)=>{this.id_facture=data;})*/

    this.form = new FormGroup({
      achat: new FormControl("2022000000" ),
      vente: new FormControl("2022000000" ),     
      ticket: new FormControl("202200000" ),
              
    });

  }

  ngOnInit(): void {
  }
  
   a:any;
  ajouter ()
  {
    Swal.fire({
      title: 'TVA',
      html:
        '<input type="number" id="swal-input1" class="swal2-input"  placeholder="TVA" >',

      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value
      if (result.isConfirmed) {
        var formData: any = new FormData();
        formData.append('Taxe', this.a[0]);

        if (this.a[0] == '') {
          Swal.fire({
            title: 'Erreur ',
            text: 'Vérifier vos données  ',
            icon: 'warning',
            confirmButtonText: 'ok',

          })
        }
        else {
          this.service.ajouter_tva(formData).subscribe((data) => {
            this.service.tvas().subscribe((data:any)=>{
              this.liste_tva=data;
            })
            Swal.fire(
              'succés',
              'Caisse ajouté avec succés',
              'success'
            )

          })
        }

      }
    })
  }

  // On file Select
  file: any = null; // Variable to store file
Fichier:any;
  onChange(event:any) {
    this.file = event.target.files[0];
    this.Fichier  = new File([event.target.files[0]], 'file', { type: 'application/xml' });  
}

  importer()
  { 
    Swal.fire({
      icon: 'success',      
      cancelButtonText: 'ok',
    })
    var formData: any = new FormData();

    formData.append('Donnee', this.Fichier);
    
    this.service.importer(formData).subscribe(
       
   );
  }
  exporter()
  {
    Swal.fire({
      icon: 'success',      
      cancelButtonText: 'ok',
    })
   let c ;
   this.service.exporter(c).subscribe((data:any)=>{
     
    let blob = new Blob([data], {type: 'application/xml'});

    var downloadURL = window.URL.createObjectURL(data);
    var link = document.createElement('a');
    link.href = downloadURL;
    link.download = "data.xml";
    link.click();
   })
  }

  supp(id:any ,i :any)
  {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_tva(id);   
        this.liste_tva.splice(i, 1);
        Swal.fire(
          'tva Supprimé avec succès!',
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
      this.service.tvas().subscribe((data:any)=>{
        this.liste_tva=data;
   })
    })
  }


  exercice(){ 
    Swal.fire({
      icon: 'success',      
      cancelButtonText: 'ok',
    })
    var formData: any = new FormData();
    formData.append('achat', this.form.get('achat')?.value);
    formData.append('vente',this.form.get('ticket')?.value);
    formData.append('facture', this.form.get('vente')?.value);
    this.service.execice(formData).subscribe((data:any)=>{ });
  }

  user()
  {
    Swal.fire({
      icon: 'success',      
      cancelButtonText: 'ok',
    })
    this.service.Init_Utilisateur().subscribe((data:any)=>{})
  }

  


}
