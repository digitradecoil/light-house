import React, { Component } from 'react';
import MyCropper from '../tools/MyCropper';
import moment from 'moment';

import './UserLiveChat.scss';

export default class UserLiveChat extends Component {
	constructor(props){
		super(props);
		this.state = {
			userChat: true,
			moment: moment(),
			viewMessageSearch: false,
			message: "",
			messages: [],
			img: '',
			loader: false,
			userBlocked: false,
			tempMessage: ""
		}
		this.closeChat = this.closeChat.bind(this);
		this.postMessage = this.postMessage.bind(this);
		this._onKeyPress = this._onKeyPress.bind(this);
		this.getUserMessages = this.getUserMessages.bind(this);
		this.setWieved = this.setWieved.bind(this);
		this.addImg = this.addImg.bind(this);
		this.checkUserBlock = this.checkUserBlock.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
		this.getAdmins = this.getAdmins.bind(this);
	}
	componentDidMount(){
		localStorage.comments == "blocked" ? this.setState({userBlocked: "blocked"}) : null;
		this.getUserMessages(localStorage.user_id);
		this.interval = setInterval(() => {
			this.getUserMessages(localStorage.user_id);
			this.checkUserBlock(localStorage.user_id);
		}, 3000);
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	getAdmins(){
		this.setState({tempMessage: this.state.message});
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id
		};
		$.ajax({
			url: globalServer + 'send_chat_notification_to_admin.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.sendNotification(data);
		}.bind(this)).fail(function() { console.log('error'); });
	}
	sendNotification(data){
		let val = {
			from: localStorage.user_name,
			message: this.state.tempMessage,
			img: null,
			link: 'chat',
			player_ids: data
		}
		$.ajax({
			url: globalServer + 'send_push_notification.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({tempMessage: ''});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	checkUserBlock(id){
		let val = {
			id: id,
			token: localStorage.token,
			sess_id: localStorage.session_id
		}
		$.ajax({
			url: globalServer + 'check_user_block.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			data.Comments == "blocked" ? this.setState({userBlocked: data.Comments}) : this.setState({userBlocked: false});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	addImg(itemId, d) {
		this.setState({img: d.fileName, loader: true});
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id,
			fileName: d.fileName,
			img: d.Img
		};
		$.ajax({
			url: globalServer + 'chat_user_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.postMessage();
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	closeChat(){
		this.setState({userChat: false});
		setTimeout(() => { this.props.closeUserChat() }, 1000);
	}
	getUserMessages(id) {
		let val = {	id: id }
		$.ajax({
			url: globalServer + 'get_chat_user_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (JSON.stringify(data) !== JSON.stringify(this.state.messages)) {
				this.setState({messages: data, message: ""});
				this.setWieved();
				setTimeout(() => {
					let mWrapper = document.getElementById('mWrapper');
					mWrapper.scrollTop = mWrapper.scrollHeight + 100;
				}, 200);
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
	setWieved(){
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id
		}
		$.ajax({
			url: globalServer + 'set_viewed_chat_user_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {});
	}
	_onKeyPress(e){
		if(e.key == 'Enter'){
			this.postMessage();
			this.getAdmins();
		}
	}
	postMessage(){
		if (this.state.message || this.state.img) {
			let val = {
				userId: localStorage.user_id,
				token: localStorage.token,
				sess_id: localStorage.session_id,
				message: this.state.message,
				date: this.state.moment.format("DD/MM/YYYY, H:mm"),
				img: this.state.img ? this.state.img : null,
				adminMessage: null,
				viewed: null,
				hidden: null
			}
			$.ajax({
				url: globalServer + 'create_user_chat_message.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
				console.log(data);
				if (data.result == "success") {
					let messages = this.state.messages;
					messages.push(JSON.parse(data.msg));
					this.setState({messages, message: '', img: ''});
					setTimeout(() => {
						this.setState({loader: false});
						let mWrapper = document.getElementById('mWrapper');
						mWrapper.scrollTop = mWrapper.scrollHeight;
					}, 1000);
				} else { console.log('error') }
			}.bind(this)).fail(function() { console.log('error'); });
		}
	}
	isEmpty(obj) {
		for (let x in obj) { return false; }
		return true;
	}
	render(){
		return (
			<div className="user-live-chat-wrapp">
				<div onClick={this.closeChat} className="chat-fake-click"></div>
				<div className={this.state.userChat ? "user-live-chat slide-In-Left" : "user-live-chat slide-Out-Left"}>
					<div className="chat-wrapper">
						<div className="header">
							<div className="title-wrapp">
								<div className="info">
									<img src={globalFileServer + 'icons/open-chat.png'} alt="" />
									<span>צאט אונליין</span>
								</div>
								<div onClick={() => this.setState({viewMessageSearch: !this.state.viewMessageSearch})} className="message-search">
									<img src={ this.state.viewMessageSearch ? globalFileServer + 'icons/back.png' : globalFileServer + 'icons/search-white.png'} alt="" />
								</div>
								{this.state.viewMessageSearch ?
									<div className="message-search-result">
										<input type="text" />
										<img onClick={() => this.setState({viewMessageSearch: false})} src={globalFileServer + 'icons/exit.svg'} alt="" />
									</div> : null}
							</div>
						</div>
						<div className="chat-body">
							{this.state.loader ?
								<div className="loader-container">
									<div className="loader"></div>
								</div> : null}
							<div id="mWrapper" className="messages-wrapper">
								<div className="message-list">
									<div className='mess green'>
										<div className="img">
											<img src={globalFileServer + 'icons/logo-chat.svg'} alt="" />
										</div>
										<div className="text">
											<p className={this.state.messages && !this.state.messages.length ? 'animated bounceIn' : null}>{'שלום ' + localStorage.user_name + ' ! ברוכים הבאים לאתר שלנו ! במה אוכל לעזור? ?'}</p>
										</div>
									</div>
									{this.state.messages.map((element, index) => {
										let momentDate = moment(element.Date, 'DD/MM/YYYY, H:mm');
										if (!element.Hidden && element.Message || !element.Hidden && element.Img) {
											return (
												<div className={element.AdminMessage ? 'mess green' : 'mess blue'} key={index}>
													<div className="img">
														{element.AdminMessage ?
															<img src={globalFileServer + 'icons/logo-chat.svg'} alt="" />
														:
														<img src={globalFileServer + 'icons/user-chat.png'} alt="" />
														}
													</div>
													<div className="text">
														{element.Message ? <p className={element.animation ? 'animated bounceIn' : null}>{element.Message}</p> : null}
														{element.Img ? <img className={element.animation ? 'animated bounceIn' : null} src={globalFileServer + 'chat/' + element.Img} alt="" /> : null}
													</div>
													<div>
														{this.state.moment.format("DD/MM/YYYY") == momentDate.format("DD/MM/YYYY") ?
															<span className="date">{momentDate.format("H:mm")}</span>
														:
														<span className="date">{element.Date}</span>
														}
													</div>
												</div>
											)}
									})}
								</div>
							</div>
							{this.state.userBlocked != "blocked" ?
								<div className="send-message">
									<div className="type-message">
										<input type="text"
											value={this.state.message}
											onChange={(e) => this.setState({message: e.target.value})}
											onKeyPress={this._onKeyPress}
										placeholder="הזן טקסט הודעה" />
									</div>
									<button onClick={() => (this.postMessage(), this.getAdmins())} className="send-message-button">
										<img src={globalFileServer + 'icons/send-message.svg'} alt="" />
									</button>
									<MyCropper
										itemId={localStorage.user_id}
										folder='chat'
										uploadImg={this.addImg}
										ratio={16 / 12.5}
									/>
								</div>
								:
								<div className="send-message dissabled">
									<div className="type-message">
										<input type="text" placeholder="הזן טקסט הודעה" />
									</div>
									<button className="send-message-button">
										<img src={globalFileServer + 'icons/send-message.svg'} alt="" />
									</button>
									<button className="attach">
										<img src={globalFileServer + 'icons/attach.svg'} alt="" />
									</button>
								</div>
								}
						</div>
					</div>
					<div onClick={this.closeChat} className="close-chat">
						<img src={globalFileServer + 'icons/close-chat.svg'} alt="" />
					</div>
				</div>
			</div>
		)
	}
}
