import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SelectedPlayer } from 'src/app/models/data/selectedPlayer';

@Injectable({
  providedIn: 'root'
})
export class SelectedPlayerService {
  apiBaseUrl: any;

  constructor(private http: HttpClient) {}

  getSelectedPlayers(): Observable<SelectedPlayer[]> {
    return this.http.get<SelectedPlayer[]>(`${this.apiBaseUrl}/selectedplayers`);
  }

  getSelectedPlayersWithEvents(): Observable<SelectedPlayer[]> {
    return this.http.get<SelectedPlayer[]>(`${this.apiBaseUrl}/selectedplayers/include`);
  }

  getSelectedPlayer(id: number): Observable<SelectedPlayer> {
    return this.http.get<SelectedPlayer>(`${this.apiBaseUrl}/selectedplayers/${id}`);
  }

  getSelectedPlayerWithEvent(id: number): Observable<SelectedPlayer> {
    return this.http.get<SelectedPlayer>(`${this.apiBaseUrl}/selectedplayers/${id}/include`);
  }

  createSelectedPlayer(selectedPlayer: SelectedPlayer): Observable<SelectedPlayer> {
    return this.http.post<SelectedPlayer>(`${this.apiBaseUrl}/selectedplayers`, selectedPlayer);
  }

  updateSelectedPlayer(id: number, selectedPlayer: SelectedPlayer): Observable<void> {
    return this.http.put<void>(`${this.apiBaseUrl}/selectedplayers/${id}`, selectedPlayer);
  }

  deleteSelectedPlayer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/selectedplayers/${id}`);
  }
}
