import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';

import './AddRecommendedProduct.scss';

export default class AddRecommendedProduct extends Component {
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			products: [],
			subCatId: false,
			subCatActiveId: false,
			selectedProducts: this.props.selectedProducts ? this.props.selectedProducts : '0',
			singleProduct: "",
			foundProducts: [],
			viewProducts: []
		}
		this.getCats = this.getCats.bind(this);
		this.getProduct = this.getProduct.bind(this);
		this.getProductsSearch = this.getProductsSearch.bind(this);
		this.getSelectedProducts = this.getSelectedProducts.bind(this);
	}
	componentDidMount(){
		this.getCats();
		this.getSelectedProducts(this.props.selectedProducts ? this.props.selectedProducts : '0');
		localStorage.setItem('selectedProducts', JSON.stringify(this.props.selectedProducts ? this.props.selectedProducts : '0'));
	}
	getSelectedProducts(ProductIds){
		let val = { 'id': ProductIds.length ? ProductIds : null };
		$.ajax({
			url: globalServer + 'recommended_products_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ viewProducts: data });
		}.bind(this)).fail(function(d) { console.log("error"); });
	}
	getProductsSearch(e){
		let val = { 'word': e.target.value };
		$.ajax({
			url: globalServer + 'product_search.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "no-found") {
				this.setState({ foundProducts: [] });
			} else {
				this.setState({ foundProducts: data.ShopsProdss });
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	selectProduct(id){
		let selectedProducts = this.state.selectedProducts == '0' ? [] : this.state.selectedProducts.split(',');
		selectedProducts.push(id + '');
		this.setState({selectedProducts: selectedProducts.join()});
		this.getSelectedProducts(selectedProducts.join());
	}
	deSelectProduct(id){
		let selectedProducts = this.state.selectedProducts.split(',');
		let sP = selectedProducts.filter((elem) => { return elem != id });
		this.setState({selectedProducts: sP.join()});
		this.getSelectedProducts(sP.join());
	}
	getCats(){
		$.ajax({
			url: globalServer + 'cats_view.php',
			type: 'POST'
		}).done(function(data) {
			this.setState({ categories: data });
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getProducts(id){
		this.setState({subCatActiveId: id});
		let val = { 'id': id };
		$.ajax({
			url: globalServer + 'products_per_category_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ products: data });
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getProduct() {
		if (!this.isEmpty(this.state.singleProduct)) {

			this.setState({subCatId: false, subCatActiveId: false});
			let val = { 'id': this.state.singleProduct };
			$.ajax({
				url: globalServer + 'product_view.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
				this.setState({ products: data });
				if (data[0].ParentId) {
					SweetAlert({
						title: 'מספר קטלוגי לא תקין',
						text: 'המספר קטלוגי שאתא מכפס - "' + data[0].ParentId + '"',
						type: 'info',
						timer: 3000,
						showConfirmButton: false,
					}).catch(SweetAlert.noop);
				}
			}.bind(this)).fail(function() {
				SweetAlert({
					title: 'המוצר לא נמצא',
					text: 'אין מוצר עם מספר קטלוגי - "' + this.state.singleProduct + '"',
					type: 'info',
					timer: 3000,
					showConfirmButton: false,
				}).catch(SweetAlert.noop);
			}.bind(this));

		}
	}
	closePopup(data) {
		if (!this.isEmpty(data)) {
			this.props.closePopup(data);
		} else {
			this.props.closePopup();
		}
	}
	close(){
		this.props.closePopup(JSON.parse(localStorage.getItem('selectedProducts')));
	}
	isEmpty(obj) {
		for (let x in obj) { return false; }
		return true;
	}
	render(){
		return (
			<div className={this.state.products.length ? "popup big-popup" : "popup"} id="addrp">
				<div className="popup-wrapper">
					<div onClick={this.close.bind(this, this.state.selectedProducts)} className="close-popup">
						<img src={globalFileServer + 'icons/cancel.png'} alt="" />
					</div>
					<div onClick={this.closePopup.bind(this, this.state.selectedProducts)} className="close-popup save">
						<img src={globalFileServer + 'icons/checked.png'} alt="" />
					</div>
					<div className="wrapp">
						<div className="free-search">
							<input onClick={this.getProductsSearch} onChange={this.getProductsSearch} type="text" />
							<button><img src={globalFileServer + 'icons/search.svg'} /></button>
							<div className="search-result">
								<ul>
								{this.state.foundProducts.map((element, index) => {
									return(
										<li onClick={() => this.setState({products: [element], foundProducts: []})} key={index}>
											<a>{element.ProdName.length > 20 ? element.ProdName.substring(0,20) + '...' : element.ProdName}</a>
										</li>
									)
								})}
								</ul>
							</div>
						</div>
						<div className="result">
						<ul>
							{this.state.viewProducts.map((element, index) => {
								let isSelected = this.state.selectedProducts.split(',').filter((elem, ind) => { return elem == element.Id });
								return (
									<li onClick={!this.isEmpty(isSelected) ? this.deSelectProduct.bind(this, element.Id) : this.selectProduct.bind(this, element.Id)} key={index}>
										<div className="prod-wrapp">
											{!this.isEmpty(isSelected) ? <img className="checked" src={globalFileServer + 'icons/close-white.png'} alt="" /> : null}
											<div className="img">
												{element.CatalogNum ?
												<img onError={(e)=> e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
												:
												<img src={globalFileServer + 'products/product.jpg'} alt="" />
												}
											</div>
										</div>
										<div className="name">
											<h4>{element.ProdName.length > 20 ? element.ProdName.substring(0,20) + '...' : element.ProdName}</h4>
										</div>
									</li>
								)
							})}
						</ul>
						</div>
						<div className="container flex-container">
							{this.state.categories.map((element, index) => {
								if (!element.ParentId && !element.Unpublish) {
									return (
										<div key={index} className="main-categories">
											<div className="cat-wrapp" onClick={()=> this.setState({subCatId: element.Id, products: []})}>
												<p className={this.state.subCatId == element.Id ? "active" : null}>
													<img className="checked" src={globalFileServer + 'icons/right-arrow-blue.png'} alt="" />
													<span>{element.CatName}</span>
												</p>
											</div>
										</div>
									)
								}
							})}
						</div>
						{this.state.subCatId ?
						<div className="categories">
							<ul>
							{this.state.categories.map((element, index) => {
								if (element.ParentId == this.state.subCatId && !element.Unpublish) {
									return (
										<li onClick={this.getProducts.bind(this, element.Id)} key={index}>
											<p className={this.state.subCatActiveId == element.Id ? 'active' : null}>
												<img className="checked" src={globalFileServer + 'icons/right-arrow-blue.png'} alt="" />
												<span>{element.CatName.length > 15 ? element.CatName.substring(0,15) + " ..." : element.CatName}</span>
											</p>
										</li>
									)
								}
							})}
							</ul>
						</div> : null}
						{this.state.products.length ? <div className="products">
							<ul>
							{this.state.products.map((element, index) => {
								if (!element.ParentId) {
								let isSelected = this.state.selectedProducts.split(',').filter((elem, ind) => { return elem == element.Id });
								return (
									<li onClick={!this.isEmpty(isSelected) ? this.deSelectProduct.bind(this, element.Id) : this.selectProduct.bind(this, element.Id)} key={index}>
										<div className="prod-wrapp">
											{!this.isEmpty(isSelected) ? <img className="checked" src={globalFileServer + 'icons/checked.png'} alt="" /> : null}
											<div className="img">
												{element.CatalogNum ?
												<img onError={(e)=> e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
												:
												<img src={globalFileServer + 'products/product.jpg'} alt="" />
												}
											</div>
										</div>
										<div className="name">
											<h4>{element.ProdName.length > 20 ? element.ProdName.substring(0,20) + '...' : element.ProdName}</h4>
										</div>
									</li>
								)}
							})}
							</ul>
						</div> : null}
					</div>
				</div>
			</div>
		)
	}
}
