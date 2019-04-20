import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import {ItemService} from '../../item.service';
import {ChangeDetectorRef} from '@angular/core';
import { Router} from '@angular/router'
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})

export class AddComponent implements OnInit {
	angForm: FormGroup
	formData: FormData;
  startDateerrorFlag : Boolean = false;
  endDateerrorFlag : Boolean = false;
  constructor(private additemservice : ItemService, private fb : FormBuilder, private cd: ChangeDetectorRef, private router: Router) {
  this.createForm();
   }
createForm() {
    this.angForm = this.fb.group({
      name: ['', Validators.required ],
      desc: ['', Validators.required ],
      category: ['', Validators.required ],
      start_time: ['', Validators.required ],
      end_time: ['', Validators.required ],
      starting_bid: ['', Validators.required ],
      //file: [null ,Validators.required]
   });
  }

  addAdItem(name, desc, category, start_time, end_time, starting_bid) {
  	this.formData.append('name', name);
  	this.formData.append('desc', desc);
  	this.formData.append('category', category);
  	this.formData.append('start_time', start_time);
  	this.formData.append('end_time', end_time);
  	this.formData.append('starting_bid', starting_bid);
    console.log(start_time);
    this.additemservice.addAdItem(this.formData)
    .subscribe(res => this.router.navigateByUrl(''));
}
onFileChange(event) {
  let reader = new FileReader();
 	console.log("change file")
  if(event.target.files && event.target.files.length) {
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.angForm.patchValue({
        file: reader.result
      });
      console.log(file)
      this.formData = new FormData();
      // need to run CD since file load runs outside of zone
      this.formData.append('image', file)
      this.cd.markForCheck();
    };
  }
}

onStartTimeChange(event){
  let start_date = new Date(event.value).getTime();
  console.log(event.value)
  console.log("Start Time" + new Date(start_date) + "   ");
  if(start_date < Date.now())
  {
    console.log("True");
    this.startDateerrorFlag = true;
  }
  else
  {
  console.log("False");
    this.startDateerrorFlag = false; 
  }
}


onEndTimeChange(event){
  let end_date = new Date(event.value).getTime();
  
  let start_date = this.angForm.get("start_time").value;
  console.log("Date" +start_date)
  if(start_date == ""){
  this.endDateerrorFlag = true;
  }

  else{
  start_date = new Date(start_date).getTime();
  if(end_date < start_date)
  {
    console.log("True");
    this.endDateerrorFlag = true;
  }
  else
  {
  console.log("False" + start_date);
    this.endDateerrorFlag = false; 
  }
  } 
  
}
  ngOnInit() {
  }

}
