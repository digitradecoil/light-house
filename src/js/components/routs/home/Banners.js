import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import RichEditor from '../../tools/RichEditor';
import MyCropper from '../../tools/MyCropper';
import TitleEditor from '../../tools/TitleEditor';
import LinkEditor from '../../tools/LinkEditor';
import SweetAlert from 'sweetalert2';


export default class Banners extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			preload: false,
			mobile: false
		}
		this.getBanners = this.getBanners.bind(this);
		this.updateItems = this.updateItems.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
	}
	componentWillMount(){
		this.getBanners();
	}
	componentDidMount(){
		window.outerWidth < 600 ? this.setState({mobile: true}) : null;
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
			url: globalServer + 'banners_edit.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let items = this.state.items;
				items.find(x=> x.Id == d.id)[d.paramName] = d.val;
				this.setState({items});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
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
			url: globalServer + 'banners_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let items = this.state.items;
				items.find(x=> x.Id == d.id).Img = d.fileName;
				this.setState({items});
			}
			this.setState({preload: false});
		}.bind(this, val)).fail(function() { this.setState({preload: false}); });
	}
	getBanners(){
		$.ajax({
			url: globalServer + 'banners_view.php',
			type: 'POST'
		}).done(function(data) {
			this.setState({ items: data.Bannerss });
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	IsProduct(id, e){
		let checked = e.target.checked ? "product" : "";
		this.updateItems(id, checked, 'Other');
	}
	render(){
		return (
			<section className="banners">
				<div className="banners-wrapper flex-container">
					{this.state.items.length ? this.state.items.map((element, index) => {

            return(
              <div key={index} className="col-lg-6 user">
                <div className="banner-container">
                  <div>
                    {/* {element.Other == "product" ?
                      <NavLink className="absolute-link" to={'/product/' + element.Link}></NavLink>
                      :
                      <a className="absolute-link" href={"http://" + element.Link} target="_blank"></a>
                    } */}
                    <NavLink className="absolute-link" to={'/category' + element.Link}></NavLink>
                  </div>
                  <div className="img">
                    <img src={globalFileServer + 'banners/' + element.Img} />
                  </div>
                </div>
              </div>
            )


            //  if (!localStorage.role) {
            //
						// } else {
						// 	return(
						// 		<div key={index} className="col-lg-4 admin">
						// 			<div className="banner-container">
						// 				<div className="img">
						// 					{this.state.preload == element.Id ?
						// 						<div className="loader-container">
						// 							<div className="loader"></div>
						// 						</div> : null}
						// 					<MyCropper
						// 						itemId={element.Id}
						// 						img={'banners/' + element.Img}
						// 						folder="banners"
						// 						uploadImg={this.uploadImg}
						// 						toUpdate='Img'
						// 						ratio={16 / 10}
            // />
						// 				</div>
						// 				<div className="desc"></div>
						// 			</div>
						// 		</div>
						// 	)
						// }
					}) : null}
				</div>
			</section>
		)
	}
}
