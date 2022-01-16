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

export default class EditMessage extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: this.props.notice.Title,
			message: this.props.notice.Message,
			link: this.props.notice.Link,
			users: [],
			value: '',
			suggestions: [],
			userList: [],
			selectedUsers: [],
			popup: false,
			selectedProducts: [],
			mainImg: this.props.notice.Img,
			sendToAll: false,
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
		this.getSelectedUsers = this.getSelectedUsers.bind(this);
		this.getSelectedProducts = this.getSelectedProducts.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.createUserMessages = this.createUserMessages.bind(this);
		this.getUserAppId = this.getUserAppId.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
	}
	componentDidMount(){
		this.getUsers();
		this.getSelectedProducts(this.props.notice.ProductIds);
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
				d.userId != "allUsers" ? userIds = d.userId.split(',') : null;
				let appIds = [];
				let val = {
					message: d.message,
					img: d.img,
					title: d.title
				}
				if (d.userId == "allUsers") {

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
			from: data.title ? 'LFA - ' + data.title : 'ASPIN',
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
	updateItems(itemId, text, paramName){
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'message_edit.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.props.updateResult(d);
			} else {console.log('nothing change')}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	sendMessage(){
		this.updateItems(this.props.notice.Id, 1, 'IsSent');
		this.updateItems(this.props.notice.Id, 1, 'PublishedAt');
		this.updateItems(this.props.notice.Id, this.state.moment.format("DD/MM/YYYY"), 'LastSend');
		this.createUserMessages();
	}
	createUserMessages() {
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			userId: this.props.notice.SendToAll ? 'allUsers' : this.props.notice.UserIds,
			messageId: this.props.notice.Id,
			title: this.props.notice.Title,
			message: this.props.notice.Message,
			ProductIds: this.props.notice.ProductIds,
			link: this.props.notice.Link,
			img: this.props.notice.Img,
			creationDate: this.state.moment.format("H:s DD/MM/YYYY")
		}
		this.getUserAppId(val);
		$.ajax({
			url: globalServer + 'create_users_messages.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			SweetAlert({
				title: 'ההודעה נשלחה בהצלחה',
				type: 'success',
				timer: 3000,
				showConfirmButton: false,
			}).then(
				function () {},
				function (dismiss) {
					if (dismiss === 'timer') {
						this.props.close();
					}
				}.bind(this)
			)
		}.bind(this)).fail(function(d) { console.log("error"); });
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
	getSelectedUsers(list){
		let users = this.props.notice.UserIds.split(',');
		let selectedUsers = users.map((element) => {
			let user = list.filter((elem) => { return element == elem.Id });
			return user[0];
		});
		let userList = list;
		for (var i = 0; i < users.length; i++) {
			userList = userList.filter((element) => { return element.Id != users[i]});
		}
		if (selectedUsers[0]) {
			this.setState({selectedUsers, userList});
		}
	}
	closePopup(data){
		if (data) {
			this.updateItems(this.props.notice.Id, data, 'ProductIds');
			this.getSelectedProducts(data);
			this.setState({popup: false});
		} else {
			this.setState({popup: false, selectedProducts:[]});
		}
	}
	deleteProduct(id) {
		let selectedProducts = this.state.selectedProducts.filter((element) => { return element.Id != id });
		this.setState({selectedProducts});
		let selectedProductsId = selectedProducts.map((element, index) => {
			return element.Id
		});
		this.updateItems(this.props.notice.Id, selectedProductsId.join(), 'ProductIds');
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
			this.getSelectedUsers(data);
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
			let selectedUsersId = selectedUsers.map((element, index) => {
				return element.Id
			});
			this.updateItems(this.props.notice.Id, selectedUsersId.join(), 'UserIds');
		}
	}
	deleteUser(element){
		let userList = this.state.userList;
		userList.push(element);
		let selectedUsers = this.state.selectedUsers.filter((elem) => { return elem.Id != element.Id });
		this.setState({selectedUsers, userList});
		let selectedUsersId = selectedUsers.map((element, index) => {
			return element.Id
		});
		this.updateItems(this.props.notice.Id, selectedUsersId.join(), 'UserIds');
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
							<div onClick={()=> this.props.close()} className="close-popup">
								<img src={globalFileServer + 'icons/close-white.svg'} alt="" />
							</div>
							<div className="massage-container">
								<div className="form">
									<input type="text"
										onBlur={(e) => this.updateItems(this.props.notice.Id, e.target.value, 'Title')}
										value={this.state.title}
										onChange={(e) => this.setState({title: e.target.value})}
										placeholder="כותרת ההודעה"
									/>
									<textarea
										value={this.state.message}
										onBlur={(e) => this.updateItems(this.props.notice.Id, e.target.value, 'Message')}
										onChange={(e) => this.setState({message: e.target.value})}
									placeholder="מלל הודעה">
									</textarea>
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
										onBlur={(e) => this.updateItems(this.props.notice.Id, e.target.value, 'Link')}
										onChange={(e) => this.setState({link: e.target.value})}
										placeholder="לינק חופשי"
									/>
									<div className="selection">
										<div className="select-users">
											{this.props.notice.SendToAll ?
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
													onChange={(e) => this.setState({sendToAll: e.target.checked})}
													onClick={(e) => e.target.checked ? this.updateItems(this.props.notice.Id, 1, 'SendToAll') : this.updateItems(this.props.notice.Id, 0, 'SendToAll')}
													name="checkbox-cats"
													checked={this.props.notice.SendToAll}
												id="checkbox_2" value="2" />
												<label htmlFor="checkbox_2"></label>
											</div>
										</div>
									</div>
									<div className="selected-users">
										<ul>
											{this.state.selectedUsers.map((element, index) => {
												if (!this.props.notice.SendToAll) {
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
											folder='messages'
											uploadImg={this.uploadImg}
											toUpdate='Img'
											ratio={16 / 12.5}
										/>
									</div>
									<div className="save-arr">
									<button onClick={this.sendMessage} className="save-and-send">שמור ושלח</button>
									<button onClick={()=> this.props.close()} className="save">שמור</button>
									<button className="cancel">בטל</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				</div>
				{this.state.popup ? <AddRecommendedProduct closePopup={this.closePopup} selectedProducts={this.state.selProdId} /> : null}
			</div>
		)
	}
}
