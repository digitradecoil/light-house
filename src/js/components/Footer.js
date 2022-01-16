import React, { Component } from 'react';
import AdminEntry from './footer/AdminEntry';

export default class Footer extends Component {
	constructor(props){
		super(props);
		this.state = {
			userEntryModal: false,
			messages: [],
			newMessage: [],
			map: false,
			preload: false,
			to: '',
			name: '',
			secondName: '',
			phone: '',
			mail: '',
			msg: '',
			nameError: '',
			phoneError: '',
			mailError: '',
			msgError: ''
		}
		this.closeEntryModal = this.closeEntryModal.bind(this);
		this.exit = this.exit.bind(this);
		this.sendMail = this.sendMail.bind(this);
	}
	componentDidMount(){}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.userEntryModal !== this.state.userEntryModal) {
			nextState.userEntryModal ? $('body').addClass('fix') : $('body').removeClass('fix');
		}
	}
	exit(){
		let siteVer = localStorage.siteVer;
		localStorage.clear();
		localStorage.siteVer = siteVer;
		location.reload();
	}
	closeEntryModal(){
		this.setState({userEntryModal: false});
	}
	sendMail(e){
		e.preventDefault();
		if (this.state.name && this.state.phone && this.state.mail && this.state.msg) {
			this.setState({preload: true});
			let val = {
				siteName: 'Sushime',
				from: 'dani@statos.com',
				to: 'liaritaltd@gmail.com',
				name: this.state.name,
				secondName: this.state.secondName,
				phone: this.state.phone,
				mail: this.state.mail,
				msg: this.state.msg
			};
			$.ajax({
				url: 'https://statos.co/statos_web_mail/sendMail.php',
				async: false,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				type: 'POST',
				data: val,
				dataType: "json",
			}).done(function(d) {
				this.setState({
					name: '',
					secondName: '',
					phone: '',
					mail: '',
					msg: '',
					preload: false
				});
				SweetAlert({
					title: 'ההודעה נשלחה בהצלחה',
					text: 'אצור עמך קשר בהקדם האפשרי.',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).catch(SweetAlert.noop);
			}.bind(this)).fail(function() { console.log('error'); });
		} else {
			!this.state.name ? this.setState({nameError: true}) : null;
			!this.state.phone ? this.setState({phoneError: true}) : null;
			!this.state.mail ? this.setState({mailError: true}) : null;
			!this.state.msg ? this.setState({msgError: true}) : null;
		}
	}
	handleChange(param, e){
		this.setState({[param]: e.target.value});
		this.state[param] + 'Error' ? this.setState({[param + 'Error']: false}) : null;
	}
	render(){
		return (
			<footer id="footer">
        {this.state.userEntryModal ? <AdminEntry parent={this}/> : null}
				<div className="copyright">
					<a href="https://digitrade.co.il" target="_blank"><img src={"https://digitrade.co.il/src/img/logo.png"} /></a>
          <div className="pfd-links">
            <a href="https://light-house.co.il/src/img/מדיניות הפרטיות.pdf" target="_blank">
              <div className="license">מדיניות פרטיות</div>
            </a>
          </div>
					{!localStorage.role ?
						<div className="administrator" onClick={()=> this.setState({userEntryModal: true})}>
							<span><img src={globalFileServer + 'icons/cog.svg'} /></span>
							<span className="login">כניסה לאדמין</span>
						</div>
            :
						<div className="administrator" onClick={this.exit}>
							<span><img src={globalFileServer + 'icons/off.png'} /></span>
							<span className="login">שלום {localStorage.name + " / יציאה"}</span>
						</div>
					}
				</div>
			</footer>
		)
	}
}
