import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import RichEditor from '../tools/RichEditor';
import MyCropper from '../tools/MyCropper';
import TitleEditor from '../tools/TitleEditor';
import Slider from 'react-slick';
import Sales from './home/Sales';
import Parallax from './home/Parallax';
import RecommendedProducts from './productPage/RecommendedProducts';
import AddRecommendedProduct from './productPage/AddRecommendedProduct';

let products = [];
let wishList = [];
let settings = [];
let settings_for_slider = {
	dots: true,
	rtl: false,
	autoplay: false,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	slidesToScroll: 1
}
if (window.innerWidth < 600) {
	settings = {
		dots: true,
		rtl: false,
		autoplay: false,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1
	};
} else {
	settings = {
		dots: true,
		rtl: localStorage.role ? true : false,
		autoplay: true,
		infinite: false,
		speed: 2000,
		autoplaySpeed: 3000,
		slidesToShow: 4,
		slidesToScroll: 4,
		swipe: false,
		swipeToSlide: false,
		responsive: [{
			breakpoint: 1100,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			}
		}, {
			breakpoint: 800,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
	};
}
export default class ProductPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			product: [],
			additionalImages: [],
			mainImage: '',
			quantity: 1,
			recommendedProducts: [],
			defaultProduct: [],
			addadedToCart: false,
			addadedToWishList: false,
			userDiscount: [],
			standarts: [],
			newProdValue: "",
			newProdUnit: "",
			changetValueOrUnit: false,
			popup: false,
			preload: false,
			dateNew: ''
		}
		this.getAdditionalImg = this.getAdditionalImg.bind(this);
		this.selectChildren = this.selectChildren.bind(this);
    this.increaseQuantity = this.increaseQuantity.bind(this);
    this.decreaseQuantity = this.decreaseQuantity.bind(this);

		this.getRecommendedProducts = this.getRecommendedProducts.bind(this);
		this.resetState = this.resetState.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.addToWishList = this.addToWishList.bind(this);
		this.getStandarts = this.getStandarts.bind(this);
		this.setUserDiscount = this.setUserDiscount.bind(this);
		this.updateItems = this.updateItems.bind(this);
		this.updateItemsCatalogNum = this.updateItemsCatalogNum.bind(this);
		this.addChildProduct = this.addChildProduct.bind(this);
		this.setDiscountType = this.setDiscountType.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.addAdditionalImg = this.addAdditionalImg.bind(this);
		this.setPublic = this.setPublic.bind(this);
		this.setUnPublic = this.setUnPublic.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.deleteRProduct = this.deleteRProduct.bind(this);
		this.deleteSubProduct = this.deleteSubProduct.bind(this);
	}
	componentDidMount(){
		this.getProduct(this.props.match.params.id);
		this.getStandarts();
		let dateNew = new Date;
		dateNew = dateNew.toLocaleTimeString().slice(0, -3);
		this.setState({dateNew});
	}
	componentWillReceiveProps(nextProps) {
		var routeChanged = nextProps.location !== this.props.location
		if (routeChanged) {
			this.getProduct(nextProps.match.params.id);
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.popup !== this.state.popup) {
			nextState.popup ? $('body').addClass('fix') : $('body').removeClass('fix');
		}
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
	}
	deleteSubProduct(){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			id: this.state.defaultProduct.Id
		};
		$.ajax({
			url: globalServer + 'delete_sub_product.php',
			type: 'POST',
			data: val,
		}).done(function(id, d) {
			let product = this.state.product.filter((element) => {
				return element.Id !== id
			});
			this.setState({product, defaultProduct: product[0]});
		}.bind(this, val.id)).fail(function() { console.log('error'); });
	}
	deleteMainImg(data){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			fileName: data + '.jpg'
		};
		$.ajax({
			url: globalServer + 'delete_img.php',
			type: 'POST',
			data: val,
		}).done(function(img, data) {
			this.setState({mainImage: null});
			let additionalImages = this.state.additionalImages.filter((element) => {
				return element != img
			});
			this.setState({additionalImages});
		}.bind(this, val.fileName)).fail(function() { console.log('error'); });
	}
	closePopup(data){
		this.updateItems(this.state.product[0].Id, data ? data : "", 'ProdAddOns');
		this.setState({popup: false});
	}
	addChildProduct() {
		let val = {
			parentId: this.state.product[0].Id,
			catId: this.state.defaultProduct.CatId,
			prodName: this.state.defaultProduct.ProdName,
			prodDescription: this.state.defaultProduct.ProdDescription,
			discountType: 1,
			discountVal: null,
			prodPrice: 100,
			standartId: this.state.defaultProduct.StandartId,
			deliveryInfo: 'ללא עלות (עד 7 ימי עסקים)',
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'create_product.php',
			type: 'POST',
			data: val,
		}).done(function(val, d) {
			if (d.result == "success") {
				let product = this.state.product;
				let newProduct = {
					BarcodeNumber: val.barcodeNumber ? val.barcodeNumber : null,
					CatId: val.catId,
					CatalogNum:	null,
					CommisionPercent: val.commisionPercent ? val.commisionPercent : null,
					DeliveryInfo: val.deliveryInfo,
					DeliveryPricePerKg:	val.deliveryPricePerKg ? val.deliveryPricePerKg : null,
					DepositPrice: val.depositPrice ? val.depositPrice : null,
					DiscountType: val.discountType ? val.discountType : 1,
					DiscountVal: val.discountVal ? val.discountVal : null,
					Id: d.id,
					IsMaam: val.isMaam ? val.isMaam : null,
					IsProdSale: val.isProdSale ? val.isProdSale : null,
					Orden: val.orden ? val.orden : null,
					ParentId: val.parentId ? val.parentId : null,
					ProdAddOns: val.prodAddOns ? val.prodAddOns : null,
					ProdDescription: val.prodDescription,
					ProdName: val.prodName,
					ProdPrice: val.prodPrice,
					ProdRating: val.prodRating ? val.prodRating : null,
					ProdUnit: val.prodUnit ? val.prodUnit : null,
					ProdValue: val.prodValue ? val.prodValue : null,
					ProductWeightKg: val.productWeightKg ? val.productWeightKg : null,
					Public: 1,
					SingleQuanInBox: val.singleQuanInBox ? val.singleQuanInBox : null,
					StandartId: val.standartId ? val.standartId : null
				}
				product.push(newProduct);
				this.setState({product, defaultProduct: newProduct});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	getStandarts(){
		$.ajax({
			url: globalServer + 'standarts_view.php',
			type: 'POST'
		}).done(function(data) {
			this.setState({standarts: data.ShopsStandartss});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	userDiscount(user_id){
		let val = { 'userId': user_id };
		$.ajax({
			url: globalServer + 'get_user_discount.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({userDiscount: data});
			this.setUserDiscount(data, this.state.defaultProduct);
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	setUserDiscount(UserDiscount, defaultProduct) {
		let dP = defaultProduct;
		UserDiscount.map((element, index) => {
			element.ProdId == defaultProduct.Id ? dP.DiscountVal = element.DiscountVal : null;
		});
		this.setState({defaultProduct: dP});
	}
	changeProdValue(type, e) {
		let defaultProduct = this.state.defaultProduct;
		defaultProduct[type] = e.target.value;
		this.setState({defaultProduct, changetValueOrUnit: true});
	}
	saveProdValue(type, e) {
		this.updateItems(this.state.defaultProduct.Id, e.target.value, type);
	}
	setDiscountType(e) {
		this.updateItems(this.state.defaultProduct.Id, e.target.value, 'DiscountType');
	}
	deleteRProduct(id){
		let selectedProducts = this.state.product[0].ProdAddOns.split(',');
		let sP = selectedProducts.filter((elem) => { return elem != id });
		this.updateItems(this.state.product[0].Id, sP.join(), 'ProdAddOns');
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
			url: globalServer + 'products_edit.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let defaultProduct = this.state.defaultProduct;
				defaultProduct[d.paramName] = d.val;
				this.setState({defaultProduct});
				if (d.paramName == 'ProdAddOns') {
					this.getRecommendedProducts(d.val);
				}
			} else {}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	updateItemsCatalogNum(itemId, text, paramName){
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'products_edit_catalog_number.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let defaultProduct = this.state.defaultProduct;
				defaultProduct[d.paramName] = d.val;
				this.setState({defaultProduct});
			}
			if (data.result == "error") {
				SweetAlert({
					title: 'Nothing change',
					type: 'info',
					timer: 3000,
					showConfirmButton: false,
				});
			}
			if (data.result == "alreadyExist") {
				SweetAlert({
					title: 'already exist',
					type: 'info',
					timer: 3000,
					showConfirmButton: false,
				});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	setPublic(){
		this.updateItems(this.state.defaultProduct.Id, 1, 'Public');
	}
	setUnPublic(){
		this.updateItems(this.state.defaultProduct.Id, null, 'Public');
	}
	IsProdSale(id, e){
		let checked = e.target.checked ? "1" : null;
		this.updateItems(id, checked, 'IsProdSale');
	}
	selectStandart(id){
		let standarts = this.state.defaultProduct.StandartId ? this.state.defaultProduct.StandartId.split(',') : [];
		standarts.push(id + "");
		let nStandarts = standarts.join();
		this.updateItems(this.state.defaultProduct.Id, nStandarts, 'StandartId');
	}
	deSelectStandart(id){
		let standarts = this.state.defaultProduct.StandartId ? this.state.defaultProduct.StandartId.split(',') : [];
		standarts = standarts.filter((elem) => { return elem != id });
		let nStandarts = standarts.join();
		this.updateItems(this.state.defaultProduct.Id, nStandarts, 'StandartId');
	}
	addAdditionalImg(itemId, d) {
		let val = {
			fileName: this.state.defaultProduct.CatalogNum + '_' + (parseFloat(this.state.additionalImages.length) + 1) + '.jpg',
			img: d.Img,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'product_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let today = new Date();
				let milliseconds = today.getMilliseconds();
				let additionalImages = this.state.additionalImages;
				let img = additionalImages.filter((elem) => {
					if (elem.indexOf('?') > -1) {
						return elem.substring(0, elem.indexOf('?')) !== d.fileName
					} else {
						return elem !== d.fileName
					}
				});
				img.push(d.fileName + '?' + milliseconds);
				this.setState({mainImage: d.fileName + '?' + milliseconds, additionalImages: img});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	uploadImg(itemId, d){
		let readyImg;
		this.setState({preload: true});
		if (this.state.mainImage) {
			if (this.state.mainImage.indexOf('?') > -1) {
				readyImg = this.state.mainImage.substring(0, this.state.mainImage.indexOf('?'));
			} else {
				readyImg = this.state.mainImage;
			}
		}
		let val = {
			fileName: this.state.defaultProduct.CatalogNum + '.jpg',
			img: d.Img,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'product_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let today = new Date();
				let milliseconds = today.getMilliseconds();
				let additionalImages = this.state.additionalImages;
				let img = additionalImages.filter((elem) => {
					if (elem.indexOf('?') > -1) {
						return elem.substring(0, elem.indexOf('?')) !== d.fileName
					} else {
						return elem !== d.fileName
					}
				});
				img.push(d.fileName + '?' + milliseconds);
				this.setState({mainImage: d.fileName + '?' + milliseconds, additionalImages: img, preload: false});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	deleteImg(img){
		let newImg;
		if (img.indexOf('?') > -1) {
			newImg = img.substring(0, img.indexOf('?'));
		} else {
			newImg = img;
		}
		let val = {
			fileName: newImg,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'delete_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let additionalImages = this.state.additionalImages;
				let img = additionalImages.filter((elem) => {
					if (elem.indexOf('?') > -1) {
						return elem.substring(0, elem.indexOf('?')) !== d.fileName
					} else {
						return elem !== d.fileName
					}
				});
				this.setState({additionalImages: img});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	resetState(){
		this.setState({
			product: [],
			additionalImages: [],
			mainImage: '',
			quantity: 1,
			recommendedProducts: [],
			defaultProduct: [],
			addadedToCart: false,
			addadedToWishList: false,
			userDiscount: [],
			newProdValue: "",
			newProdUnit: ""
		});
	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}
	getProduct(id) {
		this.resetState();
		let val = { 'id': id };
		$.ajax({
			url: globalServer + 'product_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({	product: data, defaultProduct: data[0] });
			localStorage.user_id ? this.userDiscount(localStorage.user_id) : null;
			this.getAdditionalImg(data[0].CatalogNum);
			if (data[0].ProdAddOns) this.getRecommendedProducts(data[0].ProdAddOns);
			//products
			localStorage.products ?	products = JSON.parse(localStorage.getItem("products")) : null;
			let currProduct = products.filter((element) => { return element.product.Id == data[0].Id });
			currProduct.length ? this.setState({addadedToCart: true}) : this.setState({addadedToCart: false});
			//wishList
			localStorage.wishList ?	wishList = JSON.parse(localStorage.getItem("wishList")) : null;
			let currWishProduct = wishList.filter((element) => { return element.product.Id == data[0].Id });
			currWishProduct.length ? this.setState({addadedToWishList: true}) : this.setState({addadedToWishList: false});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	addToCart(){
		localStorage.products ?	products = JSON.parse(localStorage.getItem("products")) : null;
		let product = {
			product: this.state.defaultProduct,
			quantity: this.state.quantity
		}
		products.push(product);
    this.props.addToCart(product);
		// localStorage.setItem('products', JSON.stringify(products));
		// this.setState({addadedToCart: true});
		// $('#addToCart').trigger('click');
	}
	addToWishList(){
		localStorage.wishList ?	wishList = JSON.parse(localStorage.getItem("wishList")) : null;
		let wishListProduct = {
			product: this.state.defaultProduct,
			quantity: this.state.quantity
		}
		wishList.push(wishListProduct);
		localStorage.setItem('wishList', JSON.stringify(wishList));
		this.setState({addadedToWishList: true});
		$('#localStorage').trigger('click');
	}
	getAdditionalImg(id) {
		if (id) {
			let val = { 'id': id };
			$.ajax({
				url: globalServer + 'additional_images.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
				this.setState({ additionalImages: data, mainImage: data[0] });
			}.bind(this)).fail(function(d) { console.log("error"); });
		}
	}
	getRecommendedProducts(ids){
		let val = { 'id': ids };
		$.ajax({
			url: globalServer + 'recommended_products_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ recommendedProducts: data });
			!localStorage.role ? window.scrollTo(0, 0) : null;
		}.bind(this)).fail(function(d) { console.log("error"); });
	}
	changeMainImage(element) {
		this.setState({ mainImage: element });
	}
	selectChildren(event){
		let product = this.state.product.filter((element, index) => { return element.Id == event.target.value });
		product[0].ProdName = this.state.product[0].ProdName;
		product[0].ProdDescription = this.state.product[0].ProdDescription;
		this.setState({	defaultProduct: product[0] });
		this.setUserDiscount(this.state.userDiscount, product[0]);
		//product
		localStorage.products ?	products = JSON.parse(localStorage.getItem("products")) : null;
		let currProduct = products.filter((element) => { return element.product.Id == product[0].Id });
		currProduct.length ? this.setState({addadedToCart: true}) : this.setState({addadedToCart: false});
		//wishList
		localStorage.wishList ?	wishList = JSON.parse(localStorage.getItem("wishList")) : null;
		let currWishProduct = wishList.filter((element) => { return element.product.Id == product[0].Id });
		currWishProduct.length ? this.setState({addadedToWishList: true}) : this.setState({addadedToWishList: false});
	}
  increaseQuantity(){
    this.setState({	quantity: this.state.quantity -= 1 });
  }
  decreaseQuantity(){
    this.setState({	quantity: this.state.quantity += 1 });
  }
	render(){
		if (!this.isEmpty(this.state.product)) {
			let prodStandarts = this.state.defaultProduct.StandartId ? this.state.defaultProduct.StandartId.split(',') : "";
		const meta = {
			title: this.state.defaultProduct.ProdName,
			description: 'I am a description, and I can create multiple tags',
			canonical: 'http://example.com/path/to/page',
			meta: {
				charset: 'utf-8',
				name: {
					keywords: 'react,meta,document,html,tags'
				}
			}
		};
		return (
			<div>
				<div className={localStorage.role ? "page-container product-page edit-mod" : "page-container product-page"}>
					<h1 className="title" dangerouslySetInnerHTML={{__html: this.state.product[0].ProdName}}></h1>
					{/* <DocumentMeta {...meta} /> */}
					<div className="product-wrapper">
						<div className="col-lg-6 info-p">
							<div className={this.state.defaultProduct.Public ? "product-details" : "product-details unpublish"}>
								{!localStorage.role ?
									<div className="name">
										<h2 className="product-name" dangerouslySetInnerHTML={{__html: this.state.product[0].ProdName}}></h2>
										<div className="catalog-number">
											<span>מספר קטלוגי:</span>
											<p>{this.state.defaultProduct.CatalogNum}</p>
										</div>
									</div>
								:
								<div className="name">
									<TitleEditor
										title={this.state.product[0].ProdName}
										itemId={this.state.product[0].Id}
										updateItems={this.updateItems}
										toUpdate='ProdName'
         />
									<div className={this.state.defaultProduct.CatalogNum ? "catalog-number" : "catalog-number require"}>
										<span className="catalog-number-title">מספר קטלוגי:</span>
										<TitleEditor
											title={this.state.defaultProduct.CatalogNum}
											itemId={this.state.defaultProduct.Id}
											updateItems={this.updateItemsCatalogNum}
											toUpdate='CatalogNum'
          />
									</div>
								</div>
								}
								{!localStorage.role ?
									<div className="details">
										<p dangerouslySetInnerHTML={{__html: this.state.product[0].ProdDescription}}></p>
										{/*<div className="standarts">
											<ul>
											{prodStandarts ? prodStandarts.map((element, index) => {
											let standart = this.state.standarts.filter((elem) => { return element == elem.Id });
											if (!this.isEmpty(standart)) {
											return(
											<li key={index}>
												<img style={{width: '50px'}} src={globalFileServer + 'standarts/' + standart[0].StdImg + '.svg'} alt={standart[0].StdName} />
											</li>
											)}
											}) : null}
											</ul>
										</div>*/}
									</div>
								:
								<div className="details">
									<RichEditor
										text={this.state.product[0].ProdDescription}
										itemId={this.state.product[0].Id}
										updateItems={this.updateItems}
										toUpdate='ProdDescription'
										extended={false}
         />
									{/*
										<div className="standarts">
										<ul>
										{this.state.standarts.map((element, index) => {
										let standart;
										if (!this.isEmpty(prodStandarts)) {
											standart = prodStandarts.filter((elem) => { return element.Id == elem });
										}
										return(
											<li key={index}
										onClick={standart && standart[0] == element.Id ? this.deSelectStandart.bind(this, element.Id) : this.selectStandart.bind(this, element.Id)}
										className={standart && standart[0] == element.Id ? 'active' : null}>
										<img style={{width: '50px'}} src={globalFileServer + 'standarts/' + element.StdImg + '.svg'} alt={element.StdName} />
											</li>
										)
										})}
										</ul>
										</div>
									*/}
									{this.state.product[0].Id == this.state.defaultProduct.Id ?
										<div className="for-sale">
											<div className="checkboxes-and-radios">
												<input type="checkbox"
													onChange={this.IsProdSale.bind(this, this.state.product[0].Id)}
													name="checkbox-cats" checked={this.state.product[0].IsProdSale ? true : false}
            id="checkbox-2" value="2" />
												<label htmlFor="checkbox-2"></label>
											</div>
											<span>מבצעים שווים</span>
										</div> : null}
								</div>
								}
								{!localStorage.role ?
									<div className="actions flex-container">
										{/* <div className="hide-on-desctop">
											<h4>פרטי משלוח:</h4>
											<p>{this.state.product[0].DeliveryInfo}</p>
										</div> */}
										<div className="col-lg-6">
											{/* <div className="hide-on-mobile">
												<h4>פרטי משלוח:</h4>
												<p>{this.state.product[0].DeliveryInfo}</p>
											</div> */}
											<div className="value">
												<select onChange={this.selectChildren}>
													{this.state.product.map((element, index) => {
														if (element.Public) {
															return (
																<option key={index} id={element.Id} value={element.Id}>{element.ProdValue + " " + element.ProdUnit}</option>
															)}
													})}
												</select>
											</div>
										</div>
										<div className="col-lg-6">
											<div className="quantity">
												<div className="quantity-wrapp">
                          <span onClick={this.decreaseQuantity.bind(this)} className="decrease">+</span>
													<p>{this.state.quantity}</p>
                          {this.state.quantity > 1 ?
														<span onClick={this.increaseQuantity.bind(this)} className="increase">&ndash;</span>
													:
													<span className="increase disabled">&ndash;</span>
													}
												</div>
											</div>
										</div>
									</div>
								:
								<div className="actions">
									<div className="view-details">
										{/* <h4>פרטי משלוח:</h4>
                      <TitleEditor
											title={this.state.defaultProduct.DeliveryInfo}
											itemId={this.state.defaultProduct.Id}
											updateItems={this.updateItems}
											toUpdate='DeliveryInfo'
										/> */}
										<div className="add-child-product">
											{this.state.defaultProduct.Id != this.state.product[0].Id ?
												<div onClick={this.deleteSubProduct} className="delete-subProduct">
													<img src={globalFileServer + 'icons/trash.svg'} />
												</div>
											: null}
											<ul>
												<li>
													<input type="text"
														className={!this.state.defaultProduct.ProdValue ? 'empty' : null}
														placeholder="מספר"
														value={this.state.defaultProduct.ProdValue ? this.state.defaultProduct.ProdValue : ''}
														onChange={this.changeProdValue.bind(this, 'ProdValue')}
														onBlur={this.saveProdValue.bind(this, 'ProdValue')} />
												</li>
												<li>
													<input type="text"
														className={!this.state.defaultProduct.ProdUnit ? 'empty' : null}
														placeholder="יחידת המוצר"
														value={this.state.defaultProduct.ProdUnit ? this.state.defaultProduct.ProdUnit : ''}
														onChange={this.changeProdValue.bind(this, 'ProdUnit')}
														onBlur={this.saveProdValue.bind(this, 'ProdUnit')} />
												</li>
												<li>
													<button onClick={()=>this.setState({changetValueOrUnit: false})} className={!this.state.changetValueOrUnit ? "disabled" : null}>שמור</button>
												</li>
												<li>
													{this.state.defaultProduct.Id != this.state.product[0].Id ?
														<div
															onClick={this.state.defaultProduct.Public ? this.setUnPublic : this.setPublic}
															className={this.state.defaultProduct.Public ? "public enable" : "public disable"}>
															{this.state.defaultProduct.Public ? <img src={globalFileServer + 'icons/publick.svg'} /> : <img src={globalFileServer + 'icons/unpublick.svg'} />}
														</div> : null}
												</li>
											</ul>
										</div>
										{this.state.defaultProduct.ProdValue ?
											<div className="value">
												<select onChange={this.selectChildren}>
													{this.state.product.map((element, index) => {
														return (
															<option key={index} selected={element.Id == this.state.defaultProduct.Id ? "selected" : false} id={element.Id} value={element.Id}>
																<span>{element.ProdValue ? element.ProdValue + " " : "חסרים פרטים"}</span>
																<span>{element.ProdUnit ? element.ProdUnit + " " : " "}</span>
															</option>
														)
													})}
												</select>
												<button onClick={this.addChildProduct} ><img src={globalFileServer + 'icons/add-circular-button.svg'} /> להוסיף סוג חדש</button>
											</div> : null}
									</div>
								</div>
								}
								{!localStorage.role ?
									<div className="price flex-container">
										<div className="col-lg-4 base-price">
											<h4>מחיר רגיל</h4>
											<p>{ parseFloat(this.state.defaultProduct.ProdPrice * this.state.quantity).toFixed(2) } ₪</p>
										</div>
										<div className="col-lg-3">
											<h4>הנחה</h4>
											{this.state.defaultProduct.DiscountVal ?
												<p>
													<span>{this.state.defaultProduct.DiscountType == 2 ? "% ": null}</span>
													<span>
														{this.state.defaultProduct.DiscountType == 2 ? this.state.defaultProduct.DiscountVal :
														parseFloat(this.state.defaultProduct.DiscountVal) * this.state.quantity}
													</span>
													<span>{this.state.defaultProduct.DiscountType == 1 ? " ₪": null}</span>
												</p>
											: <p>0</p>}
										</div>
										<div className="col-lg-5">
											<div className="final-price">
												<h4>אחרי הנחה</h4>
												{this.state.defaultProduct.DiscountType == 1 ?
													<p>{((parseFloat(this.state.defaultProduct.ProdPrice) - this.state.defaultProduct.DiscountVal) * this.state.quantity).toFixed(2)} ₪</p>
												:
												<p>{((parseFloat(this.state.defaultProduct.ProdPrice) - (parseFloat(this.state.defaultProduct.ProdPrice) * this.state.defaultProduct.DiscountVal / 100)) * this.state.quantity).toFixed(2)} ₪</p>
												}
											</div>
										</div>
									</div>
								:
								<div className="price flex-container">
									<div className="col-lg-4">
										<h4>מחיר רגיל</h4>
										<TitleEditor
											title={this.state.defaultProduct.ProdPrice}
											itemId={this.state.defaultProduct.Id}
											updateItems={this.updateItems}
											toUpdate='ProdPrice'
          />
										<span className="shekel"> ₪</span>
									</div>
									<div className="col-lg-4">
										<h4>הנחה</h4>
										<div className="discount-edit">
											<span>
												<TitleEditor
													title={this.state.defaultProduct.DiscountVal ? this.state.defaultProduct.DiscountVal : "0"}
													itemId={this.state.defaultProduct.Id}
													updateItems={this.updateItems}
													toUpdate='DiscountVal'
            />
											</span>
											<select onChange={this.setDiscountType}>
												<option
													selected={this.state.defaultProduct.DiscountType == "1" ? "selected" : false}
													value={1}>
													<span>₪</span>
												</option>
												<option
													selected={this.state.defaultProduct.DiscountType == "2" ? "selected" : false}
													value={2}>
													<span>%</span>
												</option>
											</select>
										</div>
									</div>
									<div className="col-lg-4">
										<div className="final-price">
											<h4>אחרי הנחה</h4>
											{this.state.defaultProduct.DiscountType == 1 ?
												<p>{((parseFloat(this.state.defaultProduct.ProdPrice) - this.state.defaultProduct.DiscountVal) * this.state.quantity).toFixed(2)} ₪</p>
											:
											<p>{((parseFloat(this.state.defaultProduct.ProdPrice) - (parseFloat(this.state.defaultProduct.ProdPrice) * this.state.defaultProduct.DiscountVal / 100)) * this.state.quantity).toFixed(2)} ₪</p>
											}
										</div>
									</div>
								</div>
								}
								<div className="add-to-cart">
									<div className="cart">
                    <button onClick={this.addToCart}>
                      <span>הוספה לסל</span>
                      <img src={globalFileServer + 'icons/cart_1.svg'} alt="" />
                    </button>
									</div>
									<div className="wishlist">
										{!this.state.addadedToWishList ?
											<button onClick={this.addToWishList}>
												<img src={globalFileServer + 'icons/wishlist.svg'} alt="" />
											</button>
										:
										<button onClick={()=> this.props.history.push('/wishList')} className="red-button">
											<img src={globalFileServer + 'icons/wishlist.svg'} alt="" />
										</button>
										}
									</div>
								</div>
								<div className="social">
									<ul>
										<li>
											<span><img src={globalFileServer + 'icons/facebook.svg'} alt="" /></span>
										</li>
									</ul>
								</div>
								<div className="rating-wrapp">
									<span>דירוג משתמשים</span>
									<div className="wrapp">
										<fieldset className="rating">
											<input type="radio" id="star5" name="rating" value="5" />
											<label className= "full" htmlFor="star5" title="Awesome - 5 stars"></label>
											<input type="radio" id="star4" name="rating" value="4" />
											<label className= "full" htmlFor="star4" title="Pretty good - 4 stars"></label>
											<input type="radio" id="star3" name="rating" value="3" />
											<label className= "full" htmlFor="star3" title="Meh - 3 stars"></label>
											<input type="radio" id="star2" name="rating" value="2" />
											<label className= "full" htmlFor="star2" title="Kinda bad - 2 stars"></label>
											<input type="radio" id="star1" name="rating" value="1" />
											<label className= "full" htmlFor="star1" title="Sucks big time - 1 star"></label>
										</fieldset>
									</div>
								</div>
							</div>
						</div>
						<div className="col-lg-6 img-p">
							<div className="product-images">
								{this.state.preload ?
									<div className="loader-container">
										<div className="loader"></div>
									</div> : null}
								<div className="hide-on-mobile back-arrow">
									<a onClick={()=> this.props.history.goBack()}>
										<span>חזור</span>
										<img src={globalFileServer + 'icons/left_arrow.svg'} alt="" />
									</a>
								</div>
								{!localStorage.role ?
									<div className="main-image">
										{this.state.mainImage ?
											<img src={globalFileServer + 'products/' + this.state.mainImage} alt="" />
										:
										<img src={globalFileServer + 'products/product.jpg'} alt="" />
										}
									</div>
								:
								<div className="main-image">
									{this.state.defaultProduct.CatalogNum ?
										<div>
											{this.state.mainImage ?
												<div>
													<div onClick={this.deleteMainImg.bind(this, this.state.defaultProduct.CatalogNum)} className="delete-img">
														<img src={globalFileServer + 'icons/trash.svg'} alt="" />
													</div>
													<MyCropper
														itemId={this.state.defaultProduct.Id}
														img={"products/" + this.state.mainImage + "?" + this.state.dateNew}
														uploadImg={this.uploadImg}
														toUpdate='CatImg'
														folder={"products"}
														ratio={16 / 12.5}
             />
												</div>
											:
											<MyCropper
												itemId={this.state.defaultProduct.Id}
												img="products/product.jpg"
												uploadImg={this.uploadImg}
												folder={"products"}
												toUpdate='CatImg'
												ratio={16 / 12.5}
           />
											}
										</div>
									:
									<div>
										{this.state.mainImage ?
											<img src={globalFileServer + 'products/' + this.state.mainImage} alt="3" />
										:
										<img src={globalFileServer + 'products/product.jpg'} alt="4" />
										}
									</div>
									}
								</div>
								}
								{!localStorage.role ?
									<div>
										{this.state.additionalImages.length > 4 ?
											<div className="additional-images for-slider">
												<Slider {...settings_for_slider}>
													{this.state.additionalImages.map((element, index) => {
														return (
															<div key={index} className="col-lg-4">
																<div className="wrapp">
																	<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element + "?" + this.state.dateNew} alt="" />
																</div>
															</div>
														)
													})}
												</Slider>
											</div>
										:
										<div className="additional-images">
											{this.state.additionalImages.map((element, index) => {
												return (
													<div key={index} className={this.state.additionalImages.length > 3 ? "col-lg-3" : "col-lg-4"}>
														<div className="wrapp">
															<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element} alt="" />
														</div>
													</div>
												)
											})}
										</div>
										}
									</div>
								:
								<div>
									{this.state.additionalImages.length > 3 ?
										<div className="additional-images for-slider">
											<Slider {...settings_for_slider}>
												{this.state.additionalImages.map((element, index) => {
													return (
														<div key={index}>
															{element.indexOf('_') > -1 ? <div onClick={this.deleteImg.bind(this, element)} className="delete"><img src={globalFileServer + "icons/delete-button.svg"} /></div> : null}
															<div className="wrapp">
																<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element} alt="" />
															</div>
														</div>
													)
												})}
												<div className="col-lg-3">
													<div className="wrapp add-img">
														<MyCropper
															itemId={this.state.defaultProduct.Id}
															uploadImg={this.addAdditionalImg}
															folder={"products"}
															ratio={16 / 12.5}
              />
													</div>
												</div>
											</Slider>
										</div>
									:
									<div className="additional-images flex-container">
										{this.state.additionalImages.map((element, index) => {
											return (
												<div key={index} className="col-lg-3">
													{element.indexOf('_') > -1 ? <div onClick={this.deleteImg.bind(this, element)} className="delete"><img src={globalFileServer + "icons/delete-button.svg"} /></div> : null}
													<div className="wrapp">
														<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element} alt="" />
													</div>
												</div>
											)
										})}
										{this.state.mainImage ?
											<div className="col-lg-3">
												<div className="wrapp add-img">
													<MyCropper
														itemId={this.state.defaultProduct.Id}
														uploadImg={this.addAdditionalImg}
														folder={"products"}
														ratio={16 / 12.5}
             />
												</div>
                      </div> : null}
                  </div>
                  }
                </div>
                }
              </div>
            </div>
          </div>
          <div className="related-products">
            { !this.isEmpty(this.state.recommendedProducts) ? <RecommendedProducts getProduct={this.getProduct.bind(this)} products={this.state.recommendedProducts} /> : null }
          </div>
        </div>
        {/* <Parallax img="manicure-parallax.png" /> */}
			</div>
		)
		} else { return (<div className="page-container product-page"></div>) }
	}
}
