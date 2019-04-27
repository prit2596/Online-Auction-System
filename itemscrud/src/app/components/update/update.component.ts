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
  selectedCategory:string;
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
  	this.formData.append('category', this.selectedCategory);
  	this.formData.append('start_time', start_time);
  	this.formData.append('end_time', end_time);
  	this.formData.append('starting_bid', starting_bid);
   this.route.params.subscribe(params => {
      this.itemservice.updateItem(this.formData, params['id'])
      .subscribe(res => {
        this.router.navigateByUrl('');
      })
   });
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
      //.log(file)
      
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
    this.itemservice.addCategory({'name' : cat})
    .subscribe(
      res=> {//.log("added-category" + cat); 
      this.itemservice.getCategory()
    .subscribe(res =>{
      this.category = res['categories'];
      //.log(this.category);
    });
    });
    //this.category = [];
    this.selectedCategory = cat;
    this.categoryFlag = false;
  }
  else
  {
    //this.formData.append('category', cat);
    this.selectedCategory = cat;
    this.categoryFlag = false;

  }
  

}
  ngOnInit() {
  //temp : any ={};
    //.log(localStorage.getItem('admin'))
    if(localStorage.getItem('admin') == 'true'){
      this.itemservice.getCategory()
      .subscribe(res =>{
        this.category = res['categories'];
        //.log("hello" + this.category);
      });
      this.route.params.subscribe(params => {
      this.itemservice.getItem(params['id'])
      .subscribe(res => {
        //this.item = res["items"];

        this.angForm.get('name').setValue(res['items'].name);
        this.angForm.get('desc').setValue(res['items'].desc);
        this.angForm.get('category').setValue(res['items'].category);
        this.selectedCategory = res['items'].category;
        this.angForm.get('start_time').setValue(new Date(res['items'].time.start_time));
        this.angForm.get('end_time').setValue(new Date(res['items'].time.end_time));
        this.angForm.get('starting_bid').setValue(res['items'].bid_price.starting_bid);
      ////.log("here" +JSON.stringify(temp.items))
        })
      ////.log(this.item);
      })

    }
    else{
      this.router.navigateByUrl('');
    }
  }

}
