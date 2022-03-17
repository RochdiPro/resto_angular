import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterBallanceComponent } from './ajouter-ballance.component';

describe('AjouterBallanceComponent', () => {
  let component: AjouterBallanceComponent;
  let fixture: ComponentFixture<AjouterBallanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjouterBallanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjouterBallanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
