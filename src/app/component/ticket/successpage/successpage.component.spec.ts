import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccesspageComponent } from './successpage.component';

describe('SuccesspageComponent', () => {
  let component: SuccesspageComponent;
  let fixture: ComponentFixture<SuccesspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuccesspageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuccesspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
