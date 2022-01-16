import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

let products = [];
let userDiscountObj = [];
export default class ForSale extends Component {
	constructor(props){
		super(props);
		this.state = {
			productsInCart: [],
			sales: [],
			userDiscount: []
		}
		this.getSales = this.getSales.bind(this);
		this.updateProductsCartLocation = this.updateProductsCartLocation.bind(this);
	}
	componentDidMount(){
		this.setState({ productsInCart: JSON.parse(localStorage.getItem("products")) });
		this.getSales();
	}
	updateProductsCartLocation(){
		this.setState({ productsInCart: JSON.parse(localStorage.getItem("products")) });
	}
	getSales(){
		$.ajax({
			url: globalServer + 'sales_view.php',
			type: 'POST'
		}).done(function(data) {
			this.setState({ sales: data });
			localStorage.user_id ? this.userDiscount(localStorage.user_id) : null;
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
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	addToCart(element){
		localStorage.products ?	products = JSON.parse(localStorage.getItem("products")) : null;
		let product = {	product: element, quantity: 1 }
		products.push(product);
		localStorage.setItem('products', JSON.stringify(products));
		this.setState({ productsInCart: products });
		$('#addToCart').trigger('click');
	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}
	render(){
		const meta = {
			title: 'Mark | מבצים',
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
			<section id="sales" className="sales big-sales-wrapp">
				<h1 id="updateProductsCartLocation" onClick={this.updateProductsCartLocation} className="title">מוצרים שבמבצע</h1>
				{this.state.sales.length ?
					<div className="flex-container wrapper">
						{this.state.sales.map((element, index) => {
							let buyedProduct = !this.isEmpty(this.state.productsInCart) ? this.state.productsInCart.filter((elem, ind) => { return elem.product.Id == element.Id }) : null;
							if (!this.isEmpty(this.state.userDiscount)) {
								userDiscountObj = this.state.userDiscount.filter((elem) => { return elem.ProdId == element.Id});
							}
							return(
								<div className="col-lg-4 big-sales" key={element.id}>
									<div className="wrapp">
										<div className="img">
											<img onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'}
												src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
										</div>
										<div className="discount">
											{!this.isEmpty(userDiscountObj) && userDiscountObj[0].DiscountVal > 0 || element.DiscountVal > 0 ?
												<div>
													<div>{element.DiscountType == 1 ? " ₪" : null}</div>
													<div>{!this.isEmpty(userDiscountObj) ? <p>{userDiscountObj[0].DiscountVal}</p> : <p>{element.DiscountVal}</p>}</div>
													<div>{element.DiscountType == 2 ? "% " : null}</div>
												</div>
											:
											<img onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'}
												src={globalFileServer + 'icons/sale.svg'} alt="" />
											}
										</div>
										<NavLink className="product-link" to={"/product/" + element.Id}></NavLink>
										<div className="mask-details">
											<div className="view">
												<NavLink to={"/product/" + element.Id}>
													<img src={globalFileServer + 'icons/info.svg'} alt="" />
												</NavLink>
											</div>
											{this.isEmpty(buyedProduct) ?
												<div className="add-to-cart" onClick={this.addToCart.bind(this, element)}>
													<img src={globalFileServer + 'icons/cart_1.svg'} alt="" />
												</div>
											:
											<div className="add-to-cart green-button" onClick={()=> this.props.history.push('/cart')}>
											<img className="done" src={globalFileServer + 'icons/done_1.svg'} alt="" />
										</div>
										}
									</div>
									<div dir="rtl" className="mask-name">
										<div>
											<h4>{element.ProdName.length > 33 ? "..." + element.ProdName.substring(0, 30) : element.ProdName}</h4>
											{/*{element.ProdDescription.length > 33 ?
												<p dangerouslySetInnerHTML={{__html: (element.ProdDescription.substring(0, 30)+"...")}}></p>
												:
												<p dangerouslySetInnerHTML={{__html: element.ProdDescription}}></p>
											}*/}
										</div>
										<div>
											<ul className="sales-price">
												{element.DiscountType == 1 ?
													<li className="discount-price">{!this.isEmpty(userDiscountObj) ?
														<span>{parseFloat(element.ProdPrice - userDiscountObj[0].DiscountVal).toFixed('2') + " ₪"}</span> :
														<span>{parseFloat(element.ProdPrice - element.DiscountVal).toFixed('2') + " ₪"}</span>}</li>
												 :
												 	<li className="discount-price">{!this.isEmpty(userDiscountObj) ?
												 		<span>{parseFloat(element.ProdPrice - (element.ProdPrice * userDiscountObj[0].DiscountVal / 100)).toFixed('2') + " ₪"}</span> :
												 		<span>{parseFloat(element.ProdPrice - (element.ProdPrice * element.DiscountVal / 100)).toFixed('2') + " ₪"}</span>}
												 	</li>
												}
												<li className="base-price">{parseFloat(element.ProdPrice).toFixed('2') + " ₪"}</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div> : null}
			</section>
		)
	}
}
