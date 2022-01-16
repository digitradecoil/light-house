import React, { Component } from 'react';
import { NavLink } from "react-router-dom";


let products = [];

export default class WishList extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	componentDidMount(){
	}

	addToCart(index){
		// let wishList = JSON.parse(localStorage.getItem("wishList"));
		// let pushToCart = wishList.filter((element, ind) => { return ind == index });
		// localStorage.products ?	products = JSON.parse(localStorage.getItem("products")) : null;
		// products.push(pushToCart[0]);
		// localStorage.setItem('products', JSON.stringify(products));
		// this.setState({products});
		// $('#addToCart').trigger('click');
	}
	deleteProduct(index){
		let wishList = this.props.state.wishList;
		let newProducts = wishList.filter((element, ind) => { return ind !== index });
    this.props.updateWishlist(newProducts);

	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}
	render(){
		const meta = {
			title: 'המועדפים שלי',
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
			<div className="page-container wish-list">
				<div className="wrapper">
					<h1 className="title">המועדפים שלי</h1>
					<div className="flex-container">
						{!this.isEmpty(this.props.state.wishList) ? this.props.state.wishList.map((element, index) => {
              let buyedProduct = !this.isEmpty(this.props.state.productsInCart) ? this.props.state.productsInCart.filter((elem, ind) => { return elem.product.Id == element.Id }) : null;
							let discount;
							if (element.DiscountType && element.DiscountVal) {
								if (element.DiscountType == 1) {
									discount = parseInt(element.DiscountVal) * parseInt(element.quantity);
								}
								if (element.DiscountType == 2) {
									discount = ((parseInt(element.ProdPrice) * parseInt(element.quantity)) * parseInt(element.DiscountVal) / 100);
								}
								if (!element.DiscountType && !element.DiscountType) discount = 0;
							}
							return (
								<div className="col-lg-3" key={index}>
									<div className="product-wrapper">
										<div className="wrapp">
											<div className="delete-product" onClick={this.deleteProduct.bind(this, index)}>
												<img src={globalFileServer + 'icons/trash.svg'} alt="" />
											</div>
											<div className="img">
												{element.CatalogNum ?
													<img onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
												:
												<img src={globalFileServer + 'products/product.jpg'} alt="" />
												}
											</div>
											<NavLink className="product-NavLink" to={"/product/" + element.Id}></NavLink>
											{/* <div className="mask-details">
												<div className="view">
													<NavLink to={"/product/" + element.Id}>
                        <img src={globalFileServer + 'icons/info_1.svg'} alt="" />
													</NavLink>
												</div>
												{this.isEmpty(buyedProduct) ?
													<div className="add-to-cart" onClick={this.addToCart.bind(this, index)}>
                        <img src={globalFileServer + 'icons/cart.svg'} alt="" />
													</div>
												:
												<div className="add-to-cart" onClick={()=> this.props.history.push('/cart')}>
													<img className="done" src={globalFileServer + 'icons/done.svg'} alt="" />
												</div>
                        }
                      </div> */}
                      <div className="mask-name">
                        <h4>{element.ProdName.length > 25 ? element.ProdName.substring(0, 25) + '...' : element.ProdName}</h4>
                        {/* <div className="other">
                          {element.ProdValue && element.ProdUnit ?
                            <p>{element.ProdValue + " " + element.ProdUnit}</p>
                          : null}
                          </div>
                          <div className="price">
                          {discount ?
                            <div>
                          <p className="old-price">
                          <span>{parseFloat(element.ProdPrice * element.quantity).toFixed('2') }</span>
                          <span> ₪</span>
                          </p>
                            </div>
                          :
													<p>
														<span>{parseFloat(element.ProdPrice * element.quantity).toFixed('2') }</span>
														<span> ₪</span>
													</p>
                          }
                        </div> */}
										</div>
									</div>
								</div>
							</div>
						)}) : null}
					</div>
				</div>
			</div>
		)
	}
}
