import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import RichEditor from '../../tools/RichEditor';
import LoadImage from '../../tools/LoadImage';
import TitleEditor from '../../tools/TitleEditor';
import LinkEditor from '../../tools/LinkEditor';
import SweetAlert from 'sweetalert2';


let col;

export default class MainCategories extends Component {
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			colCount: "",
			pageItems: [],
			preload: false
		}
		this.getCats = this.getCats.bind(this);
		this.updateItems = this.updateItems.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.addCategory = this.addCategory.bind(this);
	}
	componentDidMount(){
		this.getCats();
	}
	deleteCategory(id){
		let val = {
			id: id,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'category_unpublish.php',
			type: 'POST',
			data: val,
		}).done(function(id, d) {
			if (d.result == "success") {
				let categories = this.state.categories;
				categories.find(x=> x.Id == id).Unpublish = 1;
				this.setState({categories});
			}
		}.bind(this, id)).fail(function() { console.log('error'); });
	}
	addCategory(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'category_add.php',
			type: 'POST',
			data: val,
		}).done(function(d) {
			if (d.result == "success") {
				let categories = this.state.categories;
				let catParent = {
					CatImg: "no-image.jpg",
					CatInfo: "לורם איפסום דולור סיט אמט, קונסקטורר אדיפיסינג אלית ליבם סולגק. בראיט ולחת צורק מונחף, בגורמי מגמש. תרבנך וסתעד לכנו סתשם השמה - לתכי מורגם בורק?",
					CatName: "שם הקטגוריה",
					Id: d.id,
					ParentId: null,
					Animated: true
				}
				let catChild = {
					CatName: "שם תת קטגוריה",
					Id: d.id + 1,
					ParentId: d.id
				}
				categories.push(catParent);
				categories.push(catChild);
				this.setState({categories});
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
	uploadImg(itemId, d){
		this.setState({preload: itemId});
		let val = {
			id: itemId,
			fileName: d.fileName,
			img: d.Img,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'category_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let cats = this.state.categories;
				cats.find(x=> x.Id == d.id).CatImg = d.fileName;
				this.setState({categories: cats});
			}
			this.setState({preload: false});
		}.bind(this, val)).fail(function() { this.setState({preload: false}); });
	}
	getCats(){
		$.ajax({
			url: globalServer + 'cats_view.php',
			type: 'POST'
		}).done(function(data) {
			let mainCat = data.filter((elem) => { return !elem.ParentId && !elem.Unpublish });
			this.setState({ categories: data, colCount: mainCat.length });
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	updateItems(itemId, text, paramName){
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'cats_edit.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let cats = this.state.categories;
				cats.find(x=> x.Id == d.id).CatName = d.val;
				this.setState({categories: cats});
			} else {
				SweetAlert({
					title: 'Nothing change',
					type: 'info',
					timer: 3000,
					showConfirmButton: false,
				});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	render(){
		return (
			<section className="main-categories">
				<div className="main-categories-wrapper flex-container">
					{this.state.categories.map((element, index) => {
						if (!element.ParentId && !element.Unpublish) {
							let pageItems = this.state.categories.filter((elem) => { return elem.ParentId == element.Id });
							if (!localStorage.role) {
								return(
									<div className={this.state.colCount > 2 ? "col-lg-4" : "col-lg-6"} key={index}>
										<div className="wrapp">
											<div className="img">
												<img src={globalFileServer + 'cats/' + element.CatImg} alt="" />
											</div>
											<div className="mask">
												<p dangerouslySetInnerHTML={{__html: element.CatInfo}}></p>
											</div>
											<NavLink className="cat-link custom-bg" to={"/category/" + element.Id +"/"+ pageItems[0].Id}>{element.CatName}</NavLink>
										</div>
									</div>
								) } else {
									return(
										<div className={element.Animated ? "col-lg-4 for-edit animated bounceIn" : "col-lg-4 for-edit"} key={index}>
											<div className="wrapp edit-mod">
												{this.state.preload == element.Id ?
													<div className="loader-container">
														<div className="loader"></div>
													</div> : null}
												<div className="img">
													<LoadImage
														itemId={element.Id}
														img={'cats/' + element.CatImg}
														uploadImg={this.uploadImg}
														toUpdate='CatImg'
														ratio={16 / 14}
													/>
												</div>
												<div className="mask-editor">
													<RichEditor
														text={element.CatInfo}
														itemId={element.Id}
														updateItems={this.updateItems}
														toUpdate='CatInfo'
														extended={false}
													/>
												</div>
												<LinkEditor
											title={element.CatName}
											part_1={pageItems[0] ? pageItems[0].Id : null}
											part_2={element.Id}
											itemId={element.Id}
											updateItems={this.updateItems}
											toUpdate='CatName'
										/>
										<button onClick={this.deleteCategory.bind(this, element.Id)} className="delete-cat">
											<img src={globalFileServer + 'icons/delete-button.png'} alt="" />
										</button>
									</div>
								</div>
							)
							}
						}
					})}
					{localStorage.role ?
					<div className="col-lg-4 admin">
						<div className="wrapp">
							<div>
								<img onClick={this.addCategory} src={globalFileServer + 'icons/add.png'} alt="" />
								<h4>הוסף קטגוריה חדשה</h4>
							</div>
						</div>
					</div> : null }
				</div>
			</section>
		)
	}
}
