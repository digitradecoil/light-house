import React, { Component } from 'react';


export default class Parallax extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	render(){
		console.log(globalFileServer);
		return (
			<section className="parallax" style={{backgroundImage: 'url(' + globalFileServer + this.props.img + ')'}}>

			</section>
		)
	}
}
