import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import moment from 'moment';

import './ViewMessage.scss';

export default class ViewMessage extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedProducts: []
		}
		this.closePopup = this.closePopup.bind(this);
		this.getSelectedProducts = this.getSelectedProducts.bind(this);
	}
	componentDidMount(){
		this.getSelectedProducts();
	}
	getSelectedProducts(){
		let val = { 'id': this.props.notice.ProductIds };
		$.ajax({
			url: globalServer + 'recommended_products_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ selectedProducts: data });
		}.bind(this)).fail(function(d) { console.log("error"); });
	}
	closePopup(data){
		this.setState({popup: false});
	}
	isEmpty(obj) {
		for (let x in obj) { return false; }
		return true;
	}
	render(){
		return (
			<div className="popup" id="view_massage">
				<div className="popup-wrapper">
					<div className="wrapp">
						<div onClick={()=> this.props.close()} className="close-popup">
							<img src={globalFileServer + 'icons/cancel.png'} alt="" />
						</div>
						<div className="massage-container">
							<h3>{this.props.notice.Title}</h3>
							<p>{this.props.notice.Message}</p>
							{this.props.notice.Link ? <a className="custom-link" href={"http://" + this.props.notice.Link} target="_blank">לפרטים כנסו ללינק</a> : null}
						</div>
						<ul className="products-wrapper">
							{this.state.selectedProducts.map((element, index) => {
								return (
									<li key={index}>
										<NavLink to={"/product/" + element.Id}>
											<div className="wrapp">
												<div className="link">
													<img src={globalFileServer + 'icons/link.svg'} alt="" />
												</div>
												<div className="img-wrapp">
													<img onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + element.CatalogNum + '.jpg'} alt="" />
												</div>
												<p>{element.ProdName.length > 20 ? element.ProdName.substring(0, 20) + '...' : element.ProdName}</p>
											</div>
										</NavLink>
									</li>
								)
							})}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}
