import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDeleteComponent } from 'src/app/dialogs/confirm-delete/confirm-delete.component';
import { Applicant } from 'src/app/models/data/applicants';
import { NotifyService } from 'src/app/services/common/notify.service';
import { ApplicantService } from 'src/app/services/data/applicant.service';
import { EventService } from 'src/app/services/data/event.service';
import { apiBaseUrl } from 'src/app/shared/app-constants';
import { Event } from 'src/app/models/data/event';

@Component({
  selector: 'app-applicants-list',
  templateUrl: './applicants-list.component.html',
  styleUrls: ['./applicants-list.component.scss']
})
export class ApplicantsListComponent implements OnInit {

  applicants: Applicant [] =[];
  events : Event [] = []; 
  searchTerm: string = '';


  applicantsDataSource: MatTableDataSource<Applicant> = new MatTableDataSource(this.applicants); 
  eventDataSource: MatTableDataSource<Event> = new MatTableDataSource(this.events);

  applicantsColumn: string[] = [ 'name', 'email', 'phoneNumber', 'dateOfBirth','address'];

  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  imagePath: string = apiBaseUrl + '/Pictures';
  expandedElement: Event | null = null;

  constructor(
    private applicantService: ApplicantService,
    private eventService : EventService,
    private notifyService: NotifyService,
    private dialog: MatDialog
  ) { }
  
  getEventName(eventId: number | undefined): string {
    if (eventId !== undefined) {
      const event = this.events.find(c => c.eventId === eventId);
      return event?.eventName || 'N/A';
    }
    return 'N/A';
  }

  ngOnInit(): void {
    this.applicantService.getApplicants()
      .subscribe
      ((applicants: Applicant[]) => {
        this.applicants = applicants;
        this.applicantsDataSource = new MatTableDataSource(this.applicants);
        this.applicantsDataSource.sort = this.sort;
        this.applicantsDataSource.paginator = this.paginator;

        // Define filter predicate here
        this.applicantsDataSource.filterPredicate = (data, filter) => {
          const searchTermLowerCase = filter.toLowerCase();

          // Use nullish coalescing operator to handle possible undefined values
          return (
            (data.name ?? '').toLowerCase().includes(searchTermLowerCase) ||
            (data.email ?? '').toLowerCase().includes(searchTermLowerCase) || 
            (data.address ?? '').toLowerCase().includes(searchTermLowerCase)

          );
        };
      }, 
      error => {
        this.notifyService.message("Failed to load Applicants data!");
        console.log(error.message || error);
      });
  
      // this.eventService.getEvents().subscribe({
      //   next: r => {
      //     this.events = r;
      //     this.eventDataSource.data = this.events;
      //     this.eventDataSource.sort = this.sort;
      //     this.eventDataSource.paginator = this.paginator;
      //   },
      //   error: err => {
      //     console.log(err.message || err);
      //     this.notifyService.message("Failed to load Events data!");
      //   }
      // });
  }
  applyFilter() {
    this.applicantsDataSource.filter = this.searchTerm.trim().toLowerCase();
  }
  confirmDelete(applicant: Applicant) {
    this.dialog.open(ConfirmDeleteComponent, {
      "width": "450px"
    }).afterClosed()
      .subscribe(confirm => {
        if (confirm) {
          this.applicantService.delete(<number>applicant.applicantId)
            .subscribe({
              next: r => {
                this.applicantsDataSource.data = this.applicantsDataSource.data.filter(x => x.applicantId != applicant.applicantId);
              },
              error: err => {
                this.notifyService.message("Failed to delete");
                console.log(err.message || err);
              }
            });
        }
      });
  }
}  
