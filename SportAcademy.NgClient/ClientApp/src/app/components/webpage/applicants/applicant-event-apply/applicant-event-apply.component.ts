import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsIdParams } from 'src/app/models/common/events-id-params';
import { Applicant } from 'src/app/models/data/applicants';
import { NotifyService } from 'src/app/services/common/notify.service';
import { ApplicantService } from 'src/app/services/data/applicant.service';
import { EventService } from 'src/app/services/data/event.service';
import { Event } from 'src/app/models/data/event';

@Component({
  selector: 'app-applicant-event-apply',
  templateUrl: './applicant-event-apply.component.html',
  styleUrls: ['./applicant-event-apply.component.scss']
})
export class ApplicantEventApplyComponent implements OnInit {

  applicant: Applicant = {};
 
  eventId: any;

  applicantForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl(undefined, Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    dateOfBirth: new FormControl(undefined, Validators.required),
    address: new FormControl('', Validators.required),
    picture: new FormControl(''),
    eventId: new FormControl('', Validators.required),
  });

  image: File = null!;

  constructor(
    private eventService: EventService,
    private applicantService: ApplicantService,
    private notifyService: NotifyService,
    private router: Router,
    private activateRoute: ActivatedRoute,
  ) { }

  goBackToList() {
    this.router.navigate(['/events']);
  }

  get f() {
    return this.applicantForm.controls;
  }

  save() {
    if (this.applicantForm.invalid) return;

    const applicant: Applicant = this.applicantForm.value;

    this.applicantService.create(applicant).subscribe({
      next: (r: Applicant) => {
        this.notifyService.message("Application submitted successfully!");
        this.upload(<number>r.applicantId);

        // Reset the form
        this.resetForm();
        this.router.navigateByUrl('home')
      },
      error: (err) => {
        this.notifyService.message("Failed to apply!");
      },
    });
  }

  private resetForm() {
    // Reset the entire form
    this.applicantForm.reset();
  }


  upload(id: number) {
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      this.applicantService.uploadImage(id, this.image)
        .subscribe({
          next: r => {
            console.log(r);
            this.notifyService.message("Data Saved");

            // Clear form and reset applicant
            this.applicantForm.reset({});
            this.applicant = {};

            // Mark form as pristine and untouched
            this.applicantForm.markAsPristine();
            this.applicantForm.markAsUntouched();
          },
          error: err => {
            this.notifyService.message("Cannot upload picture");
            console.log(err.message || err);
          }
        });
    }
    reader.readAsArrayBuffer(this.image);
  }

  onFileSelect(event: any) {
    if (event.target.files.length) {
      this.image = event.target.files[0];
      console.log(this.image);
      this.applicantForm.patchValue({
        picture: this.image.name
      });
    }
  }

  ngOnInit(): void {
    // Get the eventId from the route parameters
    this.activateRoute.params.subscribe((params: EventsIdParams) => {
      this.eventId = params.id ? +params.id : null;
      console.log(this.eventId); // Check if eventId is extracted correctly
      if (this.eventId !== null) {
        // Fetch event details using the eventService
        this.eventService.getById(this.eventId).subscribe({
          next: (event: Event) => {
            // Populate the form with event details
            this.applicantForm.patchValue({
              eventId: event?.eventId ?? 0,
              // Populate other fields as needed
            });
          },
          error: (error) => {
            console.error("Error fetching event details:", error);
            // Handle error appropriately, e.g., show a notification to the user
          },
        });
      }
    });
  }
  

  // private resetForm() {
  //   // Clear validators and reset form controls
  //   const controlNames = Object.keys(this.applicantForm.controls);
  //   controlNames.forEach((controlName) => {
  //     this.applicantForm.get(controlName)?.setValue(null);  // Set the value to null
  //     this.applicantForm.get(controlName)?.clearValidators();
  //     this.applicantForm.get(controlName)?.updateValueAndValidity();
  //   });
  
  //   // Reset the entire form
  //   this.applicantForm.reset();
  // }
}  