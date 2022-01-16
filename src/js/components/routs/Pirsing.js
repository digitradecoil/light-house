import React, { Component } from 'react';
import { NavLink } from "react-router-dom";


let uagent = navigator.userAgent.toLowerCase();
let feed;

export default class Pirsing extends Component {
	state = {
		items: [],
		toShow: 8
	}
	componentDidMount = () => {
		this.getItems();
		window.addEventListener('scroll', this.handleScroll, true);
    setTimeout(() => { window.scrollTo(0,0) }, 200);
	}
	componentWillUnmount = () => {
		window.removeEventListener('scroll', this.handleScroll, true);
	}
	handleScroll = (e) => {
		var parallax = document.getElementsByClassName("parallax");
		let wh = window.innerHeight
		if (e.currentTarget.pageYOffset + wh >= parallax[0].offsetTop) {
			if (this.state.toShow <= this.state.items.length) {
				this.setState({toShow: this.state.toShow + 8});
			}
		}
		localStorage.setItem('scrollVal', e.currentTarget.pageYOffset);
	}
	getItems = () => {
    let val = {
			funcName: 'getHomeItems',
			type: 6
		};
    $.ajax({
      url: globalServer + 'global.php',
      type: 'POST',
      data: val,
    }).done(function(data) {
      this.setState({
        items: data.Items
      });
    }.bind(this)).fail(function() {	console.log("error"); });
  }
	render(){
		return (
      <div className="gallery-page">
        <div className="gal-main-cont">
          <div className="insta-cont">
						<div className="items flex-container">
							{this.state.items.map((element, index) => {
								if(index <= this.state.toShow){
								return(
									<div key={index} className="col-lg-4">
										<div className="wrapper">
											<img src={globalFileServer + 'home_items/' + element.Img} />
											{element.Title ?
											<div className="masc">
												<p>{element.Title}</p>
											</div> : null}
										</div>
									</div>
								);
								}
							})}
						</div>
						<div className="parallax"></div>
          </div>
        </div>
      </div>
		)
	}
}
