import ReactDOM from "react-dom";
import React, {Component} from 'react';
import Cropper from 'react-cropper';
import SweetAlert from 'sweetalert2';

import jic from '../../globals.js';

let target_img;
var date = new Date();

export default class MyCropperNext extends Component {
	constructor(props){
		super(props);
		this.state = {
			croppTool: false,
			src: '',
			fileName: '',
			preview: '',
			cropped: false,
			preload: false
		}
		this._onChange = this._onChange.bind(this);
		this._crop = this._crop.bind(this);
		this._cropChange = this._cropChange.bind(this);
		this.save = this.save.bind(this);
		this.cansel = this.cansel.bind(this);
	}
	componentDidMount(){}
	save(){
		$('body').removeClass('fix');
		let	itemImg = {
			img: this.state.preview,
			fileName: this.state.fileName,
			itemId: this.props.itemId,
			folder: this.props.folder
		};
		if (this.props.makat) itemImg.fileName = this.props.makat + '_' + this.state.fileName;
		this.props.dist ? itemImg.paramName = this.props.dist : null;
		this.setState({
			croppTool: false,
			src: '',
			fileName: '',
			preview: ''
		});
		this.props.uploadImg(itemImg);
	}
	cansel(){
		$('body').removeClass('fix');
		this.setState({
			croppTool: false,
			src: '',
			fileName: '',
			preview: ''
		});
		this.props.unsetPreload();
	}
	_onChange(e) {
		e.preventDefault();
		if (e.target.files.length) {
			$('body').addClass('fix');
			this.props.setPreload();
			let ext = e.target.files[0].name.split(".");
			let fileName = new Date().toLocaleTimeString('he-Il', { hour: 'numeric', minute: 'numeric', second: 'numeric'}).split(':').join('') + ".jpg";
			if (this.props.svg) {
				fileName = new Date().toLocaleTimeString('he-Il', { hour: 'numeric', minute: 'numeric', second: 'numeric'}).split(':').join('') + ".svg";
			}
			let files;
			if (e.dataTransfer) {
			files = e.dataTransfer.files;
			} else if (e.target) {
				files = e.target.files;
			}
			if (files[0].size > 9000000) {
				SweetAlert({
					title: 'הקובץ חורג מהמשקל 8 mb',
					text: 'יש לנסות להעלות קובץ שוב',
					type: 'info',
					timer: 3000,
					showConfirmButton: false
				}).catch(SweetAlert.noop);
				this.props.unsetPreload();
			} else {
				let reader = new FileReader();
				reader.onload = () => {
					this.setState({
						fileName: fileName,
						preview: reader.result,
						src: reader.result,
						croppTool: true
					});
				};
				reader.readAsDataURL(files[0]);
				this.setState({	fileSize: files[0].size });
				// setTimeout(() => {
				// 	let element = document.getElementById('cropp_view');
				// 	element.scrollIntoView({block: "end"});
				// }, 200);
			}
		}
	}
	_cropChange(){
		this.state.cropped ? this.setState({cropped: false}) : null;
	}
	_crop(){
		this.setState({preload: true});
		let preview = this.refs.cropper.getCroppedCanvas({'fillColor': '#FFFFFF'}).toDataURL('image/jpeg');
		var image = document.createElement('img');
		image.src = preview;
		var quality;
		var fileSize = this.state.fileSize;
		image.onload = () => {
			if (fileSize) {
				fileSize < 8000000 && fileSize > 6000000 ? quality = 30 : null;
				fileSize < 6000000 && fileSize > 4000000 ? quality = 70 : null;
				fileSize < 4000000 && fileSize > 1000000 ? quality = 80 : null;
				fileSize < 1000000 ? quality = 80 : null;
			} else {
				quality = 100;
			}
			var output_format = 'jpg';
			target_img = jic.compress(image,quality,output_format);
		}
		this.interval = setInterval(() => {
			if (target_img) {
				this.setState({	preview: target_img.src, cropped: true, preload: false });
				clearInterval(this.interval);
				target_img = "";
			}
		}, 100);
	}
	render() {
		return (
			<div className="load-image-wrapper">
				{this.props.product ?
					<div className="addImg-custom">
						<div className="plus">
							<img src={globalFileServer + 'icons/plus-white.svg'} />
						</div>
						<input id="upload-file" type="file" className="upload" onChange={this._onChange} />
					</div>
				:
				<div className="add-img">
					<img src={globalFileServer + 'icons/upload.svg'} />
					<span>העלאת תמונה</span>
					<input id="upload-file" type="file" className="upload" onChange={this._onChange} />
				</div>
				}
				{this.state.croppTool ? ReactDOM.createPortal(
					<div className="cropp-tool-wrapper">
						<div className="cropp-tool">
							{this.state.preload ?
								<div className="spinner-wrapper">
									<div className="spinner">
										<div className="bounce1"></div>
										<div className="bounce2"></div>
										<div className="bounce3"></div>
									</div>
								</div>
							: null}
							<div className="flex-container">
								<div id="cropp_view" className="col-lg-6 for-cropp">
									<Cropper
										src={this.state.src}
										aspectRatio={this.props.aspectRatio}
										guides={false}
										checkCrossOrigin={false}
										ref='cropper'
										crop={this._cropChange}
									/>
								</div>
								<div className="col-lg-6">
									<div className='image-preview'>
										<img src={this.state.preview} />
									</div>
								</div>
							</div>
							<ul className="actions">
								<li>
									{this.state.cropped ?
										<button onClick={this.save} className="button-green">שמור</button>
									:
									<button onClick={this._crop.bind(this, true)} className="button-green">גזור</button>
									}
								</li>
								<li><button onClick={this.cansel} className="button-red">ביטול</button></li>
							</ul>
						</div>
					</div>,
					document.getElementById('modal-root')
				)
				: null}
			</div>
		);
	}
}
