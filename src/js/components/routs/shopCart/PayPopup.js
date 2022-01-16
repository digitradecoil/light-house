import React, {Component} from 'react';
import SweetAlert from 'sweetalert2';
import InputMask from 'react-input-mask';
import styles from './PayPopup.scss';

const year = ['18','19','20','21','22','23','24','24'];
const month = ['1','2','3','4','5','6','7','8','9','10','11','12'];
let cardNumber = {mask: "9999 9999 9999 9999", value: ""};
let tZ = {mask: "999999999",value: ""};
let cvv = {mask: "999",value: ""};

export default class PayPopup extends Component {
	constructor(props){
		super(props);
		this.state = {
			paymentMetod: 'viza',
			maxPayments: [],
			payments: 1,
			cardNumber: cardNumber,
			tZ: tZ,
			cvv: cvv,
			userName: '',
			userSecondName: '',
			agree: false,
			fullPrice: parseFloat((this.props.data.state.fullBasePrice - this.props.data.state.fullDiscount) + this.props.data.state.deliveryPrice).toFixed(2)
		}
		this.toPay = this.toPay.bind(this);
		this.cancel = this.cancel.bind(this);
		this.toArray = this.toArray.bind(this);
		this.cardNumber = this.cardNumber.bind(this);
		this.tZ = this.tZ.bind(this);
		this.cvv = this.cvv.bind(this);
		this.agree = this.agree.bind(this);
	}
	componentDidMount(){
		this.toArray();
		$('body').addClass('fix');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
	}
	agree(e){
		this.setState({agree: e.target.checked ? 1 : 0});
	}
	cardNumber(event){
		let value = event.target.value;
		let cardNumber = {
			mask: "9999 9999 9999 9999",
			value: value
		}
		if (/^3[47]/.test(value)) {
			cardNumber.mask = '9999 9999 9999 9999';
		}
		this.setState({	cardNumber });
	}
	tZ(event){
		let value = event.target.value;
		let tZ = {
			mask: "999999999",
			value: value
		}
		if (/^3[47]/.test(value)) {
			tZ.mask = '999999999';
		}
		this.setState({	tZ });
	}
	cvv(event){
		let value = event.target.value;
		let cvv = {
			mask: "999",
			value: value
		}
		if (/^3[47]/.test(value)) {
			cvv.mask = '999';
		}
		this.setState({ cvv });
	}
	toArray(){
		let maxPayments = [];
		for (let i = 0; i < this.props.data.state.maxPayments; i++) {
			maxPayments.push(i + 1);
		}
		this.setState({maxPayments});
	}
	toPay(){
		let val = {
			terminalNumber: "0962210",
			user: "UserName",
			password: "XXXXXXXX",
			shopNumber: "001",
			creditCard: "458045804580",
			creditCardDateMmYy: "1214",
			token: "",
			total: "100",
			currency: "1",
			paymentsNumber: "2",
			firstPayment: "50",
			cvv2: "123",
			id: "123456789",
			authorizationNumber: "",
			paramX: "test",
			TamalInvoice: {
				InvoiceUserName: "UserName",
				InvoicePassword: "XXXXXX",
				EsekNum: "750797",
				TypeCode: "305",
				PrintLanguage: "0",
				ClientNumber: "200000",
				ClientName: "אבי כהן",
				ClientAddress: "7 טרומפלדור",
				ClientCity: "חולון",
				EmailAddress: "JohnDoe@pelecard.co.il",
				NikuyBamakorSum: "0",
				MaamRate: "18",
				DocDetail: "כותרת לרשימת המוצרים",
				ProductsList:[ {
					Description: "Item 1",
					Price: "500",
					Quantity: "2"
				},
				{
					Description: "Item 2",
					Price: "1000",
					Quantity: "1"
				}],
				ToSign: "1"
			}
		}
		debugger;
		let url = "https://gateway20.pelecard.biz/services/DebitPaymentsType";
		$.ajax({
			url: url,
			type: 'POST',
			data: JSON.stringify(val),
			contentType: "application/json",
		}).done(function(data) {
			debugger;
		}.bind(this)).fail(function() {	this.fail(); });
	}
	cancel(){
		debugger
	}
	render() {
		return (
			<div className="pay-popup">
				<div className="popup" id="payPopup">
					<div className="popup-wrapper">
						<div className="wrapp">
							<div onClick={this.props.data.closePayPopup} className="close-popup">
								<img src={globalFileServer + 'icons/close-button.svg'} alt="" />
							</div>
							<div className="pay-popup-wrapper">
								<h1 className="for-title">בחירת תשלום</h1>
								<div className="select-payment flex-container">
									<div onClick={() => this.setState({paymentMetod:'viza'})} className={this.state.paymentMetod == 'viza' ? "viza col-lg-6 active" : "viza col-lg-6"}>
										<div className="select-payment-wrapp">
											<ul>
												<li>
													<img src={globalFileServer + 'icons/payments/american_axpress.svg'} alt="" />
												</li>
												<li>
													<img src={globalFileServer + 'icons/payments/viza.svg'} alt="" />
												</li>
												<li>
													<img src={globalFileServer + 'icons/payments/master_card.svg'} alt="" />
												</li>
												<li>
													<img src={globalFileServer + 'icons/payments/diners.svg'} alt="" />
												</li>
											</ul>
										</div>
									</div>
									<div onClick={() => this.setState({paymentMetod:'paypal'})} className={this.state.paymentMetod == 'paypal' ? "paypal col-lg-6 active" : "paypal col-lg-6"}>
										<div className="select-payment-wrapp">
											<button><img src={globalFileServer + 'icons/payments/paypal.png'} alt="" /></button>
										</div>
									</div>
								</div>
								{this.state.paymentMetod == 'viza' ?
								<div className="payment for-viza">
									<p>יש לבחור מספר תשלומים</p>
									<ul>
										<li>
											<div className="select-paymens-count">
												<select onChange={(e) => this.setState({payments: e.target.value})}>
													{this.state.maxPayments.length ? this.state.maxPayments.map((element, index) => {
														return(
															<option key={index} val={element}>{element}</option>
														)
													}) : null}
												</select>
											</div>
										</li>
										<li><span>X</span></li>
										<li>
											<span>{parseFloat(this.state.fullPrice / this.state.payments).toFixed(2)}</span>
										</li>
										<li className="price">
											<span>= סכום לתשלום:</span>
											<span className="full-price">{this.state.fullPrice}</span>
											<span>₪</span>
										</li>
									</ul>
								</div>
								:
								<div className="payment paypall">
									<p className="no-paypal">PayPal אינו זמין</p>
								</div>
								}
								<div className="cards flex-container">
									<div className="col-lg-6 right-card">
										<div style={{backgroundImage: 'url(' + globalFileServer + 'icons/payments/front.jpg' + ')'}} className="card-wrapp">
											<div className="card-nomber">
												<p>מספר כרטיס אשראי</p>
												<InputMask {...this.state.cardNumber} placeholder="XXXX XXXX XXXX XXXX" onChange={this.cardNumber} maskChar='X' />
											</div>
											<div className="settings">
												<div className="half-width">
												<p>תוקף כרטיס</p>
												<ul>
													<li>
														<select onChange={(e) => this.setState({payments: e.target.value})}>
															{year.length ? year.map((element, index) => {
																return(
																	<option key={index} val={element}>{element}</option>
																)
															}) : null}
														</select>
													</li>
													<li>
														<select onChange={(e) => this.setState({payments: e.target.value})}>
															{month.length ? month.map((element, index) => {
																return(
																	<option key={index} val={element}>{element}</option>
																)
															}) : null}
														</select>
													</li>
												</ul>
												</div>
												<div className="half-width">
													<p>תעודת זהות</p>
													<InputMask {...this.state.tZ} placeholder="XXXXXXXXX" onChange={this.tZ} maskChar='X' />
												</div>
											</div>
											<div className="details">
												<div className="half-width">
													<p>שם משפחה</p>
													<input value={this.state.userName} placeholder="ישראל" onChange={(e) => this.setState({userName: e.target.value})} />
												</div>
												<div className="half-width">
													<p>שם פרטי</p>
													<input value={this.state.userSecondName} placeholder="ישראל" onChange={(e) => this.setState({userSecondName: e.target.value})} />
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-6 left-card">
										<div className="line"></div>
										<div className="card-wrapp">
											<p>מספר אבטחה CVV</p>
											<div style={{backgroundImage: 'url(' + globalFileServer + 'icons/payments/pas.png' + ')'}} className="cvv">
												<InputMask {...this.state.cvv} placeholder="XXX" onChange={this.cvv} maskChar='X' />
												<p className="card-id">1234</p>
											</div>
											<div className="card-nomber">
												<h3>{this.state.cardNumber.value ? this.state.cardNumber.value : "XXXX XXXX XXXX XXXX"}</h3>
											</div>
											<div className="details">
												<ul>
													<li>{this.state.userName ? this.state.userName : "ישראל"}</li>
													<li>{this.state.userSecondName ? this.state.userSecondName : "ישראל"}</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
								<div className="agree">
									<div className="text">
										<p>אנא שמרו את פרטי כרטיס האשראי בשרתים מאובטחים בכדי שלא אאלץ להזינו שוב בקניה הבאה בגרופון</p>
									</div>
									<div className="checkboxes-and-radios">
										<input type="checkbox"
											onChange={this.agree}
											name="checkbox-cats"
											checked={this.state.agree}
											id="agree" value="3" />
										<label htmlFor="agree"></label>
									</div>
									<div className="sequre">
										<img src={globalFileServer + 'icons/payments/payment.png'} alt="" />
									</div>
								</div>
								<div className="finish">
									<ul>
										<li>
											<button onClick={this.toPay}>תשלום</button>
										</li>
										<li>
											<button onClick={this.props.data.closePayPopup} className="cancel">בטל</button>
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
