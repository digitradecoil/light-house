import React, { Component } from 'react';
import TitleEditor from '../tools/TitleEditor';
import MyCropper from '../tools/MyCropper';


let products = [];

export default class Profil extends Component {
	constructor(props){
		super(props);
		this.state = {
			userDetails: [],
			adminDetails: [],
			notificationInfo: []
		}
		this.getUserInfo = this.getUserInfo.bind(this);
		this.getAdminInfo = this.getAdminInfo.bind(this);
		this.updateUserInfo = this.updateUserInfo.bind(this);
		this.addImg = this.addImg.bind(this);
		this.getNotificationInfo = this.getNotificationInfo.bind(this);
		this.willSentNotification = this.willSentNotification.bind(this);
		this.updateAdminInfo = this.updateAdminInfo.bind(this);
	}
	componentWillMount(){
		localStorage.user_id && localStorage.user_name && localStorage.token ? this.getUserInfo() : null;
		localStorage.role && localStorage.token ? this.getAdminInfo() : null;
		localStorage.appId ? this.getNotificationInfo() : null;
	}
	getUserInfo(){
		let val= {
			userId: localStorage.user_id
		}
		$.ajax({
			url: globalServer + 'get_user.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ userDetails: data });
		}.bind(this)).fail(function() { console.log('error'); });
	}
	adminNotification(paramName, e){
		let text = e.target.checked ? 0 : 1;
		let itemId = localStorage.adminId;
		this.updateAdminInfo(itemId, text, paramName);
	}
	getAdminInfo(){
		let val= {
			role: localStorage.role,
			token: localStorage.token
		}
		$.ajax({
			url: globalServer + 'get_admin.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ adminDetails: data });
		}.bind(this)).fail(function() { console.log('error'); });
	}
	updateAdminInfo(itemId, text, paramName) {
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			role: localStorage.role,
			token: localStorage.token,
		};
		$.ajax({
			url: globalServer + 'update_admin_info.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			let adminDetails = this.state.adminDetails;
			adminDetails[d.paramName] = d.val;
			this.setState({adminDetails});

		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	updateUserInfo(itemId, text, paramName) {
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id
		};
		$.ajax({
			url: globalServer + 'update_user_info.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			let userDetails = this.state.userDetails;
			userDetails[d.paramName] = d.val;
			this.setState({userDetails});

		}.bind(this, val)).fail(function() { console.log('error'); });
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
			url: globalServer + 'profil_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.updateUserInfo(localStorage.user_id, d.fileName, 'Img');
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	getNotificationInfo(){
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id,
			app_id: localStorage.appId
		};
		$.ajax({
			url: globalServer + 'view_app_id.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			this.setState({notificationInfo: data});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	willSentNotification(e) {
		let val = {
			userId: localStorage.user_id,
			token: localStorage.token,
			sess_id: localStorage.session_id,
			app_id: localStorage.appId,
			disagree: e.target.checked ? 0 : 1
		};
		$.ajax({
			url: globalServer + 'edit_app_id.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			let notificationInfo = this.state.notificationInfo;
			notificationInfo.Disagree = d.disagree;
			this.setState({notificationInfo});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}
	render(){
		return (
			<div className="page-container profil">
				{localStorage.user_id && localStorage.token ?
					<div className="user-profil">
						<h1 className="title">פרופיל</h1>
						<div className="wrapper">
							<h2 className="sub-title">פרטים שלי</h2>
							<div className="profil-wrapper">
								<div className="user-img">
									{this.state.userDetails.Img ?
										<MyCropper
											itemId={localStorage.user_id}
											img={'user_profiles/' + this.state.userDetails.Img}
											folder='user_profiles'
											uploadImg={this.addImg}
											toUpdate='Img'
											ratio={16 / 16}
										/>
									:
									<MyCropper
										itemId={localStorage.user_id}
										img={'icons/man-user.svg'}
										folder='user_profiles'
										uploadImg={this.addImg}
										toUpdate='Img'
										ratio={16 / 16}
									/>
									}
								</div>
								<span className="separate">שם פרטי:</span>
								<TitleEditor
									title={this.state.userDetails.ContactName}
									itemId={localStorage.user_id}
									updateItems={this.updateUserInfo}
									toUpdate='ContactName'
								/>
							<span className="separate">שם משפחה:</span>
							<TitleEditor
								title={this.state.userDetails.BusinessName}
								itemId={localStorage.user_id}
								updateItems={this.updateUserInfo}
								toUpdate='BusinessName'
							/>
							<span className="separate">דואר אלקטרוני</span>
							<TitleEditor
								title={this.state.userDetails.Email}
								itemId={localStorage.user_id}
								updateItems={this.updateUserInfo}
								toUpdate='Email'
							/>
							<span className="separate">כתובת</span>
							<TitleEditor
								title={this.state.userDetails.Address}
								itemId={localStorage.user_id}
								updateItems={this.updateUserInfo}
								toUpdate='Address'
							/>
							<span className="separate">טלפון</span>
							<TitleEditor
								title={this.state.userDetails.Phone}
								itemId={localStorage.user_id}
								updateItems={this.updateUserInfo}
								toUpdate='Phone'
							/>
						</div>
						{android ?
						<div>
							<h2 className="sub-title">קבלת הודעות</h2>
							<div className="terms-and-conditions">
								<span>אני מסכים לקבל חדשות והתראות</span>
								<div className="checkboxes-and-radios">
									<input type="checkbox"
										onChange={this.willSentNotification}
										name="checkbox-cats"
										checked={!this.state.notificationInfo.Disagree}
										id="checkbox-3" value="3" />
									<label htmlFor="checkbox-3"></label>
								</div>
							</div>
						</div> : null}
					</div>
				</div> : null}
				{localStorage.role && localStorage.token ?
				<div className="admin-profil">
					<h1 className="title">פרופיל</h1>
					<div className="wrapper">
						<h2 className="sub-title">פרטים שלי</h2>
						<div className="profil-wrapper">
							<span className="separate">טלפון:</span>
							<TitleEditor
								title={this.state.adminDetails.Phone}
								itemId={localStorage.adminId}
								updateItems={this.updateAdminInfo}
								toUpdate='Phone'
							/>
							<span className="separate">דואר אלקטרוני:</span>
							<TitleEditor
								title={this.state.adminDetails.Email}
								itemId={localStorage.adminId}
								updateItems={this.updateAdminInfo}
								toUpdate='Email'
							/>
						</div>
						<div>
							<h2 className="sub-title">קבלת הודעות</h2>
							<div className="terms-and-conditions">
								<span>הודעות על רכישה/ הזמנה</span>
								<div className="checkboxes-and-radios">
									<input type="checkbox"
										onChange={this.adminNotification.bind(this, 'CancelOrderNotification')}
										name="checkbox-cats"
										checked={!this.state.adminDetails.CancelOrderNotification || this.state.adminDetails.CancelOrderNotification == 0 ? true : false}
										id="checkbox-1" />
									<label htmlFor="checkbox-1"></label>
								</div>
							</div>
							<div className="terms-and-conditions">
								<span>צ’ט עם הלקוח</span>
								<div className="checkboxes-and-radios">
									<input type="checkbox"
										onChange={this.adminNotification.bind(this, 'CancelChatNotification')}
										name="checkbox-cats"
										checked={!this.state.adminDetails.CancelChatNotification || this.state.adminDetails.CancelChatNotification == 0 ? true : false}
										id="checkbox-2" />
									<label htmlFor="checkbox-2"></label>
								</div>
							</div>
						</div>
					</div>
				</div> : null}
			</div>
		)
	}
}
