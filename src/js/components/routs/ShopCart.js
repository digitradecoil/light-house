import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Adress from './shopCart/Adress';
import PayPopup from './PayPopup';
import SweetAlert from 'sweetalert2';
import moment from 'moment';
import OrderDetails from "./shoppingCart/OrderDetails";


let uagent = navigator.userAgent.toLowerCase();

export default class ShopCart extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			products: [],
			price: 0,
			neib: false,
			polygons: [],
			address: [],
			adressPopup: false,
			deliveryPrice: 0,
			deliveryTime: 0,
			deliveryOption: true,
			fullBasePrice: 0,
			fullDiscount: 0,
			tax: 1.17,
			taxVal: 0,
			message: "",
			paymentMethod: false,
			error: false,
			iphone: false,
			openShop: true,
      limitBytime:false,
			moment: moment(),
			minPrice: 10,
			toPayPopup: false,
			maxPayments: 12,
			termsAndConditions: false
		}
		this.signIn = this.signIn.bind(this);
		this.toPay = this.toPay.bind(this);
		this.error = this.error.bind(this);
		this.paymentMethod = this.paymentMethod.bind(this);
		this.postMessage = this.postMessage.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
		this.getAdmins = this.getAdmins.bind(this);
		this.toTranzilla = this.toTranzilla.bind(this);
		this.closePayPopup = this.closePayPopup.bind(this);
		this.close = this.close.bind(this);
		this.getPolygons = this.getPolygons.bind(this);
		this.pushAddress = this.pushAddress.bind(this);
		this.existShipping = this.existShipping.bind(this);
		this.checkDelivery = this.checkDelivery.bind(this);
		this.getItems = this.getItems.bind(this);
		this.sendOrder = this.sendOrder.bind(this);
		this.sendMail = this.sendMail.bind(this);
		this.sendMailClient = this.sendMailClient.bind(this);
    this.getUserInfo = this.getUserInfo.bind(this);

	}
	componentWillMount(){
		this.getPolygons();
		this.getItems();
		this.getOpenShop();
	  this.getUserInfo();
	}
	componentDidMount(){
		if (uagent.search("iphone") > -1)
		this.setState({iphone: true});
    const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAmSz5YciOiq-rPQ9Pjy3ntdfB60Swex_s&libraries=places,geometry&language=he-IL";
        script.async = true;
		script.defer = true;
        document.body.appendChild(script);
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	componentWillUpdate(nextProps, nextState) {

	}
	sendOrder(response){
		this.setState({toPayPopup: false});
		let address = this.state.address.filter(item => item.active);
		let userInfo = {
      user_id: localStorage.user_id,
      user_name: localStorage.user_name,
      phone: localStorage.phone,
      email: localStorage.email,
      bday:localStorage.bday,
      town: address.length ? address[0].town : '',
      streetName: address.length ? address[0].streetName : '',
      streetNumber: address.length ? address[0].streetNumber : '',
      houseNumber: address.length ? address[0].houseNumber : '',
      floor: address.length ? address[0].floor : '',
      entry: address.length ? address[0].entry : '',
      entryCode: address.length ? address[0].entryCode : '',
      price: this.props.state.price,
      deliveryPrice: this.state.deliveryPrice,
      fullPrice: (parseFloat(this.props.state.price) + parseFloat(this.state.deliveryPrice)).toFixed(2),
      ccno: response.ccno,
      expyear: response.expyear,
      expmonth: response.expmonth,
      comment: this.state.comment,
      paymentMethod: !this.state.paymentMethod ? 'cash' : null,
      presentName: address[0].name,
      presentSurName: address[0].surName,
      presentTel1: address[0].tel1,
      presentTel2: address[0].tel2,
      presentDate: address[0].date,
      presentMessage: address[0].message
		};
		// this.sendMail();
		// this.sendMailClient();
		let utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
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
			if(data.result == "success") {
				this.setHistory(data.id);
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
		}.bind(this, response)).fail(function() { console.log('sendOrder Error'); });
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
      let tmpData = JSON.parse(data.contents)
			this.setState({openShop: tmpData.Open == "1" ? 1 : 0,
    limitBytime: tmpData.Limit == "1" ? 1 : 0});
		}.bind(this)).fail(function() { console.log('error'); });
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
			UserId: localStorage.user_id,
			paramName: 'Address',
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
    if(localStorage.session_id && localStorage.user_id){
  		let val = {
  			sess_id: localStorage.session_id,
  			token: localStorage.token,
  			UserId: localStorage.user_id
  		}
  		$.ajax({
  			url: globalServer + 'user_view.php',
  			type: 'POST',
  			data: val
  		}).done(function(data) {
        debugger;
  			if (data.Address) {
  				this.setState({address: JSON.parse(data.Address)});
  			}
  		}.bind(this)).fail(function() {
  			// let products = localStorage.products;
  			// localStorage.clear();
  			// localStorage.setItem('products', products);
  			// location.reload();
  		});
    }
	}
	closePayPopup(){
		this.setState({toPayPopup: false});
	}
	close() {
		this.setState({adressPopup: false});
	}
	toTranzilla(){
		let val = {
			products: [
				{
					"product_name":"product",
					"product_quantity":1,
					"product_price":1
				},
				{
					"product_name":"product2",
					"product_quantity":1,
					"product_price":1
				},
				{
					"product_name":"product3",
					"product_quantity":1,
					"product_price":1
				},
				{
					"product_name":"product4",
					"product_quantity":1,
					"product_price":1
				},
				{
					"product_name":"product5",
					"product_quantity":1,
					"product_price":1
				}
			]
		}
		debugger;
		$.ajax({
			url: globalServer + 'tranzilla_api.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			debugger;
		}.bind(this)).fail(function() { this.fail(); });
	}
	error(){
		this.setState({error: true});
		SweetAlert({
			title: 'נא לבחור אמצעי התשלום',
			type: 'info',
			timer: 3000,
			showConfirmButton: false
		}).catch(SweetAlert.noop);
	}
	paymentMethod(e){
		this.setState({paymentMethod: e.target.value, error: false});
	}
	signIn(){
		$('#user_sign_in').trigger('click');
	}
	fail(){
		localStorage.session_id == "";
		localStorage.token == "";
		localStorage.user_id == "";
		localStorage.user_name == "";
		location.reload();
		console.log("error");
	}
	getAdmins(){
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id
		};
		$.ajax({
			url: globalServer + 'send_order_notification_to_admin.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.sendNotification(data);
		}.bind(this)).fail(function() { console.log('error'); });
	}
	sendNotification(data){
		let val = {
			from: 'LFA your shop',
			message: "ברגעים אלו התקבלה הזמנה חדשה  מ" + localStorage.user_name,
			img: 'http://lfa.com/src/img/banners/1.jpg',
			NavLink: 'history',
			player_ids: data
		}
		$.ajax({
			url: globalServer + 'send_push_notification.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	postMessage(){
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id,
			message: "ברגעים אלו התקבלה הזמנה חדשה מ" + localStorage.user_name,
			date: this.state.moment.format("DD/MM/YYYY, H:mm"),
			img: null,
			adminMessage: null,
			viewed: null,
			hidden: 1
		}
		$.ajax({
			url: globalServer + 'create_user_chat_message.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
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
sendMail(){
  let val = {
    siteName: globalSiteName,
    from: globalAdminMail,
    to: globalclientMail,
    siteUrl: globalSiteUrl + '/history'
  };
  $.ajax({
    url: 'https://statos.co/statos_web_mail/send_order_admin.php',
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
    siteName: globalSiteName,
    from: globalAdminMail,
    to: localStorage.email,
    products,
    name: localStorage.user_name,
    price: (parseFloat(this.props.state.price) + parseFloat(this.state.deliveryPrice)).toFixed(2) + " ₪"
  };
  $.ajax({
    url: 'https://statos.co/statos_web_mail/send_order_client.php',
    type: 'POST',
    data: val,
    dataType: "json",
  }).done(function(d) {}.bind(this)).fail(function() { console.log('error'); });
}
	toPay(){
		!localStorage.user_id ? $('#user_sign_in').click() : null;
		if (localStorage.user_id) {
			if (this.state.deliveryOption == true) {
				if (this.state.neib.length) {
					if (this.props.state.price > this.state.minPrice) {
						let existShipping = this.existShipping();
						if (existShipping.response || !this.state.limitBytime) {
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
				if (this.props.state.price > this.state.minPrice) {
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
	setHistory(orderId) {
		let val = {
			'Products': JSON.parse(localStorage.getItem("products")),
			'OrderId': orderId,
			'token': localStorage.token,
			'sess_id': localStorage.session_id
		};
		$.ajax({
			url: globalServer + 'save_history.php',
			type: 'POST',
			data: val,
		}).done(function(orderId, data) {
			if (data.result == "success") {
				localStorage.products = '[]';
				this.setState({products: [], message: ""});
				this.orderSuccess(orderId);
				$('#localStorage').trigger('click');
			} else {
				this.fail();
			}
		}.bind(this, orderId)).fail(function() { this.fail(); });
	}
	orderSuccess(id){
		SweetAlert({
			title: 'הזמנה נשלחה',
			text: 'תודה לך ' + localStorage.user_name + '. הזמנתך #100' + id + ' נשלחה',
			type: 'success',
			confirmButtonText: 'המשך',
		}).then(function() {
			this.props.history.push('/history');
		})
	}

	deleteProduct(index){
		let products = JSON.parse(localStorage.getItem("products"));
		let newProducts = products.filter((element, ind) => { return ind !== index });
		this.setState({products: newProducts});
		localStorage.products = JSON.stringify(newProducts);
		$('#localStorage').trigger('click');
		$('#updateProductsCartLocation').trigger('click');
	}


	isEmpty(obj) {
		for (let x in obj) { return false; }
		return true;
	}
	render(){
		const meta = {
			title: 'סל הקניות שלי',
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
			<div className="page-container shop-cart mobile-cart">
				{this.state.adressPopup ? <Adress {...this} /> : null}
				{this.state.toPayPopup ? <PayPopup data={this} /> : null}
        <h1 className="title">סל הקניות שלי</h1>
				<div className="wrapper desctop flex-container">
					<div className="col-lg-8 cart-table">
            <div className="cart-table-subcont">
              <div className="cart-product cart-title flex-container">
                <div className="col-lg-2 img"><p id="getProducts">&nbsp;</p></div>
                <div className="col-lg-3 name for-title"><div className="wrapp"><p>שם המוצר</p></div></div>
                <div className="col-lg-2 value for-title"><div className="wrapp"><p>נפח מיכל</p></div></div>
                <div className="col-lg-3 quantity for-title"><div className="wrapp"><p>כמות פריטים</p></div></div>
                <div className="col-lg-2 price for-title"><div className="wrapp"><p>מחיר</p></div></div>
                <div className="separator"></div>
              </div>
              { !this.isEmpty(this.props.state.productsInCart) ? this.props.state.productsInCart.map((element, index) => {
                let discount;
                if (element.product.DiscountType && element.product.DiscountVal) {
                  if (element.product.DiscountType == 1) {
                    discount = parseInt(element.product.DiscountVal) * parseInt(element.quantity);
                  }
                  if (element.product.DiscountType == 2) {
                    discount = ((parseInt(element.product.ProdPrice) * parseInt(element.quantity)) * parseInt(element.product.DiscountVal) / 100);
                  }
                  if (!element.product.DiscountType && !element.product.DiscountType) discount = 0;
                }
                return (
                  <div className="cart-product flex-container" key={index}>
                    <div className="delete-product" onClick={this.props.deleteProduct.bind(this, element.product.Id)}>
                      <img src={globalFileServer + 'icons/trash.svg'} alt="" />
                    </div>
                    <div className="col-lg-2 img">
                      <img onError={(e) => e.target.src = globalFileServer + 'logo.svg'} src={globalFileServer + 'products/' + element.product.CatalogNum + ".jpg"} alt="" />
                    </div>
                    <div className="col-lg-3 name">
                      <div className="wrapp">
                        <h3><NavLink to={"/product/" + element.product.Id}>{element.product.ProdName.length > 25 ? element.product.ProdName.substring(0, 25) + '...' : element.product.ProdName}</NavLink></h3>
                      </div>
                    </div>
                    <div className="col-lg-2 value">
                      <div className="wrapp">
                        <p>
                          <span>{element.product.ProdValue ? element.product.ProdValue + " " : null}</span>
                          <span>{element.product.ProdUnit ? element.product.ProdUnit : null}</span>
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-3 quant">
                      <div className="wrapp">
                        <div className="quantity">
                          <div className="quantity-wrapp">
                            <span onClick={this.props.updateQuantity.bind(this, element.product.Id,"plus")} className="decrease">
                              <img src={globalFileServer + 'icons/p.svg'} alt="" />
                            </span>
                            <p>{element.quantity}</p>
                            <span onClick={this.props.updateQuantity.bind(this, element.product.Id,"minus")} className={element.quantity > 1 ? "increase" : "increase disabled"}>
                              <img src={globalFileServer + 'icons/m.svg'} alt="" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 price">
                      <div className="wrapp">
                        <p><span>{parseFloat(element.product.ProdPrice * element.quantity).toFixed('2')}</span><span> ₪</span></p>
                        {discount ? <p><span>{parseFloat(discount).toFixed('2')}</span><span> ₪ -</span></p> : <p></p>}
                        {discount ? <p><span>{parseFloat(element.product.ProdPrice * element.quantity - discount).toFixed('2')}</span><span> ₪</span></p> : <p></p>}
                      </div>
                    </div>
                    <div className="separator"></div>
                  </div>
                )
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
                  {localStorage.user_id &&  localStorage.session_id?
                    <div className="select-shipping-cont">
                      <p onClick={(e) => {this.setState({adressPopup: true}), e.target.classList = 'select-shipping'}}
                      className="select-shipping">בחר כתובת</p>
                    </div>
                  :
                  <div className="select-shipping-cont">
                    <p onClick={(e) => {$('#user_sign_in').click(), e.target.classList = 'select-shipping'}} className="select-shipping">בחר כתובת</p>
                  </div>
                  }
                </div>
              : null}
              <h2>הערות להזמנה</h2>
              <div className={!this.state.comment ? 'comments empty' : 'comments'}>
                <textarea
                  placeholder=""
                  value={this.state.comment ? this.state.comment : ""}
                  onChange={(e) => this.setState({comment: e.target.value})}
                />
              </div>
              <h2>סיכום</h2>
              <ul className="first-price">
                <li>
                  <span className="title">מחיר:</span>
                  <span className="price">{this.props.state.price}</span>
                </li>
                <li>
                  <span className="title">דמי משלוח:</span>
                  <span className="price">{this.state.deliveryPrice}</span>
                </li>
                {/* {this.state.neib.length ?
                  <li className="time-d">
                    <span className="title">זמן אספקה:</span>
                    <span className="time">{this.state.neib[0].Delivery}</span>
                  </li>
                : null} */}
              </ul>
              <h4>
                <span className="title">מחיר לתשלום:</span>
                <span className="price">{(parseFloat(this.props.state.price) + parseFloat(this.state.deliveryPrice)).toFixed(2)}</span>
              </h4>
              {/* <div className="toggle-payment">
                <ul className="toggle-shipping">
                  <li onClick={() => this.setState({paymentMethod: true})} className={this.state.paymentMethod ? "active" : null}>
                אשראי
                  </li>
                  <li onClick={() => this.setState({paymentMethod: false})} className={!this.state.paymentMethod ? "active" : null}>
                מזומן
                  </li>
                  <div className={this.state.paymentMethod ? "fly-panel right" : "fly-panel left"}></div>
                </ul>
              </div> */}
              <div className="terms-and-conditions">
                <div className="checkboxes-and-radios">
                  <input type="checkbox"
                    onChange={(e)=> this.setState({termsAndConditions: e.target.checked})}
                    name="checkbox-cats" checked={this.state.termsAndConditions}
                  id="checkbox-3" value="3" />
                  <label htmlFor="checkbox-3"></label>
                </div>
                <span>אנא קרא והסכם <a href={globalFileServer + 'tni-shimush.pdf'} target="_blank">לתנאי השימוש</a></span>
              </div>
              <button onClick={this.toPay} className="to-pay">תשלום</button>
              <img src={globalFileServer +'icons/vizas.svg'} />
            </div>
          </div>
				</div>
				{/* <Sales /> */}
			</div>
		)
	}
}
