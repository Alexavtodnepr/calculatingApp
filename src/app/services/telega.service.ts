import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TelegaService {

  constructor(private http: HttpClient) { }

  sendMessage(DayResult: any){
    let stringCosts = '';
    const allCosts = DayResult.costs.forEach((el:any)=>{
      stringCosts += el.name + ' : ' + el.cost + '; ';
    })
    return this.http.get(`${environment.telegaApi}/${environment.tokenBot}/sendMessage?text=на завтра: ${DayResult.tomorrow}; итого: ${DayResult.total}; зарплата: ${DayResult.salary}; терминал: ${DayResult.terminal}; расходы: ${stringCosts}&chat_id=${environment.telegaChatId}`)
  }
}
