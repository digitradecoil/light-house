import React, {Component} from 'react';
import styles from './TitleEditor.scss';

export default class TitleEditor extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: this.props.title
		}
		this.save = this.save.bind(this);
	}

	save(){
		this.props.updateItems(this.props.element.Id, this.props.element[this.props.toUpdate], this.props.toUpdate);
	}
  // componentWillReceiveProps(nextProps) {
	// 	this.setState({	title: nextProps.title });
	// }

	render() {
		return (
			<div className={this.props.subTitle ? "title-editor sub-title-editor" : "title-editor"}>
        <div className={this.props.banners ? "big-banners-val" : null}>
          <input placeholder={this.props.placeHolder}
            onBlur={this.save}
            value={this.props.element[this.props.toUpdate]}
            onChange={this.props.getTitle.bind(this,this.props.element.Id,this.props.toUpdate)}
          type="text"/>
        </div>
			</div>
		);
	}
}
