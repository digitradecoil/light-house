import React, { Component } from "react";
import ReactDOM from "react-dom";
import SweetAlert from 'sweetalert2';
import Adress from './shopCart/Adress';
import PayPopup from './shopCart/PayPopup';
import Sales from './home/Sales';
import OrderDetails from "./shoppingCart/OrderDetails";

import './shopCart/ShopCart.scss';
import './shopCart/Cart.scss';

export default class Cart extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			price: 0,
			animate: false,
			adressPopup: false,
			toPayPopup: false,
			maxPayments: 12,
			polygons: [],
			address: [],
			neib: false,
			deliveryPrice: 0,
			deliveryTime: 0,
			deliveryOption: true,
			minPrice: 10,
			openShop: true,
			comment: false,
			paymentMethod: true,
			termsAndConditions: false
		}
		this.getIngredients = this.getIngredients.bind(this);
		this.getOptions = this.getOptions.bind(this);
		this.getPrice = this.getPrice.bind(this);
		this.close = this.close.bind(this);
		this.closePayPopup = this.closePayPopup.bind(this);
		this.getUserInfo = this.getUserInfo.bind(this);
		this.pushAddress = this.pushAddress.bind(this);
		this.checkDelivery = this.checkDelivery.bind(this);
		this.getPolygons = this.getPolygons.bind(this);
		this.toPay = this.toPay.bind(this);
		this.sendOrder = this.sendOrder.bind(this);
		this.getItems = this.getItems.bind(this);
		this.existShipping = this.existShipping.bind(this);
		this.sendMail = this.sendMail.bind(this);
		this.sendMailClient = this.sendMailClient.bind(this);
	}
	componentWillMount(){
		localStorage.userId ? this.getUserInfo() : null;
		this.getPolygons();
		this.getItems();
		this.getOpenShop();
	}
	componentDidMount(){
		this.getPrice(this.props.state.productsInCart);
		setTimeout(() => {window.scrollTo(0, 0)}, 100);
		const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAmSz5YciOiq-rPQ9Pjy3ntdfB60Swex_s&libraries=places,geometry&language=he-IL";
        script.async = true;
		script.defer = true;
        document.body.appendChild(script);
	}
	componentWillUnmount(){}
	sendMail(){
		let val = {
			siteName: 'Pizzarini',
			from: 'statosbiz@statos.co',
			to: 'pizzarini.karmiel@gmail.com',
		};
		$.ajax({
			url: 'https://statos.co/statos_web_mail/send_mail_pizzarini.php',
			type: 'POST',
			data: val,
			dataType: "json",
		}).done(function(d) {}.bind(this)).fail(function() { console.log('error'); });
	}
	sendMailClient(){
		let products = [];
		this.props.state.productsInCart.map((item) => {
			if (!item.ParentId) {
				let product = {
					Title: item.Title,
					Quantity: item.Quantity
				}
				products.push(product);
			}
		});
		let val = {
			siteName: 'Pizzarini',
			from: 'statosbiz@statos.co',
			to: localStorage.email,
			products,
			name: localStorage.user_name,
			price: (this.state.price + this.state.deliveryPrice).toFixed(2) + " ₪"
		};
		$.ajax({
			url: 'https://statos.co/statos_web_mail/send_mail_pizzarini_client.php',
			type: 'POST',
			data: val,
			dataType: "json",
		}).done(function(d) {}.bind(this)).fail(function() { console.log('error'); });
	}
	getItems() {
		$.ajax({
			url: globalServer + 'get-time.php',
			type: 'POST'
		}).done(function(data) {
			this.setState({items: data});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getOpenShop() {
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'get-open_shop.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			this.setState({openShop: data.Open == "1" ? 1 : 0});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	existShipping(){
		let now = new Date();
		let days = [
			'א',
			'ב',
			'ג',
			'ד',
			'ה',
			'ו',
			'ש'
		];
		let day = days[ now.getDay() ];
		let items = this.state.items.filter(item => item.Day == day);

		let today = new Date();
		let tempDateFrom = new Date();
		let tempDateTo = new Date();

		let compireDateFrom = tempDateFrom.setHours(items[0].From.split(':')[0], items[0].From.split(':')[1], "00");
		let compireDateTo = tempDateTo.setHours(items[0].To.split(':')[0], items[0].To.split(':')[1], "00");

		let tempFrom = today > tempDateFrom;
		let tempTo = today < tempDateTo;
		let data = {
			response: false,
			date: items[0]
		}
		tempFrom && tempTo ? data.response = true : data.response = false;

		return data;

	}
	sendOrder(response){
		this.setState({toPayPopup: false});
		let address = this.state.address.filter(item => item.active);
		let userInfo = {
			user_name: localStorage.user_name,
			phone: localStorage.phone,
			email: localStorage.email,
			town: address.length ? address[0].town : '',
			streetName: address.length ? address[0].streetName : '',
			streetNumber: address.length ? address[0].streetNumber : '',
			houseNumber: address.length ? address[0].houseNumber : '',
			floor: address.length ? address[0].floor : '',
			entry: address.length ? address[0].entry : '',
			price: this.state.price,
			deliveryPrice: this.state.deliveryPrice,
			fullPrice: this.state.price + this.state.deliveryPrice,
			ccno: response.ccno,
			expyear: response.expyear,
			expmonth: response.expmonth,
			comment: this.state.comment,
			paymentMethod: !this.state.paymentMethod ? 'cash' : null
		};
		this.sendMail();
		this.sendMailClient();
		let val = {
			sess_id: localStorage.session_id,
			token: localStorage.token,
			products: JSON.stringify(this.props.state.productsInCart),
			userInfo: JSON.stringify(userInfo)
		};
		$.ajax({
			url: globalServer + 'history_add.php',
			type: 'POST',
			data: val
		}).done(function(response, data) {
			if (!response) {
				SweetAlert({
					title: 'הזמנה נקלטה בהצלחה.',
					type: 'success',
					showConfirmButton: true,
					confirmButtonText: 'אישור'
				}).then(function () {
					this.props.clearCart();
					this.props.history.push('/');
				}.bind(this)).catch(SweetAlert.noop);
			}
			if (response) {
				SweetAlert({
					title: 'התשלום בוצע בהצלחה',
					type: 'success',
					confirmButtonText: 'אישור'
				}).then(function () {
					this.props.clearCart();
					this.props.history.push('/');
				}.bind(this)).catch(SweetAlert.noop);
			}
			if(data.result == "success" || !response) {
				this.setState({
					price: 0,
					animate: false,
					polygons: [],
					address: [],
					neib: false,
					deliveryPrice: 0,
					deliveryTime: 0,
					deliveryOption: true
				});
			}
		}.bind(this, response)).fail(function() { console.log('error'); });
	}
	toPay(){
		!localStorage.userId ? $('#signIn').click() : null;
		if (localStorage.userId) {
			if (this.state.deliveryOption == true) {
				if (this.state.neib.length) {
					if (this.state.price > this.state.minPrice) {
						let existShipping = this.existShipping();
						if (existShipping.response) {
							if (this.state.openShop) {
								if (this.state.termsAndConditions) {
									this.state.paymentMethod ? this.setState({toPayPopup:true}) : this.sendOrder(false);
								} else {
									SweetAlert({
										title: 'אופס',
										text: 'אנא קרא והסכם לתנאי השימוש',
										type: 'error',
										showConfirmButton: false,
										timer: 3000
									}).catch(SweetAlert.noop);
								}
							} else {
								SweetAlert({
									title: 'אופס',
									text: 'מערכת ההזמנות אינה פעילה כרגע. אנא נסו מאוחר יותר.',
									type: 'error',
									showConfirmButton: false,
									timer: 4000
								}).catch(SweetAlert.noop);
							}
						} else {
							SweetAlert({
								title: 'אופס',
								text: 'ביום '  + existShipping.date.Day + ' אנו עושים משלוחים מ  '  + existShipping.date.From +  ' עד  ' + existShipping.date.To,
								type: 'error',
								showConfirmButton: false,
								timer: 4000
							}).catch(SweetAlert.noop);
						}
					} else {
						SweetAlert({
							title: 'אופס',
							text: 'מינימום הזמנה: ' + this.state.minPrice + ' ₪ ',
							type: 'error',
							showConfirmButton: false,
							timer: 4000
						}).catch(SweetAlert.noop);
					}
				} else {
					SweetAlert({
						title: 'אופס',
						text: 'אנא בחר כתובת',
						type: 'error',
						showConfirmButton: false,
						timer: 3000
					}).catch(SweetAlert.noop);
				}
			}
			if (this.state.deliveryOption == false) {
				if (this.state.price > this.state.minPrice) {
					let existShipping = this.existShipping();
					if (existShipping.response) {
						if (this.state.openShop) {
							if (this.state.termsAndConditions) {
								this.state.paymentMethod ? this.setState({toPayPopup:true}) : this.sendOrder(false);
							} else {
								SweetAlert({
									title: 'אופס',
									text: 'אנא קרא והסכם לתנאי השימוש',
									type: 'error',
									showConfirmButton: false,
									timer: 3000
								}).catch(SweetAlert.noop);
							}
						} else {
							SweetAlert({
								title: 'אופס',
								text: 'מערכת ההזמנות אינה פעילה כרגע. אנא נסו מאוחר יותר.',
								type: 'error',
								showConfirmButton: false,
								timer: 4000
							}).catch(SweetAlert.noop);
						}
					} else {
						SweetAlert({
							title: 'אופס',
							text: 'ב יום '  + existShipping.date.Day + ' אנו עושים משלוחים מ  '  + existShipping.date.From +  ' עד  ' + existShipping.date.To,
							type: 'error',
							showConfirmButton: false,
							timer: 5000
						}).catch(SweetAlert.noop);
					}
				} else {
					SweetAlert({
						title: 'אופס',
						text: 'מינימום הזמנה: ' + this.state.minPrice + ' ₪ ',
						type: 'error',
						showConfirmButton: false,
						timer: 4000
					}).catch(SweetAlert.noop);
				}
			}

		}
	}
	getPolygons(){
		$.ajax({
			url: globalServer + 'polygon_view.php',
			type: 'POST'
		}).done(function(data) {
			let polygons = data.Polygons;
			polygons.map((item) => {
				item.Coord = JSON.parse(item.Coord)
			});
			this.setState({polygons});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	setActiveAddress(element){
		let address = this.state.address;
		address.map(item => item.active = false);
		address.find(x=> x.id == element.id).active = true;
		this.setState({address});
		this.checkDelivery(element);
	}
	checkDelivery(element){
		let neib = [];
		let exist = false;
		let coord = new google.maps.LatLng(element.lat, element.lng);
		this.state.polygons.map((item) => {
			let opts = {
				paths: item.Coord,
				strokeColor: '#ff0000',
				strokeOpacity: 0.8,
				strokeWeight: 3,
				fillColor: '#ff0000',
				fillOpacity: 0.2
			}
			let newPolygon = new google.maps.Polygon(opts);
			exist = google.maps.geometry.poly.containsLocation(coord, newPolygon);
			exist ? neib.push(item) : null;
		});
		if (neib.length) {
			this.setState({
				neib,
				deliveryPrice: parseFloat(neib[0].Price),
				deliveryTime: parseFloat(neib[0].Delivery)
			});
		} else {
			SweetAlert({
				title: 'אופס',
				text: 'איננו מבצעים משלוחים לאיזור זה. עמכם הסליחה.',
				type: 'error',
				showConfirmButton: false,
				timer: 4000
			}).catch(SweetAlert.noop);
		}
	}
	removeAddress(element){
		let address = this.state.address.filter(item => item.id != element.id);
		address.map(item => item.active = false);
		let val = {
			sess_id: localStorage.session_id,
			token: localStorage.token,
			UserId: localStorage.userId,
			paramName: 'Address1',
			val: JSON.stringify(address)
		};
		$.ajax({
			url: globalServer + 'user_edit.php',
			type: 'POST',
			data: val
		}).done(function(address, data) {
			this.setState({address});
		}.bind(this, address)).fail(function() { console.log('error'); });
	}
	pushAddress(address){
		this.setState({address, adressPopup: false});
	}
	getUserInfo(){
		let val = {
			sess_id: localStorage.session_id,
			token: localStorage.token,
			UserId: localStorage.userId
		}
		$.ajax({
			url: globalServer + 'user_view.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			if (data.Address1) {
				this.setState({address: JSON.parse(data.Address1)});
			}
		}.bind(this)).fail(function() {
			let products = localStorage.products;
			localStorage.clear();
			localStorage.setItem('products', products);
			location.reload();
		});
	}
	close() {
		this.setState({adressPopup: false});
	}
	closePayPopup(){
		this.setState({toPayPopup: false});
	}
	deleteProduct(element){
		this.setState({animate: element.CartId});
		let productsInCart = this.props.state.productsInCart.filter(item => item.CartId != element.CartId);
		setTimeout(() => {
			this.props.deleteProduct(element);
		}, 1000);
		this.getPrice(productsInCart);
	}
	editProducts(element){
		let products = this.props.state.productsInCart.filter(product => product.CartId == element.CartId);
		localStorage.setItem('productsToEdit', JSON.stringify(products));
		element.ProductId ? this.props.history.push('/product/' + element.ProductId) : this.props.history.push('/product/' + element.Id);
	}
	getPrice(products){
		let price = 0;
		products.map(product => product.Price ? price += parseFloat(product.Price) * product.Quantity : null);
		this.setState({price});
	}
	getIngredients(ids) {
		let ingredients = [];
		ids ? ingredients = this.props.state.ingredients.filter(ingredient => ids.split(',').includes(ingredient.Id + '')) : null;
		return ingredients;
	}
	getOptions(ids) {
		let options = [];
		ids ? options = this.props.state.options.filter(option => ids.split(',').includes(option.Id + '')) : null;
		return options;
	}
	increaseQuantity(id){
		let productsInCart = this.props.state.productsInCart;
		let uProduct = productsInCart.filter(product => product.CartId == id);
		uProduct = uProduct.filter(product => !product.ParentId);
		uProduct[0].Quantity += 1;
		this.props.updateProducts(productsInCart);
		this.getPrice(productsInCart);
	}
	decreaseQuantity(id){
		let productsInCart = this.props.state.productsInCart;
		let uProduct = productsInCart.filter(product => product.CartId == id);
		uProduct = uProduct.filter(product => !product.ParentId);
		uProduct[0].Quantity -= 1;
		this.props.updateProducts(productsInCart);
		this.getPrice(productsInCart);
	}
	render(){
		return (
			<div className="page shop-cart">
				{this.state.adressPopup ? ReactDOM.createPortal(
					<Adress {...this}/>,
					document.getElementById('modal-root')
				) : null}
				{this.state.toPayPopup ? ReactDOM.createPortal(
					<PayPopup {...this} data={this} />,
					document.getElementById('modal-root')
				) : null}
				<div className="container">
					<h1 className="title">סל קניות</h1>
					<div className="wrapper flex-container">
						<div className="col-lg-8 products">
							<div className="wrapp">
								{this.props.state.productsInCart.length && this.props.state.ingredients.length && this.props.state.options.length ? this.props.state.productsInCart.map((element, index) => {

									let children = this.props.state.productsInCart.filter(product => product.ParentId);

									if (!element.ParentId) {

										let subproducts = children.filter(product => product.CartId == element.CartId);
										let defaultIngridients = this.getIngredients(element.DefaultIngredients);
										let userOptions = this.getOptions(element.UserOptions);

										return (
											<div key={index} className={this.state.animate == element.CartId ? "magictime tinRightOut item" : "magictime item"}>
												<div className="flex-container">
													<div className="col-lg-2 img">
														<div className="wr">
															<img src={globalFileServer + 'products/' + element.Img} />
														</div>
													</div>
													<div className="col-lg-3 title">
														<div className="wr">
															<p>{element.Title}</p>
															{element.ProductType && element.ProductType.Title ? <p>{element.ProductType.Title}</p> : null}
														</div>
													</div>
													<div className="col-lg-3 quantity">
														<div className="wr">
															<div className="quantity-wrapp">
																<span onClick={element.Quantity > 1 ? this.decreaseQuantity.bind(this, element.CartId) : null} className="q increase">
																	<img src={globalFileServer + 'icons/m.svg'} alt="" />
																</span>
																<div className="view">
																	<span>{element.Quantity}</span>
																</div>
																<span onClick={this.increaseQuantity.bind(this, element.CartId)} className="q decrease">
																	<img src={globalFileServer + 'icons/p.svg'} alt="" />
																</span>
															</div>
														</div>
													</div>
													<div className="col-lg-2 price">
														<div className="wr">
															<p>{element.Price}</p>
														</div>
													</div>
													<div className="col-lg-2 actions">
														<div className="wr">
															<ul>
																<li onClick={this.editProducts.bind(this, element)}>
																	<img src={globalFileServer + 'icons/edit.svg'} alt="" />
																</li>
																<li onClick={this.deleteProduct.bind(this, element)}>
																	<img src={globalFileServer + 'icons/delete.svg'} alt="" />
																</li>
															</ul>
														</div>
													</div>
												</div>
												{subproducts.length ?
													<div className="sub-products">
														<h3 className="name">{element.SubTitle}</h3>
														<div className={!defaultIngridients.length && !element.UserIngredients && !userOptions.length ? "adds x flex-container" : "adds flex-container"}>
															{defaultIngridients.length ?
																<div className="col-lg-4">
																	<ul className="ingr">
																		<li><span className="title">מרכיבים</span></li>
																		{defaultIngridients.map((elem, ind) => {
																			return (
																				<li key={ind}>{elem.Title}</li>
																			);
																		})}
																	</ul>
																</div>: null}
															{element.UserIngredients && element.UserIngredients.length ?
																<div className="col-lg-4">
																	<ul className="ingr middle">
																		<li><span className="title">תוספות</span></li>
																		{element.UserIngredients.map((elem, ind) => {
																			return (
																				<li className={elem.Side ? elem.Side : null} key={ind}>
																					<span className="name">{elem.Title}</span>
																					<span className="price">{elem.Price ? elem.Price + ' ₪' : 'חינם'}</span>
																				</li>
																			);
																		})}
																	</ul>
																</div>: null}
															{userOptions.length ?
																<div className="col-lg-4">
																	<ul className="opts">
																		<li><span className="title">אופציות</span></li>
																		{userOptions.map((elem, ind) => {
																			return (
																				<li key={ind}>
																					<span className="name">{elem.Title}</span>
																					<span className="price">{elem.Price ? elem.Price + ' ₪' : 'חינם'}</span>
																				</li>
																			);
																		})}
																	</ul>
																</div> : null}
														</div>
														{subproducts.map((subprod, i) => {
															let dIngridients = this.getIngredients(subprod.DefaultIngredients);
															let uOptions = this.getOptions(subprod.UserOptions);
															return (
																<div className="sub-product" key={i} >
																	<h3 className="name">{subprod.Title}</h3>
																	<div className="adds flex-container">
																		{dIngridients.length ?
																			<div className="col-lg-4">
																				<ul className="ingr">
																					<li><span className="title">מרכיבים</span></li>
																					{dIngridients.map((elem, ind) => {
																						return (
																							<li key={ind}>{elem.Title}</li>
																						);
																					})}
																				</ul>
																			</div> : null}
																		{subprod.UserIngredients && subprod.UserIngredients.length ?
																			<div className="col-lg-4">
																				<ul className="ingr middle">
																					<li><span className="title">תוספות</span></li>
																					{subprod.UserIngredients.map((elem, ind) => {
																						return (
																							<li className={elem.Side ? elem.Side : null} key={ind}>
																								<span className="name">{elem.Title}</span>
																								<span className="price">{elem.Price ? elem.Price + ' ₪' : 'חינם'}</span>
																							</li>
																						);
																					})}
																				</ul>
																			</div> : null}
																		{uOptions.length ?
																			<div className="col-lg-4">
																				<ul className="opts">
																					<li><span className="title">אופציות</span></li>
																					{uOptions.map((elem, ind) => {
																						return (
																							<li key={ind}>
																								<span className="name">{elem.Title}</span>
																								<span className="price">{elem.Price ? elem.Price + ' ₪' : 'חינם'}</span>
																							</li>
																						);
																					})}
																				</ul>
																			</div> : null}
																	</div>
																</div>
															);
														})}
													</div>: null}
												{!subproducts.length ?
													<div className={!defaultIngridients.length && !element.UserIngredients && !userOptions.length ? "adds x flex-container" : "adds flex-container"}>
														{defaultIngridients.length ?
															<div className="col-lg-4">
																<ul className="ingr">
																	<li><span className="title">מרכיבים</span></li>
																	{defaultIngridients.map((elem, ind) => {
																		return (
																			<li key={ind}>{elem.Title}</li>
																		);
																	})}
																</ul>
															</div> : null}
														{element.UserIngredients && element.UserIngredients.length ?
															<div className="col-lg-4">
																<ul className="ingr middle">
																	<li><span className="title">תוספות</span></li>
																	{element.UserIngredients.map((elem, ind) => {
																		return (
																			<li className={elem.Side ? elem.Side : null} key={ind}>
																				<span className="name">{elem.Title}</span>
																				<span className="price">{elem.Price ? elem.Price + ' ₪' : 'חינם'}</span>
																			</li>
																		);
																	})}
																</ul>
															</div> : null}
														{userOptions.length ?
															<div className="col-lg-4">
																<ul className="opts">
																	<li><span className="title">אופציות</span></li>
																	{userOptions.map((elem, ind) => {
																		return (
																			<li key={ind}>
																				<span className="name">{elem.Title}</span>
																				<span className="price">{elem.Price ? elem.Price + ' ₪' : 'חינם'}</span>
																			</li>
																		);
																	})}
																</ul>
															</div> : null}
													</div>
												: null}
											</div>
										)};
								}) : null}
							</div>
						</div>

						{/* Payment Component */}

						<div className="col-lg-4 info">
							<div className="wrapp">
								<ul className="toggle-shipping">
									<li onClick={() => this.setState({deliveryOption: true})} className={this.state.deliveryOption ? "active" : null}>
										משלוח
									</li>
									<li onClick={() => this.setState({deliveryOption: false, neib: false, deliveryPrice: 0, deliveryTime: 0})} className={!this.state.deliveryOption ? "active" : null}>
										איסוף עצמי
									</li>
									<div className={this.state.deliveryOption ? "fly-panel right" : "fly-panel left"}></div>
								</ul>
								{this.state.deliveryOption ?
									<div>
										<ul className="shipping">
											{this.state.address.length ? this.state.address.map((item, index) => {
												return(
													<li key={index}>
														<span onClick={this.setActiveAddress.bind(this, item)} className={item.active ? 'title active' : 'title'}>
															{item.streetName + ' ' + item.streetNumber + ', ' + item.town}
														</span>
														<span className="delete" onClick={this.removeAddress.bind(this, item)}>
															<img src={globalFileServer +'icons/delete.svg'} />
														</span>
													</li>
												)
											}) : null}
										</ul>
										{localStorage.userId ?
											<p onClick={(e) => {this.setState({adressPopup: true}), e.target.classList = 'select-shipping'}} className="select-shipping">בחר כתובת</p>
										:
										<p onClick={(e) => {$('#signIn').click(), e.target.classList = 'select-shipping'}} className="select-shipping">בחר כתובת</p>
										}
									</div>
								: null}
								<h2>הערות למשלוח</h2>
								<div className={!this.state.comment ? 'comments empty' : 'comments'}>
									<textarea
										placeholder=""
										onChange={(e) => this.setState({comment: e.target.value})}
									>
										{this.state.comment ? this.state.comment : ""}
									</textarea>
								</div>
								<h2>סיכום</h2>
								<ul className="first-price">
									<li>
										<span className="title">מחיר:</span>
										<span className="price">{this.state.price.toFixed(2)}</span>
									</li>
									<li>
										<span className="title">דמי משלוח:</span>
										<span className="price">{this.state.deliveryPrice}</span>
									</li>
									{this.state.neib.length ?
										<li className="time-d">
											<span className="title">זמן אספקה:</span>
											<span className="time">{this.state.neib[0].Delivery}</span>
										</li>
									: null}
								</ul>
								<h4>
									<span className="title">מחיר לתשלום:</span>
									<span className="price">{(this.state.price + this.state.deliveryPrice).toFixed(2)}</span>
								</h4>
								<div className="toggle-payment">
									<ul className="toggle-shipping">
										<li onClick={() => this.setState({paymentMethod: true})} className={this.state.paymentMethod ? "active" : null}>
											אשראי
										</li>
										<li onClick={() => this.setState({paymentMethod: false})} className={!this.state.paymentMethod ? "active" : null}>
											מזומן
										</li>
										<div className={this.state.paymentMethod ? "fly-panel right" : "fly-panel left"}></div>
									</ul>
								</div>
								<div className="terms-and-conditions">
									<div className="checkboxes-and-radios">
										<input type="checkbox"
											onChange={(e)=> this.setState({termsAndConditions: e.target.checked})}
											name="checkbox-cats" checked={this.state.termsAndConditions}
										id="checkbox-3" value="3" />
										<label htmlFor="checkbox-3"></label>
									</div>
									<span>אנא קרא והסכם <a href={globalFileServer + 'tni-shimush-pizzarini.pdf'} target="_blank">לתנאי השימוש</a></span>
								</div>
								<button onClick={this.toPay} className="to-pay">תשלום</button>
								<img src={globalFileServer +'icons/vizas.svg'} />
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
