import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantEventApplyComponent } from './applicant-event-apply.component';

describe('ApplicantEventApplyComponent', () => {
  let component: ApplicantEventApplyComponent;
  let fixture: ComponentFixture<ApplicantEventApplyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantEventApplyComponent]
    });
    fixture = TestBed.createComponent(ApplicantEventApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
