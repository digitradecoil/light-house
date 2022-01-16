import React, { Component } from 'react';
import Slider from 'react-slick';
import { NavLink } from "react-router-dom";



let products = [];
export default class RecommendedProducts extends Component {
	constructor(props){
		super(props);
		this.state = {
			productsInCart: []
		}
	}
	componentDidMount(){
		this.setState({ productsInCart: JSON.parse(localStorage.getItem("products"))});
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
    let settings = [];

    	settings = {
    		dots: window.innerWidth < 600 ? true : false,
        arrows: window.innerWidth > 600 ? true : false,
    		autoplay: false,
    		infinite: false,
    		speed: 200,
    		slidesToShow: window.innerWidth > 600 ? (this.props.products.length < 4 ? this.props.products.length : 4) : 1,
    		slidesToScroll: 1,
    		swipe: window.innerWidth < 900 ? true : false
    	};
		return (
			<section id="recommendedProducts" className="recommended-products">
				<h1 className="title">מוצרים מומלצים</h1>
        <Slider {...settings}>
          {this.props.products.map((element, index) => {
              // let buyedProduct = !this.isEmpty(this.state.productsInCart) ? this.state.productsInCart.filter((elem, ind) => { return elem.Id == element.Id }) : null;
            if(!element.ParentId){
              return(
                <div className="rpw" key={index}>

                  <NavLink className="product-NavLink" to={"/product/" + element.Id}>
                    <div className="wrapp">
                      <div className="img">
                        <img onError={(e)=> e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + ".jpg"} alt="" />
                      </div>
                      <div className="mask-details">
                        
                      </div>
                      <div className="mask-name">
                        <h4>{element.ProdName.length > 25 ? element.ProdName.substring(0, 25) + '...' : element.ProdName}</h4>
                        {/* <p className="base-price">{parseFloat(element.ProdPrice).toFixed('2') + " ₪"}</p> */}
                      </div>
                    </div>
                  </NavLink>
                </div>
              )
            }
          })}
        </Slider>
			</section>
		)
	}
}
