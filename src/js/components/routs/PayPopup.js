import React, {Component} from 'react';
import SweetAlert from 'sweetalert2';



let start = false;

export default class PayPopup extends Component {
	constructor(props){
		super(props);
		this.state = {
			date: ''
		}
		this.getOrder = this.getOrder.bind(this);
	}
	componentDidMount(){
		$('body').addClass('fix');
		$('#root').addClass('blur');
		var date = new Date();
		var options = {year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric'};
		date.toLocaleDateString();
		let nDate = date.toLocaleDateString('de-DE', options).replace(/[^A-Z0-9]/ig, "_");
		this.setState({date: nDate});
		start = true;
		this.getOrder(nDate);
	}
	componentWillUnmount(){
		start = false;
		$('body').removeClass('fix');
		$('#root').removeClass('blur');
	}
	getOrder(nDate){
		let val = {
			sess_id: localStorage.session_id,
			token: localStorage.token,
			UserId: localStorage.user_id,
			Date: nDate
		};
		$.ajax({
			url: globalServer + 'get_order.php',
			type: 'POST',
			data: val
		}).done(function(nDate, data) {
			if (data.result == "success") {
				let response = JSON.parse(data.data);
				if (response.Response == "000") {
					// SweetAlert({
					// 	title: 'התשלום בוצע בהצלחה',
					// 	type: 'success',
					// 	confirmButtonText: 'אישור'
					// }).then(function () {
					// 	this.props.sendOrder(JSON.parse(data.data));
					// }.bind(this)).catch(SweetAlert.noop);
					this.props.sendOrder(JSON.parse(data.data));
				}
				if (response.Response != "000") {
					SweetAlert({
						title: 'שגיאה',
						text: 'אנא נסה שנית',
						type: 'error',
						confirmButtonText: 'אישור'
					}).then(function () {
						this.props.data.state.closePayPopup();
					}.bind(this)).catch(SweetAlert.noop);
				}
			}
			if (data.result == "error") {
				setTimeout(() => {
					this.props.props.match.url == "/cart" && start ? this.getOrder(nDate) : null
				}, 3000);
			}
		}.bind(this, nDate)).fail(function() { console.log('error'); });
	}
	render() {
		return (
			<div className="pay-popup">
				<div className="popup" id="payPopup">
					<div className="popup-wrapper">
						<div className="wrapp">
							<div onClick={this.props.data.closePayPopup} className="close-popup">
								<img src={globalFileServer + 'icons/cross.svg'} alt="" />
							</div>
							<div className="pay-popup-wrapper">
								<iframe id='pay_iframe'
									src={"https://direct.tranzila.com/pizrini/iframe.php?sum=" + (parseFloat(this.props.data.state.fullFinal) + parseFloat(this.props.data.state.deliveryPrice)).toFixed(2) + "&currency=1&cred_type=1&lang=il&user_id=" + localStorage.user_id + "&time=" + this.state.date}>
									<p>Your browser does not support iframes.</p>
								</iframe>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
