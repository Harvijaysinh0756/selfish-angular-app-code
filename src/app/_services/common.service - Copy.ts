import { Injectable, Inject} from '@angular/core';
import { Title }     from '@angular/platform-browser';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { DOCUMENT, formatDate } from '@angular/common';

import { environment } from '../../environments/environment';
//import Swal from 'sweetalert2';
import { Meta } from '@angular/platform-browser'; 

@Injectable({
	providedIn: 'root'
})
export class CommonService {

	private headers: HttpHeaders;
	private options: any;
	public SITE_CONSTANT = [];
	public LANG_CONSTANT = [];
	public selectedLang = 'en';
    public auth_token : any ;
	async load() : Promise<any> {

		// this.SITE_CONSTANT['API_END_POINT'] = environment.apiUrl;
		// console.log('vvvvvvvvvv '+this.SITE_CONSTANT['API_END_POINT']);

		// this.SITE_CONSTANT['API_END_POINT'] = environment.apiUrl;
		// return this.http
		// .post(this.SITE_CONSTANT['API_END_POINT']+'get-config',{})
		// .toPromise()
		// .then((response: any )=>{
		// 	if (typeof response.is_licence_invalid !== 'undefined' && response.is_licence_invalid == 'true') {
		// 		window.location.href = "https://licensing.ncrypted.com/index.php";
		// 	} else{
		// 		if(response.status == true){  
		// 			if(response.data.configData){
		// 				for(var key in response.data.configData){
		// 					if( !response.data.configData.hasOwnProperty(key) || response.data.configData[key].hasOwnProperty("key") ){
		// 						this.SITE_CONSTANT[response.data.configData[key].key] = response.data.configData[key].value;
		// 					} 
		// 				}
		// 			}
		// 			if(response.data.constantData){
		// 				for(var key in response.data.constantData){
		// 					if( !response.data.constantData.hasOwnProperty(key) || response.data.constantData[key].hasOwnProperty("constantName") ){
		// 						this.LANG_CONSTANT[response.data.constantData[key].constantName] = response.data.constantData[key].constantValue;
		// 					} 
		// 				}
		// 			}
		// 		}else{
		// 			console.log(response.message);
		// 		}
		// 	}

			
		// });
	}

	constructor(@Inject(DOCUMENT) private document: HTMLDocument,private http: HttpClient,private titleService : Title,private meta: Meta) {
        this.auth_token = localStorage.getItem("auth_token");
        console.log('this.auth_token' + this.auth_token);
		
	};

	public showConfirmDialog(title : string = '',text : string = '',confirmText : string,cancelText : string,executeFunction : Function){

		// Swal.fire({
		// 	title: title,
		// 	text: text,
		// 	type: 'warning',
		// 	showCancelButton: true,
		// 	confirmButtonText: confirmText,
		// 	cancelButtonText: cancelText
		// }).then((result) => {
		// 	executeFunction(result);
		// });
	}
	public likeUnlikeEvent (post_id : string = '',type:string,main_id:string,userid : string) : Promise<any>{
		let body = {
			global_id:post_id,
			userid:userid,
			main_id:main_id,
			type:type
		};
		let options = this.generateRequestHeaders();
		return this.http
		.post(this.SITE_CONSTANT['API_END_POINT']+'like-unlike',body,options)
		.toPromise()
		.then(this.extractData)
		.catch(this.handleError);
	}

