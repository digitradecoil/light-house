import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import LinkEditor from '../tools/LinkEditor';
import Parallax from './home/Parallax';
import CatTitleEditor from '../tools/CatTitleEditor';
import SweetAlert from 'sweetalert2';

let products = [];
let userDiscountObj = [];

export default class CategoryPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			products: [],
			standarts: [],
			prodStandarts: [],
			mainCategory: [],
			listView: true,
			listViewCard: false,
			userDiscount: [],
      catId:this.props.match.params.id,
			subId: this.props.match.params.subId,
			mainPosition: 0,
      catWidth: 180
		}
		this.updateCategory = this.updateCategory.bind(this);
		this.addProduct = this.addProduct.bind(this);
		this.getStandarts = this.getStandarts.bind(this);
		this.updateItems = this.updateItems.bind(this);
		this.userDiscount = this.userDiscount.bind(this);
		this.handleScroll = this.handleScroll.bind(this);
    this.getTitle = this.getTitle.bind(this);

	}
	componentDidMount(){
		// this.getStandarts();
		this.getProducts(this.props.match.params.subId);
		!localStorage.listView ? this.setState({listView: false}) : null;
		localStorage.user_id ? this.userDiscount(localStorage.user_id) : null;
		setTimeout(() => {
			window.scrollTo(0, 0);
			// window.addEventListener('scroll', this.handleScroll, true);
		}, 100);
	}
  componentWillUnmount(){
		// window.removeEventListener('scroll', this.handleScroll, true);
	}
  componentWillReceiveProps(nextProps) {
		if (this.props.match.params.subId != nextProps.match.params.subId) {
			this.getProducts(nextProps.match.params.subId);
			window.scrollTo(0, 0);
		}
	}

	handleScroll(e) {
		// let el = document.getElementById('navFix');
		// if (e.currentTarget.pageYOffset >= el.offsetTop) {
		// 	if (e.currentTarget.pageYOffset + el.offsetTop < el.offsetHeight) {
		// 		this.setState({mainPosition: (e.currentTarget.pageYOffset - el.offsetTop) + 60});
		// 	} else {
		// 		this.setState({mainPosition: 'bottom'});
		// 	}
		// } else {
		// 	this.setState({mainPosition: 0});
		// }
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


	getStandarts(){
		$.ajax({
			url: globalServer + 'standarts_view.php',
			type: 'POST'
		}).done(function(data) {
			let prodStandarts = [];
			data.ShopsStandartss.map((element, index) => {
				prodStandarts.push(element.Id);
			});
			this.setState({standarts: data.ShopsStandartss, prodStandarts: prodStandarts.toString()});
		}.bind(this)).fail(function() {	console.log("error"); });
	}

	addProduct() {
		let val = {
			parentId: null,
			catId: this.state.subId,
			prodName: 'שם המוצר',
			prodDescription: 'בניגוד לטענה הרווחת, Lorem Ipsum אינו סתם טקסט רנדומלי. יש לו שורשים וחלקים מתוך הספרות הלטינית הקלאסית מאז 45 לפני הספירה.',
			discountType: 1,
			discountVal: null,
			prodPrice: 100,
			standartId: '',
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
				let products = this.state.products;
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
				products.push(newProduct);
				this.setState({products});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	setPublic(id, e){
		this.updateItems(id, 1, 'Public');
	}
	setUnPublic(id, e){
		this.updateItems(id, null, 'Public');
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
				let products = this.state.products;
				products.find(x=> x.Id == d.id).Public = d.val;
				this.setState({products});
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

	addToCart(element){

    let subProdElement = this.state.products.filter((ele,ind) => {return ele.ParentId == element.Id})
    let product = {
      product: !subProdElement.length ? element : subProdElement[0],
      quantity: 1
    }
    this.props.addToCart(product);
	}


	getProducts(id){
		let val = { 'id': id };
		$.ajax({
			url: globalServer + 'products_per_category_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ products: data.ShopsProdss });
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}
  addCategory(id){
    this.setState({catId:id});
		let val = {
			parentId: id,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'category_add_child.php',
			type: 'POST',
			data: val,
		}).done(function(d) {
			if (d.result == "success") {
				let categories = this.props.state.categories;
				let catChild = {
          CatImg:null,
          CatInfo:null,
          CatName:"שם תת קטגוריה",
          CatNameEng:"Sub Cat Name",
          ExId:null,
          Id:d.id,
          ParentId:this.state.catId,
          Unpublish:null,
				}
				categories.push(catChild);
				this.setState({categories});
        // this.props.updateCats(categories);
				var navHeight = document.getElementsByClassName('navigation');
        navHeight[0].children[0].children[0] ?
				$('.navigation .wrapp').animate({scrollTop: navHeight[0].children[0].children[0].scrollHeight}, 400): null;
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
  addParentCategory(){
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
        let categories = this.props.state.categories;
				let catChild = {
					CatName: "שם תת קטגוריה",
					Id: d.id,
					ParentId: null
				}
				categories.push(catChild);
				this.setState({categories});
				var navHeight = document.getElementsByClassName('navigation');
        navHeight[0].children[0].children[0] ?
				$('.navigation .wrapp').animate({scrollTop: navHeight[0].children[0].children[0].scrollHeight}, 400): null;
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
  updateCategory(itemId, text, paramName){
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
				let cats = this.props.state.categories;
				cats.find(x=> x.Id == d.id).paramName = d.val;
				this.setState({categories: cats});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
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
				let categories = this.props.state.categories;
				categories.find(x=> x.Id == id).Unpublish = 1;
				this.setState({categories});
			}
		}.bind(this, id)).fail(function() { console.log('error'); });
	}
  deleteMainProd(Id){


    SweetAlert({
      title: 'האם אתה בטוח?',
      text: 'הנך הולך למחוק את המוצר וכל שאר הנתונים הקשורים אליו',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22b09a',
      cancelButtonColor: '#d80028',
      confirmButtonText: 'delete',
      cancelButtonText: 'cancel'
    }).then(function(id, res) {
      if (res.value) {
        let val = {
          role: localStorage.role,
          token: localStorage.token,
          id: Id
        };
        $.ajax({
          url: globalServer + 'delete_sub_product.php',
          type: 'POST',
          data: val,
        }).done(function(id, d) {
          let newItems = this.state.products.filter((ele,ind) => {
            return ele.Id != Id
          })
          this.setState({products:newItems});
        }.bind(this, val.id)).fail(function() { console.log('error'); });

      }
    }.bind(this, Id)).catch(SweetAlert.noop);

  }

  getTitle(id,paramName,e){
    let categories = this.props.state.categories;
    categories.find(x => x.Id == id)[paramName] = e.target.value;
    this.setState({categories});
  }
	render(){
		if (!localStorage.role) {
		return (
			<div className="page-container category-page">
				<h1 className="title">{this.state.mainCategory && this.state.mainCategory.CatName ? this.state.mainCategory.CatName : null}</h1>
				<div className="category-wrapper">
					<div className="category-view">
						<ul className="flex-container">
							<li onClick={() => {localStorage.setItem('listView', true), this.setState({'listView': true})}} className={this.state.listView ? 'active' : null}>
								<img src={globalFileServer + 'icons/list-view.png'} alt="" />
							</li>
							<li onClick={() => {localStorage.removeItem('listView'), this.setState({'listView': false})}} className={!this.state.listView ? 'active' : null}>
								<img src={globalFileServer + 'icons/block-view.png'} alt="" />
							</li>
						</ul>
					</div>
					<div className="navigation">
						<div className="place-holder"></div>
						<div className="wrapp">
							<ul className="sub-cats">
								{this.props.state.categories.map((element, index) => {
                  if(element.ParentId == this.props.match.params.id){
                    return(
                      <li key={index}>
                        <NavLink
                          onClick={this.getProducts.bind(this, element.Id)}
                          className="cat-link"
                          activeClassName={"active"}
                          to={"/category/" + this.props.match.params.id + "/" + element.Id}>
                          {element.CatName}
                        </NavLink>
                      </li>
                    )
                  }
                  // }
								})}
							</ul>
						</div>
					</div>
					<div id="navFix" className={this.state.listView ? 'products-view list' : 'products-view'}>
						<div className="flex-container">
							{!this.state.products.length ? <h1 className="hide-on-desctop no-product">לא קיימים מוצרים</h1> : null}
							{this.state.products.map((element, index) => {
								if (!element.ParentId && element.Public) {
									// let buyedProduct = !this.isEmpty(this.props.state.productsInCart) ? this.props.state.productsInCart.filter((elem, ind) => { return elem.product.Id == element.Id }) : null;
                  let subProdPrice = this.state.products.filter((ele,ind) => {return ele.ParentId == element.Id})

                  if (!this.isEmpty(this.state.userDiscount)) {
										userDiscountObj = this.state.userDiscount.filter((elem) => { return elem.ProdId == element.Id});
									}
									return (
										<div className="col-lg-4" key={index}>
											<div className="wrapp">
												<div className="img">
													{element.CatalogNum ?
														<img onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
													:
													<img src={globalFileServer + 'products/product.jpg'} alt="" />
													}
												</div>
												<NavLink className="product-link" to={"/product/" + element.Id}></NavLink>
												<div className="mask-details">
													{!subProdPrice.length || subProdPrice.length <= 1 ?
                            <div className="add-to-cart" onClick={this.addToCart.bind(this, element)}>
                              <p>הוסף לסל</p>
                              {/* <img src={globalFileServer + 'icons/cart.svg'} alt="" /> */}
                            </div>
                          :
                            null
                          }
                        </div>
                        <div className="mask-name">
                          <h4>{element.ProdName.length > 25 ? element.ProdName.substring(0, 25) + '...' : element.ProdName}</h4>
                          <ul className="sales-price">
                            <li className="base-price">{parseFloat(element.ProdPrice).toFixed('2') + " ₪"}</li>
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
											</ul>
										</div>
									</div>
								</div>
							)}
						})}
				 		</div>
					</div>
				</div>
			</div>
		)
		} else {
			return (
        <div className="page-container category-page edit-mod">
          <h1 className="title">{this.state.mainCategory && this.state.mainCategory.CatName ? this.state.mainCategory.CatName : null}</h1>
          <div className="category-wrapper flex-container">
            <div className="navigation col-lg-3">
              <div className="place-holder"></div>
              <div style={this.state.mainPosition != 'bottom' ? {top: this.state.mainPosition + 'px'} : {top: 'auto', bottom: '8px'}} className="wrapp">
                <ul>
                  {this.props.state.categories.map((element, index) => {
                    if (!element.ParentId && !element.Unpublish) {
                      return(
                        <li key={index}>
                          <a className={this.state.subId == element.Id ? "active cat-col" : "cat-col"}>
                            <CatTitleEditor
                              element={element}
                              part_1={element.Id}
                              part_2={element.Id}
                              placeHolder="קטגוריה"
                              updateItems={this.updateCategory}
                              toUpdate='CatName'
                              {...this}
                            />
                            <button onClick={this.deleteCategory.bind(this, element.Id)} className="delete-cat parent">
                              <img src={globalFileServer + 'icons/trash.svg'} alt="" />
                            </button>
                          </a>
                          <ul className={this.state.subId == element.Id ? "sub-cats opened" : "sub-cats"}>
                            {this.props.state.categories.map((el, ind) => {
                              if (el.ParentId == element.Id && !el.Unpublish) {
                                return(
                                  <li key={ind}>
                                    <CatTitleEditor
                                      element={el}
                                      part_1={el.Id}
                                      part_2={element.Id}
                                      placeHolder="תת קטגוריה"
                                      updateItems={this.updateCategory}
                                      toUpdate='CatName'
                                      {...this}
                                    />
                                    <button onClick={this.deleteCategory.bind(this, el.Id)} className="delete-cat">
                                      <img src={globalFileServer + 'icons/trash.svg'} alt="" />
                                    </button>
                                    <NavLink className="sub-cat-selector" to={"/category/" + el.ParentId +"/"+ el.Id}>
                                      <img
                                        className="pointer"
                                        onClick={()=> this.setState({subId:el.Id,catId:el.ParentId})}
                                        src={this.state.subId == el.Id ? globalFileServer + 'icons/bullet_white.svg' : globalFileServer + 'icons/bullet_white-empty.svg'}
                                      />
                                    </NavLink>
                                  </li>
                                )
                              }
                            })}
                            <li onClick={this.addCategory.bind(this, element.Id)} className="add-category">
                              <img src={globalFileServer + 'icons/add-circular-button.svg'} alt="" />
                              <span>הוסף תת קטגוריה</span>
                            </li>
                          </ul>
                        </li>
                      )
                    }
                  })}
                  <div onClick={this.addParentCategory.bind(this)} className="add-cat">
                    <p>+ הוסף קטגוריה</p>
                  </div>
                </ul>
              </div>
            </div>
            <nav className="hide-on-desctop mobile-only cats-scroll">
              <ul style={{width: (this.props.state.categories.length - 1) * this.state.catWidth}}>
                {this.props.state.categories && this.props.state.categories.length ? this.props.state.categories.map((element, index) => {
                  return (
                    this.props.state.categories.map((elem, ind) => {
                      if(element.Id == elem.ParentId) {
                        return (
                          <li style={{width: this.state.catWidth}} key={ind}>
                            <NavLink exact to={"/category/" + elem.ParentId + "/" + elem.Id}><span>{elem.CatName}</span></NavLink>
                          </li>
                        )};
                    })
                  )
                }) : null}
              </ul>
            </nav>
            <div id="navFix" className={this.state.listView ? 'products-view list flex-container col-lg-9' : 'products-view flex-container col-lg-9'}>
              {this.state.products.map((element, index) => {
                if (!element.ParentId && !element.Removed) {
                  let subProdPrice = this.state.products.filter((ele,ind) => {return ele.ParentId == element.Id})
                  let buyedProduct = !this.isEmpty(this.props.state.productsInCart) ? this.props.state.productsInCart.filter((elem, ind) => { return elem.product.Id == element.Id }) : null;
                  return (
                    <div className="col-lg-4 prod-cont-cls" key={index}>
                      <div
                        onClick={element.Public ? this.setUnPublic.bind(this, element.Id) : this.setPublic.bind(this, element.Id)}
                        className={element.Public ? "public enable" : "public disable"}>
                        {element.Public ? <img src={globalFileServer + 'icons/publick.png'} /> : <img src={globalFileServer + 'icons/unpublick.png'} />}
                      </div>
                      <div
                        className="remove-prod"
                        onClick={this.deleteMainProd.bind(this, element.Id)}>
                        <img src={globalFileServer + 'icons/trash.svg'}/>
                      </div>
                      <div className={element.Public ? "wrapp" : "wrapp disabled"}>
                        <div className="img">
                          {element.CatalogNum ?
                            <img className="xxx" onError={(e)=> e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
                          :
                          <img src={globalFileServer + 'products/product.jpg'} alt="" />
                          }
                        </div>
                        <NavLink className="product-link" to={"/product/" + element.Id}></NavLink>
                        <div className="mask-name">
                          <h4>{element.ProdName.length > 27 ? element.ProdName.substring(0,27) + '...' : element.ProdName}</h4>
                          <p>{subProdPrice.length ? parseFloat(subProdPrice[0].ProdPrice).toFixed('2') + " ₪" : parseFloat(element.ProdPrice).toFixed('2') + " ₪"}</p>
                        </div>
                          </div>
                          </div>
                        )}
                    })}
                {localStorage.role ?
                  <div className="col-lg-4 admin">
                    <div className="wrapp">
                      <div>
                        <img onClick={this.addProduct} src={globalFileServer + 'icons/add.png'} alt="" />
                        <h4>הוסף מוצר</h4>
                      </div>
                    </div>
                  </div> : null }
              </div>
              </div>
              </div>
			)
		}
	}
}
