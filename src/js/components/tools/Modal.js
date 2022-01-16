import ReactDOM from "react-dom";
import React, {Component} from 'react';

export default class Modal extends Component {
	state = {}
	render(){
		return ReactDOM.createPortal(this.props.children,document.getElementById('modal-root'));
	}
}
