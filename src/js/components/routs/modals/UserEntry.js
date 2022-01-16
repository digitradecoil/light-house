import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';

export default class AdminEntry extends Component {
	state = {
		type: false,
		admin: true,
		login: '',
		password: ''
	};
	componentDidMount(){
		$('body').addClass('fix');
		$('main, footer, .fixed-menu, .top, .logo, .navigation-container, .copyright').addClass('blur');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('main, footer, .fixed-menu, .top, .logo, .navigation-container, .copyright').removeClass('blur');
	}
	getSite = url => {
		let path = url.split('/');
		let site = '';
		if (location.pathname == "/") site = 'care';
		if (path.includes('care')) site = 'care';
		if (path.includes('know')) site = 'know';
		if (path.includes('youshop')) site = 'youshop';
		return site;
	}
	isANumber = (str) => {
		if(/^\d+$/.test(str) || str == "") { return true; } else { return false; }
	}
	validateEmail = (email) => {
		if(email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
			return true;
		} else {
			return false;
		}
	}
	showAlert = (type, title) => {
		SweetAlert({
			title: title,
			type: type,
			showConfirmButton: false,
			timer: 4000
		}).catch(SweetAlert.noop);
	}
	logIn = () => {
		if (this.state.login && this.state.password) {
			let site = this.getSite(location.pathname);
			let val = {
				funcName: this.state.admin ? 'adminSignIn' : 'agentSignIn',
				login: this.state.login,
				password: this.state.password,
				site: site
			};
			$.ajax({
				url: globalServer + 'log_in.php',
				type: 'POST',
				data: val,
			}).done(function(data) {
				if (data.result == "success") {
					const hash = location.protocol == "file:" ? '#' : '';
					if (localStorage.role == "user") {
						let siteVer = localStorage.siteVer;
						localStorage.clear();
						localStorage.siteVer = siteVer;
					}
					localStorage.setItem('adminId', data.adminId);
					localStorage.setItem('name', data.name);
					localStorage.setItem('role', data.role);
					localStorage.setItem('session_id', data.session_id);
					localStorage.setItem('token', data.token);
					this.showAlert('success', 'כניסה לאדמין בוצעה בהצלחה');
					setTimeout(() => location.reload(), 4000);
				} else {
					this.showAlert('error', 'Login or password is incorrect');
				}
			}.bind(this)).fail(function() {	console.log("error"); });
		} else {
			this.showAlert('error', 'חסרים פרטים');
		}
	}
	render(){
		return (
			<div className="popup-login" id="userEntry">
				<div style={{width: '650px'}} className="popup-wrapper">
					<div className="wrapper">
						<div className="flex-container">
							<div className="img">
								<img src={globalFileServer + 'popup.jpg'} />
							</div>
							<div className="form">
								<div className="form-wrapper">
									<div className="input">
										<input
											type="text"
											placeholder="שם משתמש"
											value={this.state.login}
											onChange={e => this.setState({login: e.target.value})}
										/>
									</div>
									<div className="input">
										<input
											type={this.state.type ? "text": "password"}
											placeholder="סיסמא"
											value={this.state.password}
											onChange={e => this.setState({password: e.target.value})}
										/>
										<img
											onClick={e => this.setState({type: !this.state.type})}
											src={!this.state.type ? globalFileServer + 'icons/eye.svg' : globalFileServer + 'icons/hide.svg'}
										/>
									</div>
									<div className="button-wrapper">
										<button onClick={e => this.logIn()}>התחבר</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
