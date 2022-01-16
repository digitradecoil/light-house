import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';
import SweetAlert from 'sweetalert2';
import MyCropper from '../../tools/MyCropper';
import AddRecommendedProduct from '../productPage/AddRecommendedProduct';
import moment from 'moment';

import './Message.scss';

const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
	<div className="hello"><span>{suggestion.ContactName} / </span><span>{suggestion.UserName}</span></div>
);

export default class Message extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: "",
			message: "",
			link: "",
			users: [],
			value: '',
			suggestions: [],
			userList: [],
			selectedUsers: [],
			popup: false,
			selectedProducts: [],
			mainImg: "",
			sendToAll: true,
			isSent: null,
			lastSend: "",
			moment: moment(),
			selProdId: []
		}
		this.getUsers = this.getUsers.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.createNewMessage = this.createNewMessage.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.createUserMessages = this.createUserMessages.bind(this);
		this.getSelectedProducts = this.getSelectedProducts.bind(this);
		this.getUserAppId = this.getUserAppId.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
	}
	componentDidMount(){
		this.getUsers();
	}
	getUserAppId(data) {
		let val = {	user_id: data.userId };
		$.ajax({
			url: globalServer + 'get_user_app_ids.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result != "error") {
				let userIds = [];
				d.sendToAll != "1" ? userIds = d.userId.split(',') : null;
				let appIds = [];
				let val = {
					message: d.message,
					img: d.img,
					title: d.title
				}
				if (d.sendToAll == "1") {
					let appId = data.filter((element) => { return !element.Disagree });
					if (appId.length) {
						appId.map((element, index) => {
							appIds.push(element.AppId)
						});
					}

				} else {

					for (var i = 0; i < userIds.length; i++) {

						let appId = data.filter((element) => { return element.UserId == userIds[i] && !element.Disagree });

						appId.length ? appIds.push(appId[0].AppId) : null;

					}

				}
				appIds.length ? this.sendNotification(appIds, val) : null;
			}
		}.bind(this, data)).fail(function() { console.log('error'); });
	}
	sendNotification(id, data){
		let player_ids = [];
		let val = {
			from: data.title ? 'LFA - ' + data.title : 'LFA your shop',
			message: data.message ?  data.message : 'you have a new message',
			img: data.img ? globalFileServer + 'messages/' + data.img : null,
			link: 'notification',
			player_ids: id
		}
		$.ajax({
			url: globalServer + 'send_push_notification.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	sendMessage(){
		this.setState({	isSent: 1, lastSend: this.state.moment.format("DD/MM/YYYY")	});

		let productIds = this.state.selectedProducts.map((element) => { return element.Id });
		let userIds = this.state.selectedUsers.map((element) => { return element.Id });
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			title: this.state.title,
			message: this.state.message,
			productIds: productIds.join(),
			link: this.state.link,
			sendToAll: this.state.sendToAll,
			userIds: userIds.join(),
			img: this.state.mainImg,
			isSent: 1,
			lastSend: this.state.moment.format("DD/MM/YYYY"),
			creationDate: this.state.moment.format("DD/MM/YYYY"),
			publishedAt: true
		}
		$.ajax({
			url: globalServer + 'create_new_message.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
				let notice = JSON.parse(data.notice);
				this.createUserMessages(notice);
			} else { console.log('error') }
		}.bind(this)).fail(function() { console.log('error'); });
	}
	createUserMessages(data) {
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			userId: data.UserIds,
			sendToAll: this.state.sendToAll,
			messageId: data.Id,
			title: data.Title,
			message: data.Message,
			ProductIds: data.ProductIds,
			link: data.Link,
			img: data.Img,
			creationDate: this.state.moment.format("H:s DD/MM/YYYY")
		}
		this.getUserAppId(val);
		$.ajax({
			url: globalServer + 'create_users_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data, d) {
			let notice = data;
			if (d.result == "success") {
				SweetAlert({
					title: 'ההודעה נשלחה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(
					function () {},
					function (dismiss) {
						if (dismiss === 'timer') {
							this.props.parent.closeMessagePopup(notice);
						}
					}.bind(this)
				)
			} else { console.log('error') }

		}.bind(this, data)).fail(function(d) { console.log("error"); });
	}
	createNewMessage(){
		let productIds = this.state.selectedProducts.map((element) => { return element.Id });
		let userIds = this.state.selectedUsers.map((element) => { return element.Id });
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			title: this.state.title,
			message: this.state.message,
			productIds: productIds.join(),
			link: this.state.link,
			sendToAll: this.state.sendToAll,
			userIds: userIds.join(),
			img: this.state.mainImg,
			isSent: null,
			lastSend: null,
			creationDate: this.state.moment.format("DD/MM/YYYY"),
			publishedAt: null
		}
		$.ajax({
			url: globalServer + 'create_new_message.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
				let notice = JSON.parse(data.notice);
				SweetAlert({
					title: 'הודעתך נשמרה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(
					function () {},
					function (dismiss) {
						if (dismiss === 'timer') {
							this.props.parent.closeMessagePopup(notice);
						}
					}.bind(this)
				)
			} else { console.log('error') }
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getSelectedProducts(ids){
		let val = { 'id': ids };
		$.ajax({
			url: globalServer + 'recommended_products_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let selProdId = data.map((element) => {
				return element.Id;
			});
			this.setState({ selectedProducts: data, selProdId: selProdId.join()});
		}.bind(this)).fail(function(d) { console.log("error"); });
	}
	closePopup(data){
		if (data) {
			this.getSelectedProducts(data);
			this.setState({popup: false});
		} else {
			this.setState({popup: false, selectedProducts:[]});
		}
	}
	deleteProduct(id) {
		let selectedProducts = this.state.selectedProducts.filter((element) => { return element.Id != id });
		this.setState({selectedProducts});
	}
	uploadImg(itemId, d){
		let val = {
			id: itemId,
			fileName: d.fileName,
			img: d.Img,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'message_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.setState({mainImg: d.fileName});
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
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
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;
		return inputLength === 0 ? [] : this.state.userList.filter(user =>
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
			let selectedUsers = this.state.selectedUsers;
			selectedUsers.push(suggestion);
			let userList = this.state.userList.filter((elem) => { return elem.Id != suggestion.Id });
			this.setState({selectedUsers, userList});
		}
	}
	deleteUser(element){
		let userList = this.state.userList;
		userList.push(element);
		let selectedUsers = this.state.selectedUsers.filter((elem) => { return elem.Id != element.Id });
		this.setState({selectedUsers, userList});
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
			<div>
				<div className="popup" id="massage-popup">
					<div className="popup-wrapper">
						<div className="wrapp">
							<div onClick={()=> this.props.parent.closeMessagePopup()} className="close-popup">
								<img src={globalFileServer + 'icons/close-white.svg'} alt="" />
							</div>
							<div className="massage-container">
								<div className="form">
									<input type="text"
										value={this.state.title}
										onChange={(e) => this.setState({title: e.target.value})}
										placeholder="כותרת ההודעה"
									/>
									<textarea value={this.state.message} onChange={(e) => this.setState({message: e.target.value})} placeholder="מלל הודעה"></textarea>
									<div onClick={() => this.setState({popup: true})} className="select-product">
										<span>להוסיף מוצרים</span>
										<img src={globalFileServer + 'icons/add-circular-button.svg'} alt="" />
									</div>
									<div className="selected-users selected-products">
										<ul>
											{this.state.selectedProducts ? this.state.selectedProducts.map((element, index) => {
												return (
													<li className="animated bounceIn" key={index}>
														<span>{element.ProdName}</span>
														<span onClick={this.deleteProduct.bind(this, element.Id)} className="delete">
															<img src={globalFileServer + 'icons/close.svg'} />
														</span>
													</li>
												)
											}): null}
										</ul>
									</div>
									<input type="text"
										value={this.state.link}
										onChange={(e) => this.setState({link: e.target.value})}
										placeholder="לינק חופשי"
									/>
									<div className="selection">
										<div className="select-users">
											{this.state.sendToAll ?
												<input type="text" disabled placeholder="תתחיל למלא את השם משתמש" />
											:
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
											}
										</div>
										<div className="select-oll">
											<span>או בחר כולם</span>
											<div className="checkboxes-and-radios">
												<input type="checkbox"
													onChange={(e) => e.target.checked ? this.setState({sendToAll: 1}) : this.setState({sendToAll: 0})}
													name="checkbox-cats" checked={this.state.sendToAll}
												id="checkbox_2" value="2" />
												<label htmlFor="checkbox_2"></label>
											</div>
										</div>
									</div>
									<div className="selected-users">
										<ul>
											{this.state.selectedUsers.map((element, index) => {
												if (!this.state.sendToAll) {
													return (
														<li className="animated bounceIn" key={index}>
															<span>{element.ContactName}</span>
															<span onClick={this.deleteUser.bind(this, element)} className="delete">
																<img src={globalFileServer + 'icons/close.svg'} />
															</span>
														</li>
													)}
											})}
										</ul>
									</div>
									<div className="add-image">
										<MyCropper
											itemId={1}
											img={this.state.mainImg ? 'messages/' + this.state.mainImg : "messages/empty.jpg"}
											uploadImg={this.uploadImg}
											folder='messages'
											toUpdate='Img'
											ratio={16 / 12.5}
										/>
									</div>
									<div className="save-arr">
										<button onClick={this.sendMessage} className="save-and-send">שמור ושלח</button>
										<button onClick={this.createNewMessage} className="save">שמור</button>
									<button className="cancel">בטל</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				</div>
				{this.state.popup ? <AddRecommendedProduct closePopup={this.closePopup} selectedProducts={!this.isEmpty(this.state.selProdId) ? this.state.selProdId : "0"} /> : null}
			</div>
		)
	}
}