	public generateRequestHeaders(urlEncoded : boolean = true){
		this.headers = new HttpHeaders();

		
        this.headers.append('Cache-Control','no-cache');
		this.headers.append('Access-Control-Allow-Origin','*');
		this.headers.append('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
		if(urlEncoded){
			this.headers.append('Accept','application/json');
			this.headers.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
		}
		this.options = {headers : this.headers,observe:"body"};
		return this.options;
	}


    public generateRequestHeadersAuthorise(urlEncoded : boolean = true){
        this.headers = new HttpHeaders();
        this.headers.append('Authorization',`Bearer ${this.auth_token}`);
        //this.headers.append('Cache-Control','no-cache');
        //this.headers.append('Access-Control-Allow-Origin','*');
        //this.headers.append('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
        if(urlEncoded){
            //this.headers.append('Accept','application/json');
            //this.headers.append('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        }
        this.options = {headers : this.headers,observe:"body"};
        return this.options;
    }

	private extractData(response: any ) {
		return response;
	}

	private handleError (error: HttpErrorResponse) {		
		let errMsg = '';
		if (error.error instanceof Error) {
			errMsg = error.message || 'Client-side error occured.'; 
		} else {
			errMsg = error.message || 'Server-side error occured.'; 
		}
		return throwError(errMsg);
    	//return Observable.throw(errMsg); // returns the message in a new, failed observable
    }

    public SubmiPostFormData(url : string,body : any,options:any) : Promise<any>{
    	return this.http
    	.post(`${environment.apiUrl}/api/`+url,body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    postData(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    sharePost(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    postList(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    deletePost(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    deleteGroup(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    getFeedDetail(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    updateFeed(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    likePost(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    postComment(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    likeComment(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    editGroup(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    public chnagePostNotification(global_id : string = '',global_type : string,user_id : string) : Promise<any>{
    	let body = {
    		global_id:global_id,
    		user_id:user_id,
    		global_type:global_type
    	};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'change-post-notification',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }
    getGroupDetail(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }
    getPlaceDetail(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);	
    }
    getPhotoVideoDetail(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);	
    }

    groupList(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    memberList(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    joinLeaveGroup(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);	
    }

    joinGroupList(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);	
    }

    eventList(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    deleteEvent(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    getList(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    addComment(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    commentReply(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);		
    }

    commentReplyOfReply(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);		
    }

    unTagUser(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);	
    }

    getCommentReply(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);		
    }

    getCommentReplyOfReply(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);		
    }

    likeCommentReply(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);			
    }

    getEventDetail(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    editEventDetail(url: string, body: any, options: any){
    	return this.http.post(this.SITE_CONSTANT['API_END_POINT']+url,body,options);
    }

    public showLoader(){
    	if(this.SITE_CONSTANT['SHOW_AJAX_LOADER'] == 'y'){
    		let ele = this.document.querySelector("#siteLoader");
    		if(ele !== null){
    			if(ele.className == 'loader d-none'){
    				ele.className = 'loader d-block';
    			}
    		}
    	}
    }

    public hideLoader(){
    	if(this.SITE_CONSTANT['SHOW_AJAX_LOADER'] == 'y'){
    		let ele = this.document.querySelector("#siteLoader");
    		if(ele !== null){
    			if(ele.className == 'loader d-block'){
    				ele.className = 'loader d-none';
    			}
    		}
    	}
    }	 

    public followUnfollowUser(userid : string = '',requester_userid : string) : Promise<any>{
    	let body = {
    		requester_userid:requester_userid,
    		userid:userid
    	};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'add-remove-follow-unfollow',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    } 

    public getHomeSlider() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-home-slider',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getCountries() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-countries',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getCategories() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-categories',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getPageCategories() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-page-categories',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getArticleCategories() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-article-categories',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getArticleSubCategories(cat_id :any = 0) : Promise<any>{
    	let body = {};
    	body['cat_id'] = cat_id; 
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-article-sub-categories',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getPlaceTypes() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-place-types',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getAllCities() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-cities',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getStates(country_id : string) : Promise<any>{
    	let body = {'country_id':country_id};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-states',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getLanguages() : Promise<any>{
    	let body = {};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-languages',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public getSuggestedUsers(getUserId :any = 0,listingLimit :any = 0) : Promise<any>{
    	let body = {};
    	body['userid'] = getUserId;
    	body['limit'] = listingLimit;
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-user-suggestion-home-page',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public setMetaTags(metaArray : any){
    	let description = this.checkVar(metaArray.description) != '' ? metaArray.description : this.SITE_CONSTANT['SITE_NAME'];
    	let viewport = this.checkVar(metaArray.viewport) != '' ? metaArray.viewport : 'width=device-width, initial-scale=1';
    	let author = this.checkVar(metaArray.author) != '' ? metaArray.author : this.SITE_CONSTANT['SITE_NAME'];
    	let keywords = this.checkVar(metaArray.keywords) != '' ? metaArray.keywords : this.SITE_CONSTANT['SITE_NAME'];
    	this.resetMetaTags();
    	this.meta.addTags([
    		{name: 'description', content: description},   
    		{name: 'viewport', content: viewport},
    		{name: 'author', content: author},
    		{name: 'keywords', content: keywords}
    		],true);      
    }

    public resetMetaTags(){
    	this.meta.removeTag('name = "description"');
    	this.meta.removeTag('name= "viewport"');
    	this.meta.removeTag('name = "author"');
    	this.meta.removeTag('name= "keywords"');
    }

    public getCities(state_id : string) : Promise<any>{
    	let body = {'state_id':state_id};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-cities',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    // public dataURLtoBlob(dataURL) {
    // 	var BASE64_MARKER = ';base64,';
    // 	if (dataURL.indexOf(BASE64_MARKER) == -1) {
    // 		var parts = dataURL.split(',');
    // 		var contentType = parts[0].split(':')[1];
    // 		var raw = decodeURIComponent(parts[1]);
    // 		return new Blob([raw], {
    // 			type: contentType
    // 		});
    // 	}
    // 	var parts = dataURL.split(BASE64_MARKER);
    // 	var contentType = parts[0].split(':')[1];
    // 	var raw = window.atob(parts[1]);
    // 	var rawLength = raw.length;
    // 	var uInt8Array = new Uint8Array(rawLength);
    // 	for (var i = 0; i < rawLength; ++i) {
    // 		uInt8Array[i] = raw.charCodeAt(i);
    // 	}
    // 	return new Blob([uInt8Array], {
    // 		type: contentType
    // 	});
    // }

    public getUserMyOrganizers(userid : string) : Promise<any>{
    	let body = {'userid' : userid,'page':1,'limit':1000};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'get-user-organizers',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public dateFormatTime(date : any,format : string = 'onlyDate',locale :string = 'en-US'){
    	if(date != undefined && date !== 'undefined' && date != 'undefined' && date !== null && date != 'null'){
    		date = new Date(date.toString().replace(/-/g, "/"));
    		if(format == 'onlyTime'){
    			return formatDate(date,'h:mm a',locale);
    		}else if(format == 'onlyDate'){
    			return formatDate(date,'dd MMM y',locale);
    		}else if(format == 'dateTime'){
    			return formatDate(date,'MM/dd/y h:mm a',locale);
    		}else{
    			return formatDate(date,format,locale);
    		}
    	}
    	return date;
    }

    public findInvalidErrors(formControls : any){
    	const invalid = [];
    	const controls = formControls;
    	for (const name in controls) {
    		if (controls[name].invalid) {

    			invalid.push(name);
    		}
    	}
    	return invalid;
    }

    public getCookieValue(a : any) {
    	var b = document.cookie.match('(^|[^;]+)\\s*' + a + '\\s*=\\s*([^;]+)');
    	return b ? b.pop() : '';
    }

    public deleteAllCookie(){
    	document.cookie.split(";").forEach(function(c) { 
    		document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    	});
    }

    public checkVar(chkVar : any,returnDefault : string = ''){
    	if(chkVar == null || chkVar == undefined || chkVar == ""){
    		return returnDefault;
    	}else{
    		return chkVar;
    	}
    }

    public showAmount(amount : string){
    	let result = amount.replace(this.SITE_CONSTANT['CURRENCY_SIGN_SYMBOL'], "");
    	return result;
    }

    public updateToggleClass(event : any,updateClass : any = [],isPreserve : boolean = false){
    	const classList = event.target.classList;
    	const classes = event.target.className;

    	if(!isPreserve){
    		event.target.classList = [];
    	}

    	// if(!(classes.includes(updateClass))){
    	// 	updateClass.forEach(element => {
    	// 		classList.add(element)	
    	// 	});
    	// }
    }

    public truncateString(text : any = '',limit : number = 25,endString : any = '...'){
    	if(text.length > limit){
    		text = text.substring(0, limit) + endString;
    	}
    	return text;
    }

    public setTitle( newTitle: string) {
    	this.titleService.setTitle( newTitle );
    }

    public hidePostFromTimeline(post_id : string = '',user_id : string,hide_type : string) : Promise<any>{
    	let body = {
    		global_id:post_id,
    		user_id:user_id,
    		hide_type:hide_type
    	};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'hide-post',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }

    public deleteMyEvent(post_id : string = '',userid : string) : Promise<any>{
    	let body = {
    		postid:post_id,
    		userid:userid
    	};
    	let options = this.generateRequestHeaders();
    	return this.http
    	.post(this.SITE_CONSTANT['API_END_POINT']+'delete-feed-post',body,options)
    	.toPromise()
    	.then(this.extractData)
    	.catch(this.handleError);
    }
}
