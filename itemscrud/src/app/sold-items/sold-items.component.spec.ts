import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldItemsComponent } from './sold-items.component';

describe('SoldItemsComponent', () => {
  let component: SoldItemsComponent;
  let fixture: ComponentFixture<SoldItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoldItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
