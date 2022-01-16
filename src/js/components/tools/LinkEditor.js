import React, {Component} from 'react';
import { NavLink } from "react-router-dom";

import styles from './LinkEditor.scss';

export default class LinkEditor extends Component {
	constructor(props){
		super(props);
		this.state = {
			edit: false,
			title: this.props.title
		}
		this.save = this.save.bind(this);
		this.cansel = this.cansel.bind(this);
		this.EditOn = this.EditOn.bind(this);
		this.getTitle = this.getTitle.bind(this);
	}
	getTitle(event){
		this.setState({	title: event.target.value });
	}
	EditOn(){
		this.setState({	edit: true });
	}
	save(){
		this.setState({ edit: false });
		this.props.updateItems(this.props.itemId, this.state.title, this.props.toUpdate);
	}
	cansel(){
		this.setState({
			edit: false,
			title: this.props.title
		});
	}

	render() {
		return (
			<div className="link-editor">
				{!this.state.edit ?
					<div className="not-edit">
						<span onClick={this.EditOn} className="edit"><img src={globalFileServer + 'icons/edit.png'}/></span>
						<NavLink className="cat-link" to={"/category/" + this.props.part_2 +"/"+ this.props.part_1}>{this.state.title}</NavLink>
					</div>
				:
					<div>
						<input onChange={this.getTitle} value={this.state.title} type="text" name="title-reditor" />
						<ul className="actions">
							<li><button onClick={this.save} className="button-green">שמור</button></li>
							<li><button onClick={this.cansel} className="button-red">ביטול</button></li>
						</ul>
					</div>
				}
			</div>
		);
	}
}
