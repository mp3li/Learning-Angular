import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiObject } from '../models/api-object.model';

@Injectable({ providedIn: 'root' })
export class ApiObjectService {
  private readonly baseUrl = 'https://api.restful-api.dev/objects';

  constructor(private http: HttpClient) {}

  getAllObjects(): Observable<ApiObject[]> {
    return this.http.get<ApiObject[]>(this.baseUrl);
  }

  getObjectById(id: string): Observable<ApiObject> {
    return this.http.get<ApiObject>(`${this.baseUrl}/${id}`);
  }

  deleteObjectById(id: string): Observable<void> {
    return this.http.delete<unknown>(`${this.baseUrl}/${id}`).pipe(map(() => undefined));
  }
}
