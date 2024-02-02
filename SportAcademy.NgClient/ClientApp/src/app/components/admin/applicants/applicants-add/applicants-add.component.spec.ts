import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsAddComponent } from './applicants-add.component';

describe('ApplicantsAddComponent', () => {
  let component: ApplicantsAddComponent;
  let fixture: ComponentFixture<ApplicantsAddComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsAddComponent]
    });
    fixture = TestBed.createComponent(ApplicantsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
