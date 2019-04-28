import { HttpHeaders } from '@angular/common/http';

export const HEADERS = {
  jsonUTF8: new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8', 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }),
  formData: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }),
  gzip: new HttpHeaders({ 'Content-Encoding': 'gzip', 'Content-Type': 'text/plain' })
};
