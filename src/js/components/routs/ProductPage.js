import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import RichEditor from '../tools/RichEditor';
import MyCropper from '../tools/MyCropper';
import TitleEditor from '../tools/TitleEditor';
import Slider from 'react-slick';



import RecommendedProducts from "./productPage/RecommendedProducts.js";
import AddRecommendedProduct from "./productPage/AddRecommendedProduct.js";


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
			additionalImages: [],
			mainImage: '',
			quantity: 1,
			recommendedProducts: [],
			addadedToCart: false,
			userDiscount: [],
			standarts: [],
			newProdValue: "",
			newProdUnit: "",
			popup: false,
			preload: false,
			dateNew: '',
      chosenSubProdId:false,
      items:[],
      chosenSubProdCatalog:""
		}
		this.getAdditionalImg = this.getAdditionalImg.bind(this);
		this.selectChildren = this.selectChildren.bind(this);
		this.increaseQuantity = this.increaseQuantity.bind(this);
		this.decreaseQuantity = this.decreaseQuantity.bind(this);
		this.getRecommendedProducts = this.getRecommendedProducts.bind(this);
		this.resetState = this.resetState.bind(this);
		this.addToCart = this.addToCart.bind(this);
		this.getStandarts = this.getStandarts.bind(this);
		this.setUserDiscount = this.setUserDiscount.bind(this);
		this.updateItems = this.updateItems.bind(this);
		// this.updateItemsCatalogNum = this.updateItemsCatalogNum.bind(this);
		this.addChildProduct = this.addChildProduct.bind(this);
		this.setDiscountType = this.setDiscountType.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.addAdditionalImg = this.addAdditionalImg.bind(this);
		this.setPublic = this.setPublic.bind(this);
		this.setUnPublic = this.setUnPublic.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.deleteRProduct = this.deleteRProduct.bind(this);
		this.deleteSubProduct = this.deleteSubProduct.bind(this);
    this.getRandomRecommendedProducts = this.getRandomRecommendedProducts.bind(this);
    this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
    this.getTitle = this.getTitle.bind(this);
    this.getQuanAndAddedTOCart = this.getQuanAndAddedTOCart.bind(this);

	}
	componentDidMount(){

		this.getProduct(this.props.match.params.id);
		this.getStandarts();
		let dateNew = new Date;
		dateNew = dateNew.toLocaleTimeString().slice(0, -3);
		this.setState({dateNew});
    setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);

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

	EditOn(){
		this.setState({	edit: true });
	}
	deleteSubProduct(prodId){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			id: prodId
		};
		$.ajax({
			url: globalServer + 'delete_sub_product.php',
			type: 'POST',
			data: val,
		}).done(function(id, d) {
			let product = this.state.items.filter((element) => {
				return element.Id !== id
			});
			this.setState({items:product});
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
		this.updateItems(this.state.items[0].Id, data ? data : "", 'ProdAddOns');
		this.setState({popup: false});
	}
	addChildProduct() {
		let val = {
			parentId: this.state.items[0].Id,
			catId: this.state.items[0].CatId,
			prodName: this.state.items[0].ProdName,
			prodDescription: '',
			discountType: 1,
			discountVal: null,
			prodPrice: 100,
			standartId: '',
			deliveryInfo: '',
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'create_product.php',
			type: 'POST',
			data: val,
		}).done(function(val, d) {
			if (d.result == "success") {
				let product = this.state.items;
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
				this.setState({items:product});
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
			this.setUserDiscount(data, this.state.items[0]);
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	setUserDiscount(UserDiscount, item) {
		let dP = item;
		UserDiscount.map((element, index) => {
			element.ProdId == item.Id ? dP.DiscountVal = element.DiscountVal : null;
		});
	}

	saveProdValue(type,Id, e) {
		this.updateItems(Id, e.target.value, type);
	}
	setDiscountType(id, e) {
    let items = this.state.items;
    items.find(x => x.Id == id)['DiscountType'] = e.target.value;
    this.setState({items});
		this.updateItems(id, e.target.value, 'DiscountType');
	}
	deleteRProduct(id){
		let selectedProducts = this.state.items[0].ProdAddOns.split(',');
		let sP = selectedProducts.filter((elem) => { return elem != id });
		this.updateItems(this.state.items[0].Id, sP.join(), 'ProdAddOns');
	}

  getTitle(id,paramName,e){
    let items = this.state.items;
    items.find(x => x.Id == id)[paramName] = e.target.value;
    this.setState({items});
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
              let items = this.state.items;
              if(text=='1'){
                items[0].IsProdSale = true;
              }else{
                items[0].IsProdSale = false;
              }
              this.setState({items});

              if (d.paramName == 'ProdAddOns') {
                this.getRecommendedProducts(d.val);
              }
            }
          }.bind(this, val)).fail(function() { console.log('error'); });


        }

        setPublic(){
          this.updateItems(this.state.items[0].Id, 1, 'Public');
        }
        setUnPublic(){
          this.updateItems(this.state.items[0].Id, null, 'Public');
        }
        IsProdSale(id, e){
          let checked = e.target.checked ? "1" : null;
          this.updateItems(id, checked, 'IsProdSale');
        }
        selectStandart(id){
          let standarts = this.state.items[0].StandartId ? this.state.items[0].StandartId.split(',') : [];
          standarts.push(id + "");
          let nStandarts = standarts.join();
          this.updateItems(this.state.items[0].Id, nStandarts, 'StandartId');
        }
        deSelectStandart(id){
          let standarts = this.state.items[0].StandartId ? this.state.items[0].StandartId.split(',') : [];
          standarts = standarts.filter((elem) => { return elem != id });
          let nStandarts = standarts.join();
          this.updateItems(this.state.items[0].Id, nStandarts, 'StandartId');
        }
        addAdditionalImg(data) {
          let tmpFileName = this.state.items[0].CatalogNum + '_' + (parseFloat(this.state.additionalImages.length) + 1);
          let val = {
            FileName: tmpFileName,
            Img: data.img,
            role: localStorage.role,
            token: localStorage.token,
            Folder: data.folder,
            ItemId: data.itemId
          };
          $.ajax({
            url: globalServer + 'upload_img_product.php',
            type: 'POST',
            data: val,
          }).done(function(d, data) {
            if (data.result == "success") {
              let today = new Date();
              let milliseconds = today.getMilliseconds();
              let additionalImages = this.state.additionalImages;
              let img = additionalImages.filter((elem) => {
                if (elem.indexOf('?') > -1) {
                  return elem.substring(0, elem.indexOf('?')) !== tmpFileName
                } else {
                  return elem !== d.fileName
                }
              });
              img.push(tmpFileName + '.jpg?' + milliseconds);
              this.setState({additionalImages: img});
            }
          }.bind(this, val)).fail(function() { console.log('error'); });
        }

        uploadImg(data){
          this.setState({preload: true});
          let params = {
            token: localStorage.token,
            role: localStorage.role,
            Folder: data.folder,
            FileName: this.state.items[0].CatalogNum,
            Img: data.img,
            ItemId: data.itemId
          };
          $.ajax({
            url: globalServer + 'upload_img_product.php',
            type: 'POST',
            data: params
          }).done(function(d, data) {
            if(data.result == "success") {
              let today = new Date();
              let milliseconds = today.getMilliseconds();
              let dateNew = today.toLocaleTimeString().slice(0, -3);
              this.setState({mainImage: this.state.items[0].CatalogNum + ".jpg"});
              this.setState({preload: false,dateNew});
              if(this.state.additionalImages){
                let tmp_Additional = this.state.additionalImages;
                tmp_Additional[0] = this.state.items[0].CatalogNum + ".jpg";
                this.setState({additionalImages: tmp_Additional});
              }
            }
          }.bind(this, data)).fail(function() {
            console.log('error');
            this.setState({preload: false});
          });
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
            items: [],
            addadedToCart: false,
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
            let items = data.ShopsProdss;
            let chosenSubProdId = items.length > 1 ? items[1].Id : items[0].Id;
            let chosenSubProdCatalog = items.length > 1 ? items[1].CatalogNum : items[0].CatalogNum;
            this.setState({	items: data.ShopsProdss,
              chosenSubProdId:chosenSubProdId,chosenSubProdCatalog,
            mainImage: items[0].CatalogNum});

            this.getQuanAndAddedTOCart(chosenSubProdId);
            localStorage.user_id ? this.userDiscount(localStorage.user_id) : null;
            this.getAdditionalImg(items[0].CatalogNum);
            if (items[0].ProdAddOns){
              this.getRecommendedProducts(items[0].ProdAddOns);
            }else{
              this.getRandomRecommendedProducts(items[0].CatId,id);
            }
            localStorage.products ?	products = JSON.parse(localStorage.getItem("products")) : null;
            localStorage.wishList ?	wishList = JSON.parse(localStorage.getItem("wishList")) : null;
          }.bind(this)).fail(function() {	console.log("error"); });
        }
        getQuanAndAddedTOCart(chosenSubProdId){
          if(this.props.state.productsInCart.length){
            let tmpProd = this.props.state.productsInCart.filter((elem,ind) => {return elem.Id == chosenSubProdId})
            if(tmpProd[0]){
              this.setState({quantity:tmpProd[0].Quantity});
              this.setState({addadedToCart: true});
            }else{
              this.setState({addadedToCart: false});
            }
          }
        }
        getRandomRecommendedProducts(tmpCatId,tmpProdId){
          let val = {
            'catId': tmpCatId,
            'id': tmpProdId
          };
          $.ajax({
            url: globalServer + 'getRandomRecommendedProducts.php',
            type: 'POST',
            data: val,
          }).done(function(data) {
            this.setState({ recommendedProducts: data.ShopsProdss });
          }.bind(this)).fail(function() {	console.log("error");});

        }
        addToCart(){
          let tmp_element = this.state.items.find((ele,itm) => {return ele.Id = this.state.chosenSubProdId})
          let product = {
            product: tmp_element,
            quantity: this.state.quantity
          }
          this.props.addToCart(product);
        }
        updateInCart(){
          this.props.updateInCart(this.state.chosenSubProdId,this.state.quantity);
          this.props.history.push('/cart');
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

          let tmp_chosenSubProdCatalog = this.state.items.filter((ele,ind) => {
            return ele.Id == event.target.value
          })
          this.setState({	chosenSubProdId:event.target.value,chosenSubProdCatalog:tmp_chosenSubProdCatalog[0].CatalogNum});
          this.getQuanAndAddedTOCart(event.target.value);
        }
        setPreload(){
          this.setState({preload: true});
        }
        unsetPreload(){
          this.setState({preload: false});
        }
        increaseQuantity(){
          this.setState({	quantity: this.state.quantity -= 1 });
        }
        decreaseQuantity(){
          this.setState({	quantity: this.state.quantity += 1 });
        }
        render(){
          let props = Object.assign({}, this.props);
          let inWishlist=[];
          if(this.state.items[0]){
            inWishlist = this.props.state.wishList.filter(item => item.Id == this.state.items[0].Id);
          }
            if(this.state.items.length){
            return (
              <div>
                <div className={localStorage.role ? "page-container product-page edit-mod" : "page-container product-page"}>
                  {window.innerWidth>600 ?
                    <div className="back-cont">
                      <div onClick={() => this.props.history.goBack()} className="icon back">
                        <p>חזור</p>
                        <img src={globalFileServer + 'icons/previous-white.svg'} />
                      </div>
                    </div>
                  :null}
                  <div className="product-wrapper flex-container">
                    <div className="col-lg-6 info-p">
                      <div className={"product-details"}>
                        {!localStorage.role ?
                          <div className="name flex-container">
                            <div className="product-name col-lg-10 reg-mode">
                              <h2 dangerouslySetInnerHTML={{__html: this.state.items[0].ProdName}}></h2>
                            </div>
                            {/* <div className="catalog-number col-lg-2 hide-on-mobile">
                              <span>מספר קטלוגי:</span>
                              <p>{this.state.chosenSubProdCatalog}</p>
                            </div> */}
                          </div>
                        :
                        <div className="name flex-container">
                          <div className="col-lg-9">
                            <TitleEditor
                              toUpdate='ProdName'
                              element={this.state.items[0]}
                              placeHolder="שם המוצר"
                              {...this}
                            />
                          </div>
                          <div className={this.state.items[0].CatalogNum ? "catalog-number col-lg-3" : "catalog-number require col-lg-3"}>
                            <TitleEditor
                              toUpdate='CatalogNum'
                              placeHolder="מס' קטלוגי"
                              element={this.state.items[0]}
                              {...this}
                            />
                          </div>
                        </div>
                        }
                        {!localStorage.role ?
                          // <div className="details">
                          //   <p dangerouslySetInnerHTML={{__html: this.state.items[0].ProdDescription}}></p>
                          // </div>
                          null
                        :
                        <div className="details">
                          <RichEditor
                            text={this.state.items[0].ProdDescription}
                            itemId={this.state.items[0].Id}
                            updateItems={this.updateItems}
                            toUpdate='ProdDescription'
                            extended={true}
                            placeHolder="תאור המוצר"
                          />
                          {this.state.items[0].Id == this.state.items[0].Id ?
                            <div className="for-sale">
                              <div className="checkboxes-and-radios">
                                <input type="checkbox"
                                  onChange={this.IsProdSale.bind(this, this.state.items[0].Id)}
                                  name="checkbox-cats" checked={this.state.items[0].IsProdSale ? true : false}
                                id="checkbox-2" value="2" />
                                <label htmlFor="checkbox-2"></label>
                              </div>
                              <span>מבצעים שווים</span>
                            </div> : null}
                        </div>
                        }
                        {!localStorage.role ?
                          <div className="actions flex-container">
                            {this.state.items.length > 1 ?
                              <div className="col-lg-6 selector-cls">
                                <div className="value">
                                  <div className="arrow-down">
                                    <img src={globalFileServer + "icons/down-green.svg"} alt=""/>
                                  </div>
                                  <select onChange={this.selectChildren}>
                                    {this.state.items.map((element, index) => {
                                      if (element.Public && element.ParentId) {
                                        return (
                                          <option key={index} value={element.Id}>{element.ProdValue + " " + element.ProdUnit}</option>
                                        )}
                                    })}
                                  </select>
                                </div>
                              </div>
                            :this.state.items[0].ParentId ?
                              <div className="col-lg-6 selector-cls2">
                                <div className="value">
                                  <div className="sub-prod-name-cont">
                                    <p>{this.state.items[0].ProdValue + " " + this.state.items[0].ProdUnit}</p>
                                  </div>
                                </div>
                              </div>
                            :null
                            }
                            <div className= {this.state.items.length == 1 ? "col-lg-6 quan-cls-2" : "col-lg-6 quan-no-sub-prods"}>
                              <div className="quantity">
                                <div className="quantity-wrapp">
                                  <span onClick={this.decreaseQuantity} className="decrease noSelect">+</span>
                                  <p>{this.state.quantity}</p>
                                  {this.state.quantity > 1 ?
                                    <span onClick={this.increaseQuantity} className="increase noSelect">&ndash;</span>
                                  :
                                  <span className="increase disabled noSelect">&ndash;</span>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        :
                        <div className="actions">
                          <div className="view-details">
                            <div className="add-child-product">

                              {this.state.items.map((element,index) => {
                                if(element.ParentId){
                                  return(
                                    <ul key={index}>
                                      <li>
                                        <img
                                          className="pointer"
                                          onClick={()=> this.setState({chosenSubProdId:element.Id})}
                                          src={this.state.chosenSubProdId == element.Id ? globalFileServer + 'icons/bullet_white.svg' : globalFileServer + 'icons/bullet_white-empty.svg'}
                                        />
                                      </li>
                                      <li>
                                        <TitleEditor
                                          toUpdate='ProdValue'
                                          element={element}
                                          placeHolder="ערך המוצר"
                                          {...this}
                                        />
                                      </li>
                                      <li>
                                        <TitleEditor
                                          toUpdate='ProdUnit'
                                          element={element}
                                          placeHolder="תאור הערך"
                                          {...this}
                                        />
                                      </li>
                                      <li>
                                        <TitleEditor
                                          toUpdate='CatalogNum'
                                          element={element}
                                          placeHolder="מס' קטלוגי"
                                          {...this}
                                        />
                                      </li>
                                      <li>
                                        {this.state.items[0].Id != this.state.items[0].Id ?
                                          <div
                                            onClick={this.state.items[0].Public ? this.setUnPublic : this.setPublic}
                                            className={this.state.items[0].Public ? "public enable" : "public disable"}>
                                            {this.state.items[0].Public ? <img src={globalFileServer + 'icons/publick.svg'} /> : <img src={globalFileServer + 'icons/unpublick.svg'} />}
                                          </div> : null}
                                      </li>
                                      <li>
                                        <div onClick={this.deleteSubProduct.bind(this,element.Id)} className="delete-subProduct">
                                          <img src={globalFileServer + 'icons/trash.svg'} />
                                        </div>
                                      </li>
                                    </ul>
                                  )
                                }
                              })}
                              <button className="add-subprod-btn" onClick={this.addChildProduct} ><img src={globalFileServer + 'icons/add-circular-button.svg'} />תת מוצר</button>
                            </div>
                          </div>
                        </div>
                        }
                        {!localStorage.role ?
                          <div>
                            {this.state.items.map((element,index) => {
                              if(this.state.chosenSubProdId == element.Id){
                                return(
                                  <div key={index}>
                                    {element.DiscountVal ?
                                      <div className="price flex-container">
                                        <div className="col-lg-4 base-price">
                                          <h4>מחיר רגיל</h4>
                                          <p>{(parseFloat(element.ProdPrice) * this.state.quantity).toFixed(2)} ₪</p>
                                        </div>
                                        <div className="col-lg-3">
                                          <h4>הנחה</h4>
                                          {element.DiscountVal ?
                                            <p>
                                              <span>{element.DiscountType == 2 ? "% ": null}</span>
                                              <span>
                                                {element.DiscountType == 2 ? element.DiscountVal :
                                                parseFloat(element.DiscountVal) * this.state.quantity}
                                              </span>
                                              <span>{element.DiscountType == 1 ? " ₪": null}</span>
                                            </p>
                                          : <p>0</p>}
                                        </div>
                                        <div className="col-lg-5">
                                          <div className="final-price">
                                            <h4>מחיר סופי</h4>
                                            {element.DiscountType == 1 ?
                                              <p>{ ((parseFloat(element.ProdPrice) - element.DiscountVal) * this.state.quantity).toFixed(2) + ' ₪'}</p>
                                            : <p>{ (parseFloat(element.ProdPrice * this.state.quantity) - (element.ProdPrice * this.state.quantity * element.DiscountVal / 100)).toFixed(2) + '₪'}</p>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    :
                                    <div className="price col-lg-5">
                                      <div className="final-price">
                                        <h4>מחיר</h4>
                                        {element.DiscountType == 1 ?
                                          <p>{ ((parseFloat(element.ProdPrice) - element.DiscountVal) * this.state.quantity).toFixed(2)}</p>
                                        : <p>{ (parseFloat(element.ProdPrice * this.state.quantity) - (element.ProdPrice * this.state.quantity * element.DiscountVal / 100)).toFixed(2)}</p>
                                        }
                                      </div>
                                    </div>}</div>
                                )
                              }
                            })}
                          </div>
                        :
                        <div>
                          {this.state.items.map((element,index) => {
                            if(this.state.chosenSubProdId == element.Id){
                              return(
                                <div key={index} className="price flex-container">
                                  <div className="col-lg-4">
                                    <h4>מחיר רגיל</h4>
                                    <TitleEditor
                                      toUpdate='ProdPrice'
                                      element={element}
                                      {...this}
                                    />
                                    <span className="shekel"> ₪</span>
                                  </div>
                                  <div className="col-lg-4">
                                    <h4>הנחה</h4>
                                    <div className="discount-edit">
                                      <span>
                                        <TitleEditor
                                          toUpdate='DiscountVal'
                                          element={element}
                                          {...this}
                                        />
                                      </span>
                                      <select onChange={this.setDiscountType.bind(this,element.Id)}>
                                        <option
                                          selected={element.DiscountType == "1" ? "selected" : false}
                                          value={1}>
                                          <span>₪</span>
                                        </option>
                                        <option
                                          selected={element.DiscountType == "2" ? "selected" : false}
                                          value={2}>
                                          <span>%</span>
                                        </option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="col-lg-4">
                                    <div className="final-price">
                                      <h4>אחרי הנחה</h4>
                                      {element.DiscountType == 1 ?
                                        <p>{((parseFloat(element.ProdPrice) - element.DiscountVal) * this.state.quantity).toFixed(2)}</p>
                                      :
                                      <p>{((parseFloat(element.ProdPrice) - (parseFloat(element.ProdPrice) * element.DiscountVal / 100)) * this.state.quantity).toFixed(2)} ₪</p>
                                      }
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          })}
                        </div>
                        }
                        <div className="add-to-cart">
                          <div className="cart">
                            <button onClick={this.addToCart}>
                              <span>הוסף לסל</span>
                              <img src={globalFileServer + 'icons/cart_1.svg'} alt="" />
                            </button>
                          </div>
                          <div className="wishlist">
                            {!inWishlist.length ?
                              <button onClick={this.props.addToWishList.bind(this, this.state.items[0])}>
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
                        {!localStorage.role ?
                          <div className="main-image">
                            {this.state.mainImage ?
                              <img className="main-img" src={globalFileServer + 'products/' + this.state.mainImage + "?"+this.state.dateNew} alt="" />
                            :
                            <img className="main-img" src={globalFileServer + 'products/product.jpg'} alt="" />
                            }
                          </div>
                        :
                        <div className="main-image edit-mode">
                          {this.state.items[0].CatalogNum ?
                            <div>
                              <div>
                                <div onClick={this.deleteMainImg.bind(this, this.state.items[0].CatalogNum)} className="delete-img">
                                  <img src={globalFileServer + 'icons/trash.svg'} alt="" />
                                </div>
                                <img
                                  className="main-img"
                                  src={this.state.items[0].CatalogNum && this.state.mainImage ? globalFileServer + "products/" + this.state.mainImage + "?"+this.state.dateNew : globalFileServer + "products/product.jpg"}
                                  onLoad={() => localStorage.role ? this.setState({preload: false}) : null}
                                />
                                <MyCropper
                                  itemId={this.state.items[0].Id}
                                  img={"products/" + this.state.mainImage + "?" + this.state.dateNew}
                                  uploadImg={this.uploadImg}
                                  toUpdate='CatalogNum'
                                  folder={"products"}
                                  aspectRatio={16/16} {...this.props}
                                  width={1920}
                                  height={1920}
                                />
                              </div>

                            </div>
                          :
                          <div>
                            {this.state.mainImage ?
                              <img src={globalFileServer + 'products/' + this.state.mainImage + "?"+this.state.dateNew} alt="3" />
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
        										<div className="additional-images flex-container">
        											{this.state.additionalImages.map((element, index) => {
        												return (
        													<div key={index} className={this.state.additionalImages.length > 3 ? "col-lg-3" : "col-lg-4"}>
        														<div className="wrapp">
        															<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element + "?" + this.state.dateNew} alt="" />
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
        															{element.indexOf('_') > -1 ? <div onClick={this.deleteImg.bind(this, element)} className="delete"><img src={globalFileServer + "icons/trash.svg"} /></div> : null}
        															<div className="wrapp">
        																<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element} alt="" />
        															</div>
        														</div>
        													)
        												})}
        												<div className="col-lg-3">
        													<div className="wrapp add-img">
        														<MyCropper
        															itemId={this.props.match.params.id}
        															uploadImg={this.addAdditionalImg}
        															folder={"products"}
                                      aspectRatio={16/16} {...this.props}
                                      width={1920}
                                      height={1920}
                      />
        													</div>
        												</div>
        											</Slider>
        										</div>
        									:
        									<div className="additional-images flex-container">
        										{this.state.additionalImages.map((element, index) => {
        											return (
        												<div key={index} className="col-lg-4">
        													{element.indexOf('_') > -1 ? <div onClick={this.deleteImg.bind(this, element)} className="delete"><img src={globalFileServer + "icons/trash.svg"} /></div> : null}
        													<div className="wrapp">
        														<img onClick={this.changeMainImage.bind(this, element)} src={globalFileServer + 'products/' + element + "?" + this.state.dateNew} alt="" />
        													</div>
        												</div>
        											)
        										})}
        										{this.state.mainImage ?
        											<div className="col-lg-4">
        												<div className="wrapp add-img">
        													<MyCropper
        														itemId={this.props.match.params.id}
        														uploadImg={this.addAdditionalImg}
        														folder={"products"}
                                    aspectRatio={16/16} {...this.props}
                                    width={1920}
                                    height={1920}
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

                  {/* {!localStorage.role ?
                    <div className="related-products">
                      <RecommendedProducts getProduct={this.getProduct.bind(this)} products={this.state.recommendedProducts} />
                    </div>
                    :
                    <div className="related-products">
                    {this.state.popup ? <AddRecommendedProduct closePopup={this.closePopup} selectedProducts={this.state.items[0].ProdAddOns} /> : null}
                    </div>
                  } */}
                  <div className="related-products">
                    {this.state.recommendedProducts && this.state.recommendedProducts.length > 0 ?
                      <RecommendedProducts
                        products={this.state.recommendedProducts}
                      />
                    :null}
                  </div>
                </div>
              </div>
		)}else{return null}
	}
}
