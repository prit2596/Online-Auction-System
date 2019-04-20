import { Component, OnInit } from '@angular/core';
import { FormGroup,  FormBuilder,  Validators } from '@angular/forms';
import { ItemModel } from '../../item-model';
import { ItemService } from '../../item.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
	item: any = {};
  angForm: FormGroup;
  formData: FormData;
  startDateerrorFlag : Boolean = false;
  endDateerrorFlag : Boolean = false;
  category : [];
  categoryFlag: Boolean = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private itemservice: ItemService,
    private fb: FormBuilder,private cd: ChangeDetectorRef) {
    this.createForm();
    this.formData = new FormData();
   }
    
    createForm() {
    this.angForm = this.fb.group({
      name: ['', Validators.required ],
      desc: ['', Validators.required ],
      category: ['', Validators.required ],
      start_time: ['', Validators.required ],
      end_time: ['', Validators.required ],
      starting_bid: ['', Validators.required ],
   });
  }

  updateItem(name, desc, category, start_time, end_time, starting_bid) {
  this.formData.append('name', name);
  	this.formData.append('desc', desc);
  	this.formData.append('category', category);
  	this.formData.append('start_time', start_time);
  	this.formData.append('end_time', end_time);
  	this.formData.append('starting_bid', starting_bid);
   this.route.params.subscribe(params => {
      this.itemservice.updateItem(this.formData, params['id'])
      .subscribe(res => {
        this.router.navigateByUrl('/view');
      })
   });
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
getCat(event){
  //console.log(event.target.value);
  let cat = event.target.value;
  if(cat == "new_cat" && !this.categoryFlag)
  {
    console.log("here");
    this.angForm.get("category").setValue('');
    this.categoryFlag = true;
  }
  else if(this.categoryFlag){
    console.log(cat);
    this.formData.append('category', cat);
    this.itemservice.addCategory({'name' : cat})
    .subscribe(
      res=> {console.log("added-category" + cat); 
    });
    this.itemservice.getCategory()
    .subscribe(res =>{
      this.category = res['categories'];
      console.log(this.category);
    });
    this.categoryFlag = false;
  }
  else
  {
    this.formData.append('category', cat);
    this.categoryFlag = false;

  }
  

}
  ngOnInit() {
  //temp : any ={};
  this.itemservice.getCategory()
    .subscribe(res =>{
      this.category = res['categories'];
      console.log("hello" + this.category);
    });
  this.route.params.subscribe(params => {
  this.itemservice.getItem(params['id'])
  .subscribe(res => {
    //this.item = res["items"];

    this.angForm.get('name').setValue(res['items'].name);
    this.angForm.get('desc').setValue(res['items'].desc);
    this.angForm.get('category').setValue(res['items'].category);
    this.angForm.get('start_time').setValue(new Date(res['items'].time.start_time));
    this.angForm.get('end_time').setValue(new Date(res['items'].time.end_time));
    this.angForm.get('starting_bid').setValue(res['items'].bid_price.starting_bid);
  //console.log("here" +JSON.stringify(temp.items))
  })
  //console.log(this.item);
  })
  }

}
