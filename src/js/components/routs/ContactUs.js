import React, { Component } from 'react';

import ContactUs from "./home/ContactUsHome";

export default class AboutUs extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	componentDidMount(){
		setTimeout(() => {
			window.scrollTo(0,0);
		}, 50);
	}
	componentWillUpdate() {}
	render(){
		let props = Object.assign({}, this.props);
		return (
			<div className="contact-page">
				<div className="contact-main-cont">
					<ContactUs {...props}/>
				</div>
			</div>
		)
	}
}
