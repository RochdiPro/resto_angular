import { HttpClient } from '@angular/common/http';
import { ThisReceiver, ThrowStmt } from '@angular/compiler';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-ajouter-produit',
  templateUrl: './ajouter-produit.component.html',
  styleUrls: ['./ajouter-produit.component.scss']
})
export class AjouterProduitComponent implements OnInit, AfterViewInit {

  produit: any = FormGroup;
  liste_categorie: any;
  liste_unite: any;
  image_par_defaut_blob: any;
  imageSrc: any;
  id_produit_modifier: any;
  prod: any
  image_source: any = "./../../../assets/images/vide.jpg";
  test: any = true;
  formproduit: any = { nom: "", categorie: "", unite: "", valeur: "1", code: "" }
  test_code: any
  tva: any = 7;
  liste_tva:any=[];

  constructor(private http: HttpClient, public service: ServiceService, private route: ActivatedRoute, private router: Router) {
    this.id_produit_modifier = this.route.snapshot.params.id;
    this.produit = new FormGroup({
      nom: new FormControl(''),
      categorie: new FormControl(''),
      image: new FormControl(''),
      unite: new FormControl(''),
      valeur: new FormControl(''),
      code: new FormControl(''),
      tva: new FormControl(''),
    });
   this.get_tva();
    this.get_categories();
    this.get_unites();
    this.ChargementImage();
    if (this.id_produit_modifier == "-1") {
      this.test = false
    } else {
      this.service.produit(this.id_produit_modifier).subscribe((data: any) => {
        this.prod = data
        this.formproduit.nom = this.prod.nom
        this.formproduit.categorie = this.prod.categorie
        this.categorie = this.prod.categorie.id
        this.formproduit.unite = this.prod.unite
        this.unite = this.prod.unite.id
        this.formproduit.valeur = this.prod.valeur_Unite
        this.formproduit.code = this.prod.code_Barre
        this.formproduit.tva = this.prod.tva

      })

      this.test = true
      this.Image();

    }
  }
  ngAfterViewInit(): void {
    if (this.test == false) {
      this.http.get('./../../../assets/images/vide.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
        this.image_par_defaut_blob = reponse;
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.imageSrc = lecteur.result;
          this.imageSrc = btoa(this.imageSrc);
          this.imageSrc = atob(this.imageSrc);
          this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
        }
        lecteur.readAsDataURL(this.image_par_defaut_blob);

      }, err => console.error(err),
        () => console.log(this.image_par_defaut_blob))

    }

  }

  //récupérer image de la base
  Fichier_image: any;
  Fichier_image_Client: any;
  Image() {
    this.service.image_produit(this.id_produit_modifier)
      .subscribe((baseImage: any) => {
        this.image_par_defaut_blob = baseImage;
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.imageSrc = lecteur.result;
          this.imageSrc = btoa(this.imageSrc);
          this.imageSrc = atob(this.imageSrc);
          this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
        }
        lecteur.readAsDataURL(this.image_par_defaut_blob);

      }, err => console.error(err),
        () => console.log(this.image_par_defaut_blob))


  }
  // récupération d'image par défaut de l'assets
  async ChargementImage() {
    this.http.get('./../../../assets/images/vide.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.image_par_defaut_blob = reponse;
      return this.image_par_defaut_blob;
    }, err => console.error(err),
      () => console.log(this.image_par_defaut_blob))

  }
  // temps d'attente pour le traitement de fonction 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // conversion d'image par défaut en base 64
  async sansChoixImage() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.imageSrc = lecteur.result;
      this.imageSrc = btoa(this.imageSrc);
      this.imageSrc = atob(this.imageSrc);
      this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.image_par_defaut_blob);
  }

  // get liste des categories
  get_categories() {
    this.service.categories().subscribe((data) => {
      this.liste_categorie = data
    })
  }

  // get liste des tva
  get_tva() {
    this.service.tvas().subscribe((data) => {
      this.liste_tva = data
    })
  }
  // get liste des unites
  get_unites() {
    this.service.unites().subscribe((data) => {
      this.liste_unite = data
    })
  }

  // choix d'image
  change_image(ev: any) {
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.Fichier_image = lecteur.result;
      this.Fichier_image = btoa(this.Fichier_image);
      this.Fichier_image = atob(this.Fichier_image);
      this.Fichier_image = this.Fichier_image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.imageSrc = this.Fichier_image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.Fichier_image = new File([ev.target.files[0]], 'image_Client', { type: 'image/png' });
    }
    lecteur.readAsDataURL(ev.target.files[0]);



  }

  // choix de categorie 
  choix_categorie(ev: any) {
    this.categorie = ev.value;
  }
  unite: any; categorie: any;
  // choix de unite 
  choix_unite(ev: any) {
    this.unite = ev.value;
  }

  choix_tva(ev: any) {
    this.tva = ev.value;
  }

  Ajouter_produit() {
    console.log(this.test_code)
    if (this.produit.get('nom').value == "" || this.categorie == "" || this.unite == "") {
      Swal.fire({
        title: 'Erreur ',
        text: 'Vérifier vos données  ',
        icon: 'warning',
        confirmButtonText: 'ok',
      })
    }
    else if (this.test_code == true || this.test_code ==undefined ) {
      var formData: any = new FormData();
      const nom_image_par_defaut = 'image_par_defaut.png';
      const Fichier_image_par_defaut = new File([this.image_par_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
      if (this.produit.get('image').value === '') {
        formData.append('Image', Fichier_image_par_defaut);
      } else formData.append('Image', this.Fichier_image);
      formData.append('Nom', this.produit.get('nom').value);
      formData.append('Categorie', this.categorie)
      formData.append('Unite', this.unite)
      formData.append('Valeur_Unite', this.produit.get('valeur').value);
      formData.append('Code_Barre', this.produit.get('code').value);
      formData.append('Tva', this.produit.get('tva').value);
      this.service.ajouter_produit(formData).subscribe((data) => {
        this.router.navigate(['/menu/config']);

      })
    }

  }

  ngOnInit(): void {

  }


  Modifier_produit() {
    if (this.produit.get('nom').value == "" || this.categorie == "" || this.unite == "") {
      Swal.fire({
        title: 'Erreur ',
        text: 'Vérifier vos données  ',
        icon: 'warning',
        confirmButtonText: 'ok',

      })
    }
    else {
      var formData: any = new FormData();
      const nom_image_par_defaut = 'image_par_defaut.png';
      const Fichier_image_par_defaut = new File([this.image_par_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
      if (this.produit.get('image').value === '') {
        formData.append('Image', Fichier_image_par_defaut);
      } else formData.append('Image', this.Fichier_image);
      formData.append('Id', this.id_produit_modifier);
      formData.append('Nom', this.produit.get('nom').value);
      formData.append('Categorie', this.categorie)
      formData.append('Unite', this.unite)
      formData.append('Valeur_Unite', this.produit.get('valeur').value);
      formData.append('Code_Barre', this.produit.get('code').value);
      formData.append('Tva', this.produit.get('tva').value);

      this.service.modifier_produit(formData).subscribe((data) => {
        this.router.navigate(['/menu/config']);

      })
    }

  }

  // tester le code si exsiste 
  check_code() {
    
    this.service.produit_code_barre(this.produit.get('code').value).subscribe((data: any) => {
      if (data.id) {
        Swal.fire({
          title: 'Erreur ',
          text: 'Code a barre ',
          icon: 'warning',
          confirmButtonText: 'ok',
        })
        this.test_code = false
      }else 
      {
        this.test_code = true
      }
    })
  }



}

