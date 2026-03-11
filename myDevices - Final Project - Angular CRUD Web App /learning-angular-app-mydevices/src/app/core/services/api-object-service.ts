import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { ApiObject, ApiObjectPatchPayload, ApiObjectPayload } from '../models/api-object.model';

@Injectable({ providedIn: 'root' })
export class ApiObjectService {
  private readonly baseUrl = 'https://api.restful-api.dev/objects';
  private readonly objectMutationsSubject = new Subject<void>();
  readonly objectMutations$ = this.objectMutationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAllObjects(): Observable<ApiObject[]> {
    return this.http.get<ApiObject[]>(this.baseUrl);
  }

  getObjectById(id: string): Observable<ApiObject> {
    return this.http.get<ApiObject>(`${this.baseUrl}/${id}`);
  }

  createObject(payload: ApiObjectPayload): Observable<ApiObject> {
    return this.http
      .post<ApiObject>(this.baseUrl, payload)
      .pipe(tap(() => this.objectMutationsSubject.next()));
  }

  putObject(id: string, payload: ApiObjectPayload): Observable<ApiObject> {
    return this.http
      .put<ApiObject>(`${this.baseUrl}/${id}`, payload)
      .pipe(tap(() => this.objectMutationsSubject.next()));
  }

  patchObject(id: string, payload: ApiObjectPatchPayload): Observable<ApiObject> {
    return this.http
      .patch<ApiObject>(`${this.baseUrl}/${id}`, payload)
      .pipe(tap(() => this.objectMutationsSubject.next()));
  }

  deleteObjectById(id: string): Observable<void> {
    return this.http
      .delete<unknown>(`${this.baseUrl}/${id}`)
      .pipe(
        tap(() => this.objectMutationsSubject.next()),
        map(() => undefined)
      );
  }
}
