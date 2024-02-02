import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Applicant } from 'src/app/models/data/applicants';
import { UploadResponse } from 'src/app/models/common/upload-response';
import { apiBaseUrl } from 'src/app/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  constructor(
    private http:HttpClient
  ) { }

  getApplicants(): Observable<Applicant[]> {
    return this.http.get<Applicant[]>(`${apiBaseUrl}/api/Applicants`);
  }

  getApplicantsWithEvents():Observable<Applicant[]> {
    return this.http.get<Applicant[]>(`${apiBaseUrl}/api/Applicants/Events/Include`);
  }

  getApplicant(id: number): Observable<Applicant> {
    return this.http.get<Applicant>(`${apiBaseUrl}/api/Applicants/${id}`);
  }

  getApplicantWithEvent(id: number): Observable<Applicant> {
    return this.http.get<Applicant>(`${apiBaseUrl}/api/Applicants/${id}/include`);
  }

  create(applicant: Applicant): Observable<Applicant> {
    return this.http.post<Applicant>(`${apiBaseUrl}/api/Applicants`, applicant);
  }

  update(id: number, applicant: Applicant): Observable<void> {
    return this.http.put<void>(`${apiBaseUrl}/api/Applicants/${id}`, applicant);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${apiBaseUrl}/api/Applicants/${id}`);
  }
  uploadImage(id: number, f: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', f);
    console.log(f);
    return this.http.post<UploadResponse>(`${apiBaseUrl}/api/Applicants/Upload/${id}`, formData);
  }
}
