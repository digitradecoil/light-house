import React, { Component } from 'react';
import MyCropper from '../tools/MyCropper';
import moment from 'moment';
import Autosuggest from 'react-autosuggest';


const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
	<div className="hello"><span>{suggestion.ContactName} / </span><span>{suggestion.UserName}</span></div>
);

export default class LiveChat extends Component {
	constructor(props){
		super(props);
		this.state = {
			moment: moment(),
			userList: [],
			viewMessageSearch: false,
			message: "",
			messages: [],
			selectedUser: [],
			lastMessages: [],
			notViewed: [],
			openDetails: false,
			value: '',
			suggestions: [],
			img: '',
			loader: false,
			userDetails: false,
			viewMode: false,
			mobile: false,
			tempMessage: ''
		}
		this.getUsers = this.getUsers.bind(this);
		this.postMessage = this.postMessage.bind(this);
		this._onKeyPress = this._onKeyPress.bind(this);
		this.getUserMessages = this.getUserMessages.bind(this);
		this.getLastMessages = this.getLastMessages.bind(this);
		this.getNotViewed = this.getNotViewed.bind(this);
		this.setVieved = this.setVieved.bind(this);
		this.messageSearch = this.messageSearch.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.createEmptyMessage = this.createEmptyMessage.bind(this);
		this.addImg = this.addImg.bind(this);
		this.getUserAppId = this.getUserAppId.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
	}
	componentDidMount(){
		this.getUsers();
		this.getLastMessages();
		this.getNotViewed();
		this.interval = setInterval(() => {
			if (!this.state.value) {
				this.getLastMessages();
				this.getNotViewed();
			}
			if (!this.isEmpty(this.state.selectedUser)) {
				this.getUserMessages(this.state.selectedUser.Id)
			}
		}, 3000);
		if (window.innerWidth < 1000) {
			this.setState({mobile: true});
			document.getElementById('footer').style.display = "none";
		}
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	getUserAppId(data) {
		let val = {	user_id: data.userId };
		$.ajax({
			url: globalServer + 'get_user_app_id.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.sendNotification(data.data, d);
			}
		}.bind(this, data)).fail(function() { console.log('error'); });
	}
	sendNotification(id, message){
		let player_ids = [];
		player_ids.push(id);
		let val = {
			from: 'LFA your shop',
			message: message.message ? message.message : 'new message from chat',
			img: message.img ? globalFileServer + 'chat/' + message.img : null,
			link: null,
			player_ids: player_ids
		}
		$.ajax({
			url: globalServer + 'send_push_notification.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	blockUser(info){
		let val = {
			userId: this.state.selectedUser.Id,
			blocked: info,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'block_chat_user.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let userList = this.state.userList;
				userList.find(x=> x.Id == d.userId).Comments = d.blocked;
				let selectedUser = this.state.selectedUser;
				selectedUser.Comments = d.blocked;
				this.setState({userList, selectedUser});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	addImg(itemId, d) {
		this.setState({img: d.fileName, loader: true});
		let val = {
			fileName: d.fileName,
			img: d.Img,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'chat_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.postMessage();
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	getSuggestions(value) {
		let lM = [];
		this.state.lastMessages.map((element, index) => {
			let user = this.state.userList.filter((elem) => { return elem.Id == element.UserId });
			lM.push(user[0]);
		});
		let filteredUsers = this.state.userList.filter(val => !lM.includes(val));
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		return inputLength === 0 ? [] : filteredUsers.filter(user =>
			user.ContactName.toLowerCase().slice(0, inputLength) === inputValue
		);
	}
	onChange(event, { newValue }) {
		this.setState({	value: newValue	});
	}
	onSuggestionsFetchRequested({ value }) {
		this.setState({	suggestions: this.getSuggestions(value)	});
	}
	onSuggestionsClearRequested() {
		this.setState({	suggestions: [], value: "" });
	}
	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		if (method == "click" || method == "enter") {
			this.setState({selectedUser: suggestion});
			this.createEmptyMessage(suggestion.Id);
		}
	}
	getNotViewed(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		}
		$.ajax({
			url: globalServer + 'admin_not_viewed_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({notViewed: data});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getLastMessages(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		}
		$.ajax({
			url: globalServer + 'user_list_last_message.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let lastMessages = data;
			lastMessages.sort(this.compare);
			this.setState({lastMessages});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	compare(a,b) {
		if (a.Id > b.Id)
			return -1;
		if (a.Id < b.Id)
			return 1;
		return 0;
	}
	messageSearch(e){
		let messages = this.state.messages;
		let word = e.target.value;
		let sortMessages = this.state.messages.filter((elem) => { return elem.Message.substring(0, word.length) == word });
		this.setState({messages: sortMessages});
	}
	setVieved(){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			userId: this.state.selectedUser.Id
		}
		$.ajax({
			url: globalServer + 'set_viewed_chat_admin_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	selectUser(element) {
		this.setState({selectedUser: element});
		if(this.state.openDetails && this.state.openDetails != element.Id) {
			this.setState({openDetails: false});
		}
		this.getUserMessages(element.Id);
	}
	getUserMessages(id) {
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			id: id
		}
		$.ajax({
			url: globalServer + 'get_chat_user_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (JSON.stringify(data) !== JSON.stringify(this.state.messages)) {
				this.setState({messages: data, message: ""});
				this.setVieved();
				setTimeout(() => {
					let mWrapper = document.getElementById('mWrapper');
					mWrapper.scrollTop = mWrapper.scrollHeight;
				}, 200);
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
	_onKeyPress(e){
		if(e.key == 'Enter'){
			this.postMessage();
		}
	}
	postMessage(){
		if (this.state.message || this.state.img) {
			let val = {
				role: localStorage.role,
				token: localStorage.token,
				userId: this.state.selectedUser.Id,
				adminId: localStorage.adminId,
				message: this.state.message ? this.state.message : null,
				date: this.state.moment.format("DD/MM/YYYY, H:mm"),
				img: this.state.img ? this.state.img : null,
				adminMessage: "1",
				viewed: null
			};
			this.getUserAppId(val);
			$.ajax({
				url: globalServer + 'create_chat_message.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
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
	createEmptyMessage(UserId){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			userId: UserId,
			adminId: localStorage.adminId,
			message: this.state.message,
			date: this.state.moment.format("DD/MM/YYYY, H:mm"),
			img: this.state.img ? this.state.img : null,
			adminMessage: "1",
			viewed: 1
		}
		$.ajax({
			url: globalServer + 'create_chat_message.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
				let messages = this.state.messages;
				messages.push(JSON.parse(data.msg));
				this.setState({messages, message: ""});
				let mWrapper = document.getElementById('mWrapper');
				mWrapper.scrollTop = mWrapper.scrollHeight;
			} else { console.log('error') }
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getUsers(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'user_list.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({userList: data});
		}.bind(this)).fail(function() { console.log('error'); });
	}

	isEmpty(obj) {
		for (let x in obj) { return false; }
		return true;
	}
	render(){
		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: 'תתחיל למלא את השם משתמש',
			value,
			onChange: this.onChange
		}
		return (
			<div className="page-container admin-chat">
				{!this.state.mobile ?
					<div className="wrapper desctop">
						<h1 className="title">צאט</h1>
						<div className="chat-wrapper">
							<div className="header flex-container">
								<div className="col-lg-4">
									<div className="search">
										<img src={globalFileServer + 'icons/search-white.png'} alt="" />
										<Autosuggest
											suggestions={suggestions}
											onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
											onSuggestionSelected={this.onSuggestionSelected}
											onSuggestionsClearRequested={this.onSuggestionsClearRequested}
											getSuggestionValue={getSuggestionValue}
											renderSuggestion={renderSuggestion}
											inputProps={inputProps}
											highlightFirstSuggestion={true}
										/>
									</div>
								</div>
								<div className="col-lg-8">
									<ul className="info">
										<li>יולי יוסיפוביץ</li>
										<li>הודעה אחרונה 15 ביולי 2016</li>
									</ul>
									<div onClick={() => this.setState({viewMessageSearch: !this.state.viewMessageSearch})} className="message-search">
										<img src={ this.state.viewMessageSearch ? globalFileServer + 'icons/back.png' : globalFileServer + 'icons/search-white.png'} alt="" />
									</div>
									{this.state.viewMessageSearch ?
										<div className="message-search-result">
											<input onChange={this.messageSearch} type="text" />
											<img onClick={() => this.setState({viewMessageSearch: false})} src={globalFileServer + 'icons/close-blue.png'} alt="" />
										</div> : null}
								</div>
							</div>
							<div className="chat-body flex-container">
								<div className="col-lg-4">
									<div className="user-list">
										{this.state.lastMessages && this.state.lastMessages.length ? this.state.lastMessages.map((element, index) => {
											let user = this.state.userList.filter((elem) => { return elem.Id == element.UserId });
											let momentDate = moment(element.Date, 'DD/MM/YYYY, H:mm');
											let count = [];
											return (
												<div
													onClick={this.selectUser.bind(this, user[0])}
													className={this.state.selectedUser && this.state.selectedUser.Id && this.state.selectedUser.Id == element.UserId ? "user-list-wrapp active" : "user-list-wrapp"} key={index}>
													<div className="details">
														<div className="img">
															{user[0].Comments && user[0].Comments == "blocked" ? <span><img className="lock-icon" src={globalFileServer + 'icons/lock.png'} alt="" /></span> :
															<span>{user[0].ContactName.substring(0,1)}</span>
															}
														</div>
														<div className="text">
															<h3>{user[0].ContactName}</h3>
															{element.Message ?
																<p>{element.Message.substring(0,25)}{element.Message.length > 24  ? <span> ...</span> : null}</p>
															: element.Img ? <p>תמונה</p> : <p>צאט חדש</p> }
														</div>
													</div>
													<div className="info">
														{this.state.moment.format("DD/MM/YYYY") == momentDate.format("DD/MM/YYYY") ?
															<span className="date">{momentDate.locale('he').format("H:mm")}</span>
														:
														<span className="date">{momentDate.locale('he').format("MMM Do")}</span>
														}
														<div className="count">
															{this.state.notViewed && this.state.notViewed.length ? this.state.notViewed.map((elem, ind) => { if (elem.UserId == user[0].Id) { count.push(elem) } }) : null}
															<span style={count.length ? {display: 'block'} : {display: 'none'}}>{count.length ? count.length : null}</span>
														</div>
														<div
															onClick={() => this.state.openDetails == element.Id ? this.setState({openDetails: false}) : this.setState({openDetails: element.Id})}
															className={this.state.openDetails && this.state.openDetails == element.Id ? "actions fixed" : "actions"}>
															<img src={globalFileServer + 'icons/angle-arrow-down.png'} alt="" />
														</div>
														<div className={this.state.openDetails && this.state.openDetails == element.Id ? "details-wrapper fixed" : "details-wrapper"}>
															<ul>
																<li onClick={()=> this.setState({userDetails: true})} >פרטים על השולח</li>
																{user[0].Comments && user[0].Comments == "blocked" ?
																	<li onClick={this.blockUser.bind(this, null)}>החזר משתמש לצא'ט</li>
																:
																<li onClick={this.blockUser.bind(this, 'blocked')}>הסר משתמש מהצא'ט</li>
																}
															</ul>
														</div>
													</div>
												</div>
											)
										}) : null}
									</div>
								</div>
								<div className="col-lg-8">
									{this.state.loader ?
										<div className="loader-container">
											<div className="loader"></div>
										</div> : null}
									<div id="mWrapper" className="message-list">
										{this.state.messages.length ? this.state.messages.map((element, index) => {
											let momentDate = moment(element.Date, 'DD/MM/YYYY, H:mm');
											if (element.Message || element.Img) {
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
										})
										:
										<div className="preview">
											<img src={globalFileServer + 'icons/logo-chat.svg'} alt="" />
										</div>
										}
									</div>
									{!this.isEmpty(this.state.selectedUser) ?
										<div className="send-message">
											<div className="type-message">
												<input type="text"
													value={this.state.message}
													onChange={(e) => this.setState({message: e.target.value})}
													onKeyPress={this._onKeyPress}
												placeholder="הזן טקסט הודעה" />
											</div>
											<button onClick={this.postMessage} className="send-message-button">
												<img src={globalFileServer + 'icons/send-message.png'} alt="" />
											</button>
											<MyCropper
												itemId={this.state.selectedUser.Id}
												folder={'chat'}
												uploadImg={this.addImg}
												ratio={16 / 12.5}
											/>
										</div> : null}
								</div>
							</div>
						</div>
					</div> :
					<div className="wrapper mobile">
						<h1 className="title">צאט</h1>
						<div className="chat-wrapper">
							<div className="header">
								<div className="chat-header">
									<div className="search">
										<img src={globalFileServer + 'icons/search-white.png'} alt="" />
										<Autosuggest
											suggestions={suggestions}
											onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
											onSuggestionSelected={this.onSuggestionSelected}
											onSuggestionsClearRequested={this.onSuggestionsClearRequested}
											getSuggestionValue={getSuggestionValue}
											renderSuggestion={renderSuggestion}
											inputProps={inputProps}
											highlightFirstSuggestion={true}
										/>
									</div>
									{this.state.viewMode ?
										<div className="back" onClick={() => this.setState({viewMode: false})}>
											<img src={globalFileServer + 'icons/left-arrow.png'} alt="" />
										</div> : null}
								</div>
							</div>
							<div className="chat-body flex-container">
								<div className={this.state.viewMode ? "col-lg-4 active" : "col-lg-4"}>
									<div className="user-list">
										{this.state.lastMessages && this.state.lastMessages.length ? this.state.lastMessages.map((element, index) => {
											let user = this.state.userList.filter((elem) => { return elem.Id == element.UserId });
											let momentDate = moment(element.Date, 'DD/MM/YYYY, H:mm');
											let count = [];
											return (
												<div
													onClick={this.selectUser.bind(this, user[0])}
													className={this.state.selectedUser && this.state.selectedUser.Id && this.state.selectedUser.Id == element.UserId ? "user-list-wrapp active" : "user-list-wrapp"} key={index}>
													<div onClick={() => this.setState({viewMode: true})} className="details">
														<div className="img">
															{user[0].Comments && user[0].Comments == "blocked" ? <span><img className="lock-icon" src={globalFileServer + 'icons/lock.png'} alt="" /></span> :
															<span>{user[0].ContactName.substring(0,1)}</span>
															}
														</div>
														<div className="text">
															<h3>{user[0].ContactName}</h3>
															{element.Message ?
																<p>{element.Message.substring(0,25)}{element.Message.length > 24  ? <span> ...</span> : null}</p>
															: element.Img ? <p>תמונה</p> : <p>צאט חדש</p> }
														</div>
													</div>
													<div className="info">
														{this.state.moment.format("DD/MM/YYYY") == momentDate.format("DD/MM/YYYY") ?
															<span className="date">{momentDate.locale('he').format("H:mm")}</span>
														:
														<span className="date">{momentDate.locale('he').format("MMM Do")}</span>
														}
														<div className="count">
															{this.state.notViewed && this.state.notViewed.length ? this.state.notViewed.map((elem, ind) => { if (elem.UserId == user[0].Id) { count.push(elem) } }) : null}
															<span style={count.length ? {display: 'block'} : {display: 'none'}}>{count.length ? count.length : null}</span>
														</div>
														<div
															onClick={() => this.state.openDetails == element.Id ? this.setState({openDetails: false}) : this.setState({openDetails: element.Id})}
															className={this.state.openDetails && this.state.openDetails == element.Id ? "actions fixed" : "actions"}>
															<img src={globalFileServer + 'icons/angle-arrow-down.png'} alt="" />
														</div>
														<div className={this.state.openDetails && this.state.openDetails == element.Id ? "details-wrapper fixed" : "details-wrapper"}>
															<ul>
																<li onClick={()=> this.setState({userDetails: true})} >פרטים על השולח</li>
																{user[0].Comments && user[0].Comments == "blocked" ?
																	<li onClick={this.blockUser.bind(this, null)}>החזר משתמש לצא'ט</li>
																:
																<li onClick={this.blockUser.bind(this, 'blocked')}>הסר משתמש מהצא'ט</li>
																}
															</ul>
														</div>
													</div>
												</div>
											)
										}) : null}
									</div>
								</div>
								<div className={this.state.viewMode ? "col-lg-8 active" : "col-lg-8"}>
									{this.state.loader ?
										<div className="loader-container">
											<div className="loader"></div>
										</div> : null}
									<div id="mWrapper" className="message-list">
										{this.state.messages.length ? this.state.messages.map((element, index) => {
											let momentDate = moment(element.Date, 'DD/MM/YYYY, H:mm');
											if (element.Message || element.Img) {
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
										})
										:
										<div className="preview">
											<img src={globalFileServer + 'icons/chat_bg.png'} alt="" />
										</div>
										}
									</div>
									{!this.isEmpty(this.state.selectedUser) ?
										<div className="send-message">
											<div className="type-message">
												<input type="text"
													value={this.state.message}
													onChange={(e) => this.setState({message: e.target.value})}
													onKeyPress={this._onKeyPress}
												placeholder="הזן טקסט הודעה" />
											</div>
											<button onClick={this.postMessage} className="send-message-button">
												<img src={globalFileServer + 'icons/send-message.png'} alt="" />
											</button>
											<MyCropper
												itemId={this.state.selectedUser.Id}
												uploadImg={this.addImg}
												folder={'chat'}
												ratio={16 / 12.5}
											/>
										</div> : null}
								</div>
							</div>
						</div>
					</div> }
				{this.state.userDetails ?
					<div className="popup" id="popup-detail">
						<div className="popup-wrapper">
							<div className="wrapp">
								<div onClick={()=> this.setState({userDetails: false})} className="close-popup">
									<img src={globalFileServer + 'icons/cancel.png'} alt="" />
								</div>
								<div>
									{!this.isEmpty(this.state.selectedUser) ?
									<ul>
										<li><span className="name">שם איש קשר: </span><span className="detail">{this.state.selectedUser.ContactName}</span></li>
										<li><span className="name">שם העסק: </span><span className="detail">{this.state.selectedUser.BusinessName}</span></li>
										<li><span className="name">ח.פ/ ע.מ: </span><span className="detail">{this.state.selectedUser.UserName}</span></li>
										<li><span className="name">כתובת מייל: </span><span className="detail">{this.state.selectedUser.Email}</span></li>
										<li><span className="name">טלפון: </span><span className="detail">{this.state.selectedUser.Phone}</span></li>
										<li><span className="name">כתובת: </span><span className="detail">{this.state.selectedUser.Address}</span></li>
									</ul> : null }
								</div>
							</div>
						</div>
					</div>
				: null}
			</div>
		)
	}
}
