import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';


export default class AdminEntry extends Component {
	constructor(props){
		super(props);
		this.state = {
			login: true,
			userName: "",
			loginPassword: "",
			rememberMe: false
		}
		this.signIn = this.signIn.bind(this);
	}
	componentDidMount(){}
	signIn(){
		localStorage.clear();
		let val = {
			'UserName': this.state.userName,
			'Pass': this.state.loginPassword
		};
		$.ajax({
			url: globalServer + 'login_in.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
				SweetAlert({
					title: 'ברוכים הבאים',
					text: 'כניסה לאדמין בוצעה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
							localStorage.setItem('adminId', data.adminId);
							localStorage.setItem('name', data.name);
							localStorage.setItem('role', data.role);
							localStorage.setItem('session_id', data.session_id);
							localStorage.setItem('token', data.token);
							location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'שם משתמש או סיסמה אינם נכונים',
					text: 'אנא נסה שנית',
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
	render(){
		return (
			<div className="popup" id="adminEntry">
				<div className="popup-wrapper">
					<div className="wrapp">
						<div onClick={()=> this.props.parent.closeEntryModal()} className="close-popup">
							<img src={globalFileServer + 'icons/cancel.png'} alt="" />
						</div>
						<h1>כניסת מנהל</h1>
						<div className="user-entry-wrapper">
							<div className="user-entry">
								<div className="login">
									<input type="text" onChange={(e)=> this.setState({userName: e.target.value})} placeholder="ח.פ/ ע.מ" value={this.state.userName} />
									<input onKeyPress={(e) => e.charCode == 13 ? this.signIn() : null} type="password" onChange={(e)=> this.setState({loginPassword: e.target.value})} placeholder="סיסמה" value={this.state.loginPassword} />
									<div className="terms-and-conditions">
										<div className="checkboxes-and-radios">
											<input type="checkbox"
												onChange={(e)=> this.setState({rememberMe: e.target.checked})}
												name="checkbox-cats" checked={this.state.rememberMe}
												id="checkbox-2" value="2" />
											<label htmlFor="checkbox-2"></label>
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
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
