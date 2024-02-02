import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantsEventListComponent } from './applicants-event-list.component';

describe('ApplicantsEventListComponent', () => {
  let component: ApplicantsEventListComponent;
  let fixture: ComponentFixture<ApplicantsEventListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantsEventListComponent]
    });
    fixture = TestBed.createComponent(ApplicantsEventListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
