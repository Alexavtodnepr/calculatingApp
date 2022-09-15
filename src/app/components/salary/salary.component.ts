import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

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
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      yeasterdayTotal: new FormControl('', Validators.required),
      total: new FormControl('', Validators.required),
      terminal: new FormControl('100', Validators.required),
      startDay: new FormControl('08:00', Validators.required),
      endDay: new FormControl('20:00', Validators.required),
      costs: new FormControl('0', Validators.required),
    })
  }

  submit() {
    let total = this.form.controls['total'].value;
    let yeasterdayTotal = this.form.controls['yeasterdayTotal'].value;
    let terminal = this.form.controls['terminal'].value;
    let costs = this.form.controls['costs'].value;
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
    console.log((((this.countWorkDay(endDay)-this.countWorkDay(startDay))/3600000)*30), ((percent/100)*total), percent, total>=2000);
    this.tomorrow = Math.round((yeasterdayTotal + total - terminal - this.salary - costs));
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

  saveDatas() {
    console.log(this.form.value, this.salary, this.tomorrow);
    this.resetForm();
  }
}
