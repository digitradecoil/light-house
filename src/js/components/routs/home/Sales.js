import React, { Component } from 'react';
import Slider from 'react-slick';
import { NavLink } from "react-router-dom";

let settings = [];
if (window.innerWidth < 600) {
	settings = {
		dots: false,
		autoplay: true,
		infinite: true,
		speed: 500,
		autoplaySpeed: 4000,
		slidesToShow: 1,
		slidesToScroll: 1,
	};
} else {
	settings = {
		dots: true,
		autoplay: false,
		infinite: true,
		speed: 1000,
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
let products = [];
let userDiscountObj = [];
export default class Sales extends Component {
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
		return (
			<section id="sales" className="sales">
				{this.state.sales.length ?
					<div><h1 id="updateProductsCartLocation" onClick={this.updateProductsCartLocation} className="title">מוצרים מומלצים</h1>
						<Slider {...settings}>
							{this.state.sales.map((element, index) => {
								let buyedProduct = !this.isEmpty(this.state.productsInCart) ? this.state.productsInCart.filter((elem, ind) => { return elem.product.Id == element.Id }) : null;
								if (!this.isEmpty(this.state.userDiscount)) {
									userDiscountObj = this.state.userDiscount.filter((elem) => { return elem.ProdId == element.Id});
								}
								return(
									<div key={index}>
										<div className="wrapp">
											<div className="img">
												{localStorage.role == "super_user" ?
													<img
														onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'}
														src={globalFileServer + 'products/' + element.CatalogNum + ".jpg?" + new Date().toLocaleDateString().split("/").join("")}
             />
												:
												<img
													onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'}
													src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"}
            />
												}
											</div>
											{/* <div className="discount">
												{!this.isEmpty(userDiscountObj) && userDiscountObj[0].DiscountVal > 0 || element.DiscountVal > 0 ?
													<div>
                        <div>{element.DiscountType == 1 ? " ₪" : null}</div>
                        <div>{!this.isEmpty(userDiscountObj) ? <p>{userDiscountObj[0].DiscountVal}</p> : <p>{element.DiscountVal}</p>}</div>
                        <div>{element.DiscountType == 2 ? "%" : null}</div>
													</div>
												:
												<img src={globalFileServer + 'icons/sale.svg'} alt="" />
												}
											</div> */}
											<NavLink className="product-link" to={"/product/" + element.Id}></NavLink>
											{/* <div className="mask-details">
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
                      </div> */}
                      <div className="mask-name">
                        <div>
                          <h4>{element.ProdName.length > 33 ? "..." + element.ProdName.substring(0, 27) : element.ProdName}</h4>
                        </div>
                        <div>
                          <ul className="sales-price">
                            {/* <li className="base-price">{parseFloat(element.ProdPrice).toFixed('2') + " ₪"}</li> */}
                            {element.DiscountType == 1 ?
                              <li className="discount-price">{!this.isEmpty(userDiscountObj) ?
                                <span>{parseFloat(element.ProdPrice - userDiscountObj[0].DiscountVal).toFixed('2') + " ₪"}</span> :
                                <span>{parseFloat(element.ProdPrice - element.DiscountVal).toFixed('2') + " ₪"}</span>}
                              </li>
                            :
                            <li className="discount-price">{!this.isEmpty(userDiscountObj) ?
															<span>{parseFloat(element.ProdPrice - (element.ProdPrice * userDiscountObj[0].DiscountVal / 100)).toFixed('2') + " ₪"}</span> :
															<span>{parseFloat(element.ProdPrice - (element.ProdPrice * element.DiscountVal / 100)).toFixed('2') + " ₪"}</span>}
                            </li>
                            }
												</ul>
											</div>
										</div>
									</div>
								</div>
							)
						})}
					</Slider>
				</div> : null}
			</section>
		)
	}
}
