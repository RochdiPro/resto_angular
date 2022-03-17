import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ajouter-ballance',
  templateUrl: './ajouter-ballance.component.html',
  styleUrls: ['./ajouter-ballance.component.scss']
})
export class AjouterBallanceComponent implements OnInit {

  produit: FormGroup;
  constructor() { 
    this.produit = new FormGroup({
      nom: new FormControl(''),
      categorie: new FormControl(''),
      image: new FormControl(''),
      unite: new FormControl(''),
      prix_achat: new FormControl(''),
      prix_vente: new FormControl(''),
    });
  }

  ngOnInit(): void {
   
  }
}
