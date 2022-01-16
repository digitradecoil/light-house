import React, {Component} from 'react';
//import TextEditor from 'react-texteditor';
import RichTextEditor from 'react-rte';

import styles from './RichEditor.scss';

const toolbarConfigFull = {
	display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
	INLINE_STYLE_BUTTONS: [
		{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
		{label: 'Italic', style: 'ITALIC'},
		{label: 'Underline', style: 'UNDERLINE'}
		],
		BLOCK_TYPE_DROPDOWN: [
		{label: 'Normal', style: 'unstyled'},
		{label: 'Heading Large', style: 'header-one'},
		{label: 'Heading Medium', style: 'header-two'},
		{label: 'Heading Small', style: 'header-three'}
		],
		BLOCK_TYPE_BUTTONS: [
		{label: 'UL', style: 'unordered-list-item'},
		{label: 'OL', style: 'ordered-list-item'}
	]
}
const toolbarConfigSmoll = {
	display: ['INLINE_STYLE_BUTTONS'],
	INLINE_STYLE_BUTTONS: [
		{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
		{label: 'Italic', style: 'ITALIC'},
		{label: 'Underline', style: 'UNDERLINE'}
	]
}

export default class RichEditor extends Component {

	constructor(props) {
		super(props);
		this.state ={
			value: RichTextEditor.createValueFromString(this.props.text, 'html')
		};
		this.handleChange = this.handleChange.bind(this);
		this.save = this.save.bind(this);
	}
	handleChange(value) {
		this.setState({value});
		if (this.props.onChange) {
			this.props.onChange(
				value.toString('html')
			);
		}
	}
	save(){
		this.setState({ edit: false });
		this.props.updateItems(this.props.itemId, this.state.value.toString('html'), this.props.toUpdate);
	}
	render() {
		return (
			<div className="rich-text-editor">
				<div>
					<RichTextEditor
						toolbarConfig={this.props.extended ? toolbarConfigFull : toolbarConfigSmoll}
						value={this.state.value}
						onChange={this.handleChange}
            placeholder={this.props.placeHolder}
            onBlur={this.save}/>
				</div>
			</div>
		);
	}
}
