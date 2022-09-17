import { Component, OnInit } from '@angular/core';
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {TelegaService} from "../../services/telega.service";
import {map} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss']
})
export class SalaryComponent implements OnInit {
  form!: FormGroup;
  salary: number = 0;
  tomorrow: number = 0;
  checkedFlag: boolean = false;
  costsArray: any = [];
  costsSumm: number = 0;
  change: boolean = false;
  tomInput: number = 0;
  historyArray: any[] = [];
  today?: Date;
  dataDate?: Date;
  constructor(private ts: TelegaService, private matSnack: MatSnackBar) { }

  ngOnInit(): void {
    let yeasterdayTotal:any = {};
    if(localStorage.getItem('historyArray') == null){
      localStorage.setItem('historyArray', JSON.stringify(this.historyArray));
    }
    this.historyArray = JSON.parse(localStorage.getItem('historyArray')!);
    if(this.historyArray[this.historyArray.length - 1] !== null || this.historyArray[this.historyArray.length - 1] !== undefined){
      yeasterdayTotal = this.historyArray[this.historyArray.length - 1];
      if(yeasterdayTotal){
        this.dataDate = yeasterdayTotal.date;
      }else{
        this.dataDate = new Date;
      }
    }else{
      //todo tomorrow
      this.dataDate = new Date;
      yeasterdayTotal.total = 0;
    }

    this.form = new FormGroup({
      yeasterdayTotal: new FormControl(yeasterdayTotal==undefined?0:yeasterdayTotal.tomorrow, Validators.required),
      total: new FormControl('', Validators.required),
      terminal: new FormControl('100', Validators.required),
      startDay: new FormControl('08:00', Validators.required),
      endDay: new FormControl('20:00', Validators.required),
      costInput: new FormControl('', Validators.pattern('^[0-9]+$')),
      NameCost: new FormControl('', Validators.pattern('^[а-яА-Яa-zA-Z]+$')),
    })
  }

  submit() {
    let total = this.form.controls['total'].value;
    let yeasterdayTotal = this.form.controls['yeasterdayTotal'].value;
    let terminal = this.form.controls['terminal'].value;
    let startDay = this.form.controls['startDay'].value;
    let endDay = this.form.controls['endDay'].value;
    let percent = 1;
    if(total>0 && total<2000){
      percent = 2;
    }else if(total>=2000 && total<3000){
      percent = 3;
    }else if(total>=3000 && total<4000){
      percent = 4;
    }else if(total>=4000 && total<5000){
      percent = 5;
    }else if(total>=5000 && total<6000){
      percent = 6;
    }else if(total>=6000){
      percent = 7;
    }
    this.countWorkDay(startDay);
    this.salary = Math.round((((this.countWorkDay(endDay)-this.countWorkDay(startDay))/3600000)*30)+((percent/100)*total));
    this.tomorrow = Math.round((yeasterdayTotal + total - terminal - this.salary - this.costsSumm));
    this.tomInput = this.tomorrow;
    this.checkedFlag = true;
  }

  resetForm() {
    this.form.reset();
    this.form.controls['startDay'].setValue('08:00');
    this.form.controls['endDay'].setValue('20:00');
    this.salary = 0;
    this.tomorrow = 0;
    this.checkedFlag = false;
  }

  countWorkDay(time: string){
    // @ts-ignore
    let [hh,mm] = time.match(/\d\d/g);
    return hh * 3600000 + mm * 60000;
  }
  resetAll(){
    this.resetForm();
    this.costsSumm = 0;
    this.costsArray = [];
    this.change = false;
    document.location.reload();
  }
  saveDatas() {
    this.saveAndSend();
    this.resetAll();
  }

  pushToArray() {
    const cost = {
      name: this.form.controls['NameCost'].value,
      cost: this.form.controls['costInput'].value
    }
    this.costsArray.push(cost);
    this.form.controls['NameCost'].reset();
    this.form.controls['costInput'].reset();
    this.summCosts(this.costsArray);
  }

  summCosts(array: any[]){
    this.costsSumm = 0;
    array.forEach(el=>{
      this.costsSumm += +(el.cost);
    })
  }

  removeCosts(i: number) {
    this.costsSumm = this.costsSumm - this.costsArray[i].cost;
    this.costsArray.splice(i);
  }

  changeTomorrow() {
    this.change = !this.change;
  }

  saveAndSend() {
    this.tomorrow = this.tomInput;
    this.change = false;
    const result = {
      date: new Date(),
      salary: this.salary,
      tomorrow: +(this.tomorrow),
      terminal: this.form.controls['terminal'].value,
      costs: this.costsArray,
      total: this.form.controls['total'].value
    }
    this.historyArray.push(result);
    localStorage.setItem('historyArray', JSON.stringify(this.historyArray));
    this.ts.sendMessage(result).pipe(map((response:any)=>{
      if(response.ok == true){
        this.matSnack.open('Все отправилось, можно валить домой))!', 'Ok', {duration: 5000});
        setTimeout(() =>{this.resetAll();},5000);
      }else{
        this.matSnack.open('Чтото словмалось, пробуй еще!', 'Ok', {duration: 5000});
      }
    })).subscribe();
  }
}
