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
	formData: FormData = new FormData();
  startDateerrorFlag : Boolean = false;
  endDateerrorFlag : Boolean = false;
  category : [];
  categoryFlag: Boolean = false;
  selectedCategory: string;
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

  addAdItem(name, desc, start_time, end_time, starting_bid) {
  	this.formData.append('name', name);
  	this.formData.append('desc', desc);
  	this.formData.append('start_time', start_time);
  	this.formData.append('end_time', end_time);
  	this.formData.append('starting_bid', starting_bid);
    // //.log(category);
    this.formData.append('category', this.selectedCategory);
    this.additemservice.addAdItem(this.formData)
    
    .subscribe(res => this.router.navigateByUrl(''));
}
onFileChange(event) {
  let reader = new FileReader();
 	//.log("change file")
  if(event.target.files && event.target.files.length) {
    const [file] = event.target.files;
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.angForm.patchValue({
        file: reader.result
      });
      // //.log(file)
      //this.formData = new FormData();
      // need to run CD since file load runs outside of zone
      this.formData.append('image', file)
      this.cd.markForCheck();
    };
  }
}

onStartTimeChange(event){
  let start_date = new Date(event.value).getTime();
  //.log(event.value)
  //.log("Start Time" + new Date(start_date) + "   ");
  if(start_date < Date.now())
  {
    //.log("True");
    this.startDateerrorFlag = true;
  }
  else
  {
  //.log("False");
    this.startDateerrorFlag = false; 
  }
}


onEndTimeChange(event){
  let end_date = new Date(event.value).getTime();
  
  let start_date = this.angForm.get("start_time").value;
  //.log("Date" +start_date)
  if(start_date == ""){
  this.endDateerrorFlag = true;
  }

  else{
  start_date = new Date(start_date).getTime();
  if(end_date < start_date)
  {
    //.log("True");
    this.endDateerrorFlag = true;
  }
  else
  {
  //.log("False" + start_date);
    this.endDateerrorFlag = false; 
  }
  } 
  
}

getCat(event){
  ////.log(event.target.value);
  let cat = event.target.value;
  if(cat == "new_cat" && !this.categoryFlag)
  {
    //.log("here");
    this.angForm.get("category").setValue('');
    this.categoryFlag = true;
  }
  else if(this.categoryFlag){
    //.log(cat);
    //this.formData.append('category', cat);
    this.additemservice.addCategory({'name' : cat})
    .subscribe(
      res=> {//.log("added-category" + cat); 
      this.additemservice.getCategory()
    .subscribe(res =>{
      this.category = res['categories'];
      //.log(this.category);
    });
    });
    this.selectedCategory = cat;
    this.categoryFlag = false;
  }
  else
  {
    this.selectedCategory = cat;
    //this.formData.append('category', cat);
    this.categoryFlag = false;

  }
  

}
  ngOnInit() {
    if(localStorage.getItem('admin') === 'true'){
      this.additemservice.getCategory()
      .subscribe(res =>{
        this.category = res['categories'];
        //.log(this.category);
      }
      );
    }
    else{
      this.router.navigateByUrl('');
    }
  }

}
