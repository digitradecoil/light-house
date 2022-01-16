import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';

import './UserEntry.scss';

export default class UserEntry extends Component {
	constructor(props){
		super(props);
		this.state = {
			login: true,
			businessName: "",
			userName: "",
			address: "",
			contactName: "",
			phone: "",
			fax: "",
			email: "",
			pass: "",
			confirmPass: "",
			termsAndConditions: false,
			loginPassword: "",
			rememberMe: false,
			mailError: false,
			passError: false,
			forgotPass: false,
			requestCode: ""
		}
		this.register = this.register.bind(this);
		this.signIn = this.signIn.bind(this);
		this.sendPass = this.sendPass.bind(this);
		this.restorePass = this.restorePass.bind(this);
		this.emptyData = this.emptyData.bind(this);
	}
	componentDidMount(){
		if (!localStorage.role && !localStorage.user_id) {
			if (location.search && location.hash) {
				let cod = location.hash.substr(1);
				this.setState({forgotPass: 'stepTwo', requestCode: cod});
			}
		}
	}
	restorePass(){
		if (this.state.pass == this.state.confirmPass) {
			let val = { 'UserCod': this.state.requestCode, 'pass': this.state.pass };
			$.ajax({
				url: globalServer + 'restore_password.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
				if (data.result == "success") {
					SweetAlert({
						title: 'הסיסמה עודכנה בהצלחה',
						text: 'אנא תבדוק מייל.',
						type: 'success',
						timer: 3000,
						showConfirmButton: false,
					}).then(
						function () {},
						function (dismiss) {
							if (dismiss === 'timer') {
								this.setState({forgotPass: false});
							}
						}.bind(this)
					)
				}
				if (data.result == "not-found") {
					SweetAlert({
						title: 'קוד האיפוס אינו תקין',
						text: 'אנא נסה שנית',
						type: 'error',
						timer: 3000,
						showConfirmButton: false,
					}).catch(SweetAlert.noop);
				}
			}.bind(this)).fail(function() {	console.log("error"); });
		} else {
			SweetAlert({
				title: 'סיסמה אינה תואמת',
				text: 'אנא נסה שנית',
				type: 'error',
				timer: 3000,
				showConfirmButton: false,
			}).catch(SweetAlert.noop);
		}
	}
	sendPass(){
		let val = { 'UserName': this.state.userName, 'siteUrl': location.origin };
		$.ajax({
			url: globalServer + 'forgot_pass.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
				SweetAlert({
					title: 'קוד הבקשה נשלחה ל אמייל שלך',
					text: 'אנא תבדוק מייל.',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(
					function () {},
					function (dismiss) {
						if (dismiss === 'timer') {
							this.setState({forgotPass: 'stepTwo'});
						}
					}.bind(this)
				)
			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'משתמש לא קיים',
					text: 'אנא נסה שנית',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).catch(SweetAlert.noop);
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	signIn(){
		$('#password').blur();
		let val = {
			'Email': this.state.email,
			'Pass': this.state.loginPassword
		};
		$.ajax({
			url: globalServer + 'sign_in.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
				SweetAlert({
					title: 'ברוכים הבאים',
					text: 'קנייה נעימה!!!',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
            localStorage.setItem('user_id', data.id);
            localStorage.setItem('user_name', data.contactName);
            localStorage.setItem('session_id', data.session_id);
            localStorage.setItem('token', data.token);
            localStorage.setItem('comments', data.comments);
            location.reload();
        }.bind(this)).catch(SweetAlert.noop);
			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'שם משתמש או סיסמה אינם נכונים',
					text: 'אנא נסה שנית או שחזר סיסמה',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).then(
					function () {},
					function (dismiss) {
						if (dismiss === 'timer') {
							//this.setState({login: true})
						}
					}.bind(this)
				)
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	register(){
		let validMail = this.validateEmail(this.state.email);
		if (validMail && this.state.pass == this.state.confirmPass) {
			let date = new Date();
			let recovery = date.getSeconds() + "" + date.getMilliseconds() + "" + date.getDay();
			let val = {
				'BusinessName': this.state.businessName,
				'UserName': this.state.userName,
				'Pass': this.state.pass,
				'Address': this.state.address,
				'ContactName': this.state.contactName,
				'Phone': this.state.phone,
				'Fax': this.state.fax ? this.state.fax : null,
				'Email': this.state.email,
				'Recovery': recovery.substring(0, 4),
				'Coupon': null,
				'TermsAndConditions': this.state.termsAndConditions ? 1 : 0,
				'AppId': null,
				'RemoveAppId': null
			};
			$.ajax({
				url: globalServer + 'registration.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
				if (data.result == "success") {
					SweetAlert({
						title: 'משתמש חדש הוקם בהצלחה.',
						text: 'אנא הזן סיסמה.',
						type: 'success',
						timer: 3000,
						showConfirmButton: false,
					}).then(function () {
            this.signIn();
					}.bind(this)).catch(SweetAlert.noop);
				}
				if (data.result == "already_exists") {
					SweetAlert({
						title: 'שם משתמש קיים',
						text: 'אנא נסה לבצע התחברות',
						type: 'info',
						timer: 3000,
						showConfirmButton: false,
					}).then(function () {
					}.bind(this)).catch(SweetAlert.noop);
				}
			}.bind(this)).fail(function() {	console.log("error"); });
		} else {
			!validMail ? this.setState({mailError: true}) : null;
			this.state.pass !== this.state.confirmPass ? this.setState({passError: true}) : null;
		}
	}
	emptyData(){
		SweetAlert({
			title: 'פרטים חסרים',
			text: 'אנא מלא את כל השדות ואשר את תנאי השימוש',
			type: 'info',
			timer: 4000,
			showConfirmButton: false,
		});
	}
	isEmpty(obj) {
		for (let x in obj) { return false; }
		return true;
	}
	isANumber(str){
		if(/^\d+$/.test(str) || str == "") { return true; } else { return false; }
	}
	validateEmail(email) {
		if(email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
			return true;
		} else {
			return false;
		}
	}
	render(){
		return (
			<div className="popup" id="userEntry">
				<div className="popup-wrapper">
					<div className="wrapp">
						<div onClick={()=> this.props.parent.closeEntryModal()} className="close-popup">
							<img src={globalFileServer + 'icons/cancel.png'} alt="" />
						</div>
						<h1>התחברות לאתר</h1>
						<div className="user-entry-wrapper">
							<ul>
								<li onClick={()=> this.setState({login: true})} className={this.state.login ? 'active' : null}><span>משתמש קיים</span></li>
								<li onClick={()=> this.setState({login: false})} className={!this.state.login ? 'active' : null}><span>משתמש חדש</span></li>
							</ul>
							<div className="user-entry">
								{this.state.login ?
									<div className="login">
										<input type="text" onChange={(e)=> this.setState({email: e.target.value})} placeholder="כתובת מייל" value={this.state.email} />
										<input id="password" onKeyPress={(e) => e.charCode == 13 ? this.signIn() : null} type="password" onChange={(e)=> this.setState({loginPassword: e.target.value})} placeholder="סיסמה" value={this.state.loginPassword} />
										<div className="terms-and-conditions">
											<div className="checkboxes-and-radios">
												<input type="checkbox"
													name="checkbox-cats" checked={this.state.rememberMe}
            id="checkbox_5" value="5" />
												<label onClick={(e) => this.setState({rememberMe: !this.state.rememberMe})} className={this.state.rememberMe ? "active" : null} htmlFor="checkbox_5"></label>
											</div>
											<span>זכור את הסיסמה במכשיר זה</span>
										</div>
										<div className="actions">
                      {this.state.loginPassword && this.state.loginPassword ?
                        <div className="send">
                          <button onClick={this.signIn}>כניסה</button>
                        </div>
											:
											<div className="accept">
												<button>כניסה</button>
											</div>
                      }
											<div className="cancel">
												<button onClick={()=> this.props.parent.closeEntryModal()}>ביטול</button>
											</div>
										</div>
										<p onClick={() => this.setState({forgotPass : "stepOne"})} className="forgot-pass">שחזר סיסמה?</p>
										{this.state.forgotPass ?
											<div className="forgot-pass-wrapp">
												<div className="forgot-password">
                          <div className="cancel">
                            <div onClick={()=> this.setState({forgotPass : false})}>
                              <img src={globalFileServer + 'icons/cancel.svg'} alt="" />
                            </div>
                          </div>
                          {this.state.forgotPass == "stepOne" ?
                            <div>
                              <h3>אנא הקלד את ח.פ/ ע.מ שלך</h3>
                              <input type="text" onChange={(e)=> this.setState({userName: e.target.value})} placeholder="ת.ז." value={this.state.userName} />
                              <button onClick={this.sendPass}>שלח</button>
                            </div> : null}
                          {this.state.forgotPass == "stepTwo" ?
                            <div>
                              <h3>אנא הקלד קוד הבקשה וססמה דשה</h3>
                              <input type="text" onChange={(e)=> this.setState({requestCode: e.target.value})} placeholder="קוד הבקשה" value={this.state.requestCode} />
                              <input type="text" onChange={(e)=> this.setState({pass: e.target.value})} placeholder="סיסמה" value={this.state.pass} />
                              <input type="text" onChange={(e)=> this.setState({confirmPass: e.target.value})} placeholder="אימות סיסמה" value={this.state.confirmPass} />
                              <button onClick={this.restorePass}>שלח</button>
                            </div> : null}
												</div>
											</div>
										: null}
									</div>
                :
                <div className="register">
                  <input type="text" onChange={(e)=> this.setState({contactName: e.target.value})} name="contact_name" placeholder="שם מלא" value={this.state.contactName} />
                  <input type="tel"
                    onChange={(e)=> this.isANumber(e.target.value) ? this.setState({phone: e.target.value}) : null}
                    name="phone" placeholder="טלפון" value={this.state.phone}
                  />

                  <input type="email"
                    className={this.state.mailError ? "error" : null}
                    onChange={(e)=> this.state.mailError ? this.setState({mailError: false, email: e.target.value}) : this.setState({email: e.target.value})}
                    name="email" placeholder="מייל" value={this.state.email}
                  />
                  <input type="password"
                    className={this.state.passError ? "error" : null}
                    onChange={(e)=> this.state.passError ? this.setState({pass: e.target.value, passError: false}) : this.setState({pass: e.target.value})}
                    name="pass" placeholder="סיסמה" value={this.state.pass}
                  />
                  <input type="password"
                    className={this.state.passError ? "error" : null}
                    onChange={(e)=> this.state.passError ? this.setState({confirmPass: e.target.value, passError: false}) : this.setState({confirmPass: e.target.value})}
                    name="confirmPass" placeholder="אימות סיסמה" value={this.state.confirmPass}
                  />
                  <div className="terms-and-conditions">
                    <div className="checkboxes-and-radios">
                      <input type="checkbox"
                        onChange={(e)=> this.setState({termsAndConditions: e.target.checked})}
                        name="checkbox-cats" checked={this.state.termsAndConditions}
                      id="checkbox-3" value="3" />
                      <label htmlFor="checkbox-3"></label>
                    </div>
                    <span>אנא קרא והסכם ל<a>תנאי השימוש</a></span>
                  </div>
                  <div className="actions">
										{this.state.contactName && this.state.phone && this.state.email && this.state.pass && this.state.confirmPass && this.state.termsAndConditions ?
											<div className="send">
												<button onClick={this.register}>צור חשבון</button>
											</div>
                    :
                    <div className="accept">
                      <button onClick={() => this.emptyData()}>צור חשבון</button>
											</div>
										}
											<div className="cancel">
												<button onClick={()=> this.props.parent.closeEntryModal()}>ביטול</button>
											</div>
										</div>
									</div>
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
