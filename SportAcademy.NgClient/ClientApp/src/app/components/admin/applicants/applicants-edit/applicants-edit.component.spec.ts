import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsEditComponent } from './applicants-edit.component';

describe('ApplicantsEditComponent', () => {
  let component: ApplicantsEditComponent;
  let fixture: ComponentFixture<ApplicantsEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsEditComponent]
    });
    fixture = TestBed.createComponent(ApplicantsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
