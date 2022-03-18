import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-composant',
  templateUrl: './composant.component.html',
  styleUrls: ['./composant.component.scss']
})
export class ComposantComponent implements OnInit {
  formproduit: any = { nom: "", categorie: "", unite: "", valeur: "1", code: "" }
  produit: any = FormGroup;

  
  form_unite: any = new FormGroup({
    unite: new FormControl(""),
  });
  form_categorie: any = new FormGroup({
    categorie: new FormControl(""),
  });
  liste_balance: any;
  liste_caisse: any;
  liste_imprimante: any;
 
  constructor(public service: ServiceService) {
  
    this.get_categories();
    this.produit = new FormGroup({
      nom: new FormControl(''),
      categorie: new FormControl(''),
      image: new FormControl(''),
      unite: new FormControl(''),
      valeur: new FormControl(''),
      code: new FormControl(''),
      tva: new FormControl(''),
    });
  }

  // get liste des categories
  liste_categorie: any;
  get_categories() {
    this.service.categories().subscribe((data) => {
      this.liste_categorie = data
    })
  
  }
  // get liste des balance
  get_liste_balance() {
    this.service.balances().subscribe((data) => {
      this.liste_balance = data
    })
  }

  // get liste des balance
  get_liste_imprimante() {
    this.service.imprimantes().subscribe((data) => {
      this.liste_imprimante = data
    })
  }

  // get liste des balance
  get_liste_caisse() {
    this.service.caisses().subscribe((data) => {
      this.liste_caisse = data
    })
  }



  // Supprimer_balance   avec id 
  Supprimer_balance(i: any, id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_balance(id)
        this.get_liste_balance();
        Swal.fire(
          'balance Supprimé avec succès!', '',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
      this.get_liste_balance();
    })
  }

  //supprimer_ caisse avec id
  Supprimer_caisse(i: any, id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_caisse(id);
        this.get_liste_caisse();
        Swal.fire(
          'Caisse Supprimé avec succès!',
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
      this.get_liste_caisse();
    })
  }

  //supprimer_ imprimante avec id
  Supprimer_imprimante(i: any, id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.service.supprimer_imprimante(id);
        this.get_liste_imprimante();
        Swal.fire(
          'Imrimante Supprimé avec succès!',
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
      this.get_liste_imprimante();
    })
  }

  //  modifier imprimante 
  modifer_imprimante(i: any, id: any, nom: any) {
    this.service.imprimante(id).subscribe((data) => {
      this.obj=data;
      Swal.fire({
        title: 'Balance',
        html:
          '<input id="swal-input1" value="'+this.obj.nom+'" class="swal2-input"  placeholder="'+this.obj.nom+'" >' +
          '<input id="swal-input2"  value="'+this.obj.ip+'" class="swal2-input" placeholder="'+this.obj.ip+'">' ,
          
        focusConfirm: false,
        preConfirm: () => {
          return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
          (<HTMLInputElement>document.getElementById('swal-input2')).value, 
          ]
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then((result) => {
        this.a = result.value
       
        if (result.isConfirmed) {
          var formData: any = new FormData();
          formData.append('Id', id);
          formData.append('Nom', this.a[0]);
          formData.append('Ip', this.a[1]);
        
          if (this.a[0] == '' || this.a[1] == ''  ) {
            Swal.fire({
              title: 'Erreur ',
              text: 'Vérifier vos données  ',
              icon: 'warning',
              confirmButtonText: 'ok',
            })
          }
          else {
            this.service.modifier_imprimante(formData).subscribe((data) => {
              this.get_liste_imprimante();
              Swal.fire(
                'succés',
                'Imprimante Modifier avec succés',
                'success'
              )
  
            })
          }
  
        }
      })
    });
  }

  //modifer balance 
  obj:any
  modifer_balance(i: any, id: any, nom: any) {
    this.service.balance(id).subscribe((data) => {
    this.obj=data;
    Swal.fire({
      title: 'Balance',
      html:
        'code <input id="swal-input1" value="'+this.obj.code+'" class="swal2-input"  placeholder="'+this.obj.code+'" > <br>' +
        'prix <input id="swal-input2"  value="'+this.obj.prix+'" class="swal2-input" placeholder="'+this.obj.prix+'">  <br>' +
        'nom <input id="swal-input3"  value="'+this.obj.param1+'" class="swal2-input" placeholder="'+this.obj.param1+'">  <br>' +
        'param 2<input id="swal-input4"  value="'+this.obj.param2+'" class="swal2-input" placeholder="'+this.obj.param2+'">  <br>',
      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
        (<HTMLInputElement>document.getElementById('swal-input2')).value,
        (<HTMLInputElement>document.getElementById('swal-input3')).value,
        (<HTMLInputElement>document.getElementById('swal-input4')).value,

        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value
     
      if (result.isConfirmed) {
        var formData: any = new FormData();
        formData.append('Id', id);
        formData.append('code', this.a[0]);
        formData.append('prix', this.a[1]);
        formData.append('param1', this.a[2]);
        formData.append('param2', this.a[3]);
        if (this.a[0] == '' || this.a[1] == '' || this.a[2] == '' || this.a[3] == '') {
          Swal.fire({
            title: 'Erreur ',
            text: 'Vérifier vos données  ',
            icon: 'warning',
            confirmButtonText: 'ok',
          })
        }
        else {
          this.service.modifier_balance(formData).subscribe((data) => {
            this.get_liste_balance();
            Swal.fire(
              'succés',
              'balance Modifier ',
              'success'
            )

          })
        }

      }
    })
  });
  }

  // modifer caisse 
  modifer_caisse(i: any, id: any, nom: any) {
    this.service.caisse(id).subscribe((data) => {
      this.obj=data;
      Swal.fire({
        title: 'Balance',
        html:
          '<input id="swal-input1" value="'+this.obj.nom+'" class="swal2-input"  placeholder="'+this.obj.nom+'" >' ,
         
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
          formData.append('Id', id);
          formData.append('Nom', this.a[0]);
         
          if (this.a[0] == '' || this.a[1] == ''  ) {
            Swal.fire({
              title: 'Erreur ',
              text: 'Vérifier vos données  ',
              icon: 'warning',
              confirmButtonText: 'ok',
            })
          }
          else {
            this.service.modifier_caisse(formData).subscribe((data) => {
              this.get_liste_caisse();
              Swal.fire(
                'succés',
                'Caisse Modifier avec succés',
                'success'
              )
  
            })
          }
  
        }
      })
    });
    }
  

  a: any
  Ajouter_balance() {
    Swal.fire({
      title: 'Balance',
      html:
        '<input id="swal-input1" class="swal2-input"  placeholder="code" >' +
        '<input id="swal-input2" class="swal2-input" placeholder="prix">' +
        '<input id="swal-input3" class="swal2-input" placeholder="param1">' +
        '<input id="swal-input4" class="swal2-input" placeholder="param2">',
      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
        (<HTMLInputElement>document.getElementById('swal-input2')).value,
        (<HTMLInputElement>document.getElementById('swal-input3')).value,
        (<HTMLInputElement>document.getElementById('swal-input4')).value,

        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value
      console.log(this.a)
      if (result.isConfirmed) {
        var formData: any = new FormData();
        formData.append('code', this.a[0]);
        formData.append('prix', this.a[1]);
        formData.append('param1', this.a[2]);
        formData.append('param2', this.a[3]);
        if (this.a[0] == '' || this.a[1] == '' || this.a[2] == '' || this.a[3] == '') {
          Swal.fire({
            title: 'Erreur ',
            text: 'Vérifier vos données  ',
            icon: 'warning',
            confirmButtonText: 'ok',

          })
        }
        else {
          this.service.ajouter_balance(formData).subscribe((data) => {
            this.get_liste_balance();
            Swal.fire(
              'succés',
              'balance ajouté avec succés',
              'success'
            )

          })
        }

      }
    })
  }

  Ajouter_caisse() {
    Swal.fire({
      title: 'Caisse',
      html:
        '<input id="swal-input1" class="swal2-input"  placeholder="nom" >',

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
        formData.append('Nom', this.a[0]);

        if (this.a[0] == '') {
          Swal.fire({
            title: 'Erreur ',
            text: 'Vérifier vos données  ',
            icon: 'warning',
            confirmButtonText: 'ok',

          })
        }
        else {
          this.service.ajouter_caisse(formData).subscribe((data) => {
            this.get_liste_caisse();
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

  Ajouter_imprimante() {
    Swal.fire({
      title: 'Imprimante',
      html:
        '<input id="swal-input1" class="swal2-input"  placeholder="nom" >' +
        '<input id="swal-input2" class="swal2-input" placeholder="Ip">',
      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
        (<HTMLInputElement>document.getElementById('swal-input2')).value,
        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value

      if (result.isConfirmed) {
        var formData: any = new FormData();
        formData.append('Nom', this.a[0]);
        formData.append('Ip', this.a[1]);

        if (this.a[0] == '' || this.a[1] == '') {
          Swal.fire({
            title: 'Erreur ',
            text: 'Vérifier vos données  ',
            icon: 'warning',
            confirmButtonText: 'ok',

          })
        }
        else {
          this.service.ajouter_imprimante(formData).subscribe((data) => {
            this.get_liste_imprimante();
            Swal.fire(
              'succés',
              'Imprimante ajouté avec succés',
              'success'
            )

          })
        }

      }
    })

  }



  // metrre a jour valeur balance 
  mettre_a_jour()
  {
    this.service.mettre_a_jour().subscribe((da)=>{})

  }

 
  ngOnInit(): void {
  }
}
