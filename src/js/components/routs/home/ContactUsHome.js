import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";

export default class ContactUs extends Component {
	constructor(props){
		super(props);
		this.state = {
			to: '',
			name: null,
			phone: '',
			mail: '',
			msg: '',
			nameError: '',
			phoneError: '',
			mailError: '',
			msgError: '',
			nameBlur: null,
			phoneBlur: null,
			mailBlur: null,
			msgBlur: null,
			scrollHeight: 50,
      Lang:'he',
      preload:false
		}
		this.sendMail = this.sendMail.bind(this);
    this.changeLang = this.changeLang.bind(this);

	}
	componentDidMount() {
      this.setState({Lang:this.props.state.selectedLang});
	}
  componentWillReceiveProps(){
    this.setState({Lang:this.props.state.selectedLang});
  }

	componentWillMount() {}
	componentWillUnmount() {}
	sendMail(e){
		e.preventDefault();
		if (this.state.name && this.state.phone && this.state.mail && this.state.msg) {
			this.setState({preload: true});
			let val = {
				siteName: global.globalSiteName,
				from: global.globalAdminMail,
				to: global.globalclientMail,
				name: this.state.name,
				phone: this.state.phone,
				mail: this.state.mail,
				msg: this.state.msg
			};
			$.ajax({
				url: 'https://statos.co/statos_web_mail/sendMail.php',
				type: 'POST',
				data: val,
				dataType: "json",
			}).done(function(d) {
				this.setState({
					preload: false,
					to: '',
					name: '',
					phone: '',
					mail: '',
					msg: '',
					nameError: '',
					phoneError: '',
					mailError: '',
					msgError: '',
					nameBlur: null,
					phoneBlur: null,
					mailBlur: null,
					msgBlur: null,
					scrollHeight: 50
				});
			}.bind(this)).fail(function() { console.log('error'); });
		} else {
			!this.state.name ? this.setState({nameError: true}) : null;
			!this.state.phone ? this.setState({phoneError: true}) : null;
			!this.state.mail ? this.setState({mailError: true}) : null;
			!this.state.msg ? this.setState({msgError: true}) : null;
			!this.state.department ? this.setState({departmentError: true}) : null;
		}
	}
	handleChange(param, e){
		this.setState({[param]: e.target.value});
		this.state[param] + 'Error' ? this.setState({[param + 'Error']: false}) : null;
		if (param === "msg") {
			if (this.state.scrollHeight + 22 !== e.target.scrollHeight) {
				this.setState({scrollHeight: e.target.scrollHeight})
			}
		}
	}
  changeLang(){
    this.setState({Lang:this.props.state.selectedLang});
  }
	render(){

    let props = Object.assign({}, this.props);
    if(this.state.Lang && this.state.Lang  != this.props.state.selectedLang){
      this.changeLang();
    }
		return (
			<section className={this.state.Lang == "he" ? "contact-us" : "contact-us ltr"}>
        <Helmet>
          <title>סטודיו קעקועים בחיפה | סטודיו פירסינג בחיפה</title>
          <meta name="description" content="הגיע הזמן לקעקוע חדש? אנחנו לייטהאוס, סטודיו לקעקועים בחיפה. צרו קשר לשיחת ייעוץ חינם. "/>
          <meta name="keywords" content="קעקועים, קעקועים חיפה, קעקועים בחיפה, פירסינג חיפה, פירסינג בחיפה, אלכס קעקועים חיפה, מיקה קעקועים, לייטהאוס קעקועים, מכון קעקועים, אלכס מיסורה, שירן סבג, אוולין ברזניקוב, איגור סוקולבסקי" />
          <link rel="canonical" href="https://light-house.co.il" />
        </Helmet>
				<div className="contact-us-wrapper">
					<div className="container">
						<div className="flex-container">
              <div className="col-lg-6">
								<div className="wrapp">
									<div className="info">
										<h3>{this.state.Lang == "he" ? "צרו קשר עם לייטהאוס. מכון קעקועים בחיפה." : "Contact Lighthouse. A Tattoo Studio in Haifa."}</h3>
                    <p>{this.state.Lang == "he" ? "הגיע הזמן לקעקוע חדש?" : "Is it time for a new tattoo?"}</p>
                    <p>{this.state.Lang == "he" ? "אנחנו מחכים לכם כאן, עם צוות אמני הקעקועים המוביל של אזור חיפה, שופעים רעיונות ורצון לעזור. צרו קשר לשיחת ייעוץ חינם." : "We’re waiting for you here, with the finest tattoo artists of Haifa. We have tons of idea and a passion for creating amazing tattoos. Contact us for free consulting."}</p>
										<ul>
											<li>
												<a href="https://ul.waze.com/ul?ll=32.80246222%2C34.98441696&navigate=yes&zoom=17&utm_campaign=waze_website&utm_source=waze_website&utm_medium=lm_share_location" target="_blank">
													<img src={globalFileServer + 'home/contact/address.svg'} />
													{this.state.Lang == "he" ?
														<span>שדרות מוריה 9 חיפה</span>
														:
														<span>Moriah Ave 9, Haifa</span>
													}
												</a>
											</li>
											<li>
                        <a href="tel:+972527721116">
                          <img src={globalFileServer + 'home/contact/phone.svg'} />
                          <span>052-772-1116</span>
                        </a>
											</li>
											<li>
                        <a href="mailto:Allindesing@gmail.com">
                          <img src={globalFileServer + 'icons/mail.svg'} />
                          <span>Allindesing@gmail.com</span>
                        </a>
											</li>
										</ul>
									</div>
                  <div className="social-main-cont">
                    <div className="social-cont">
                      <span>
                        <a href="https://www.facebook.com/lighthousetattoo1" target="_blank"><img src={globalFileServer + 'home/contact/facebook-circle.svg'} /></a>
                      </span>
                      <span>
                        <a href="https://www.instagram.com/lh_lighthousetattoo" target="_blank"><img src={globalFileServer + 'home/contact/instagram-circle.svg'} /></a>
                      </span>
                      <span>
                        <a href="tel:+972527721116"><img src={globalFileServer + 'home/contact/phone-circle.svg'} /></a>
                      </span>
                    </div>
                  </div>
								</div>
							</div>
              <div className="col-lg-6">
								<div className="wrapp">
									<div className="form">
										{this.state.preload ?
											<div className="loader-pulsing-wrapper">
												<div className="loader-pulsing"></div>
											</div>
										: null}
										<form>
											<div className="inputs">
												<div className={this.state.nameError ? 'wr error' : 'wr'}>
													<input
														className={this.state.nameError ? 'error' : null}
														onChange={this.handleChange.bind(this, "name")}
														onBlur={() => this.state.name === true || !this.state.name ? this.setState({name: null, nameBlur: null}) : this.setState({nameBlur: true})}
														value={this.state.name === true || !this.state.name ? '' : this.state.name}
														type="text"
														name="name"
														onClick={() => !this.state.name ? this.setState({name: true}) : null}
             />
													<div className={this.state.name ? "line active" : "line"}></div>
													{this.state.nameBlur ?
														<div className="svg">
															<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-263.5 236.5 26 26">
																<g className="svg-success">
																	<circle cx="-250.5" cy="249.5" r="12"/>
																	<path d="M-256.46 249.65l3.9 3.74 8.02-7.8"/>
																</g>
															</svg>
														</div>
													: null}
													<span className={this.state.name ? (this.state.Lang == "he" ? "for-title active" : "for-title active ltr") : (this.state.Lang == "he" ? "for-title" : "for-title ltr")}>{this.state.Lang == "he" ? "שם מלא" : "Full Name"}</span>

												</div>
											</div>
											<div className="inputs">
												<div className={this.state.phoneError ? 'error wr' : 'wr'}>
													<input
														className={this.state.phoneError ? 'error' : null}
														onChange={this.handleChange.bind(this, "phone")}
														onBlur={() => this.state.phone === true || !this.state.phone ? this.setState({phone: null, phoneBlur: null}) : this.setState({phoneBlur: true})}
														value={this.state.phone === true || !this.state.phone ? '' : this.state.phone}
														type="text"
														name="phone"
														onClick={() => !this.state.phone ? this.setState({phone: true}) : null}
             />
													<div className={this.state.phone ? "line active" : "line"}></div>
													{this.state.phoneBlur ?
														<div className="svg">
															<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-263.5 236.5 26 26">
																<g className="svg-success">
																	<circle cx="-250.5" cy="249.5" r="12"/>
																	<path d="M-256.46 249.65l3.9 3.74 8.02-7.8"/>
																</g>
															</svg>
														</div>
													: null}
													<span className={this.state.phone ? (this.state.Lang == "he" ? "for-title active" : "for-title active ltr") : (this.state.Lang == "he" ? "for-title" : "for-title ltr")}>{this.state.Lang == "he" ? "טלפון" : "Phone"}</span>
												</div>
											</div>
											<div className="inputs">
												<div className={this.state.mailError ? 'error wr' : 'wr'}>
													<input
														className={this.state.mailError ? 'error' : null}
														onChange={this.handleChange.bind(this, "mail")}
														onBlur={() => this.state.mail === true || !this.state.mail ? this.setState({mail: null, mailBlur: null}) : this.setState({mailBlur: true})}
														value={this.state.mail === true || !this.state.mail ? '' : this.state.mail}
														type="text"
														name="mail"
														onClick={() => !this.state.mail ? this.setState({mail: true}) : null}
             />
													<div className={this.state.mail ? "line active" : "line"}></div>
													{this.state.mailBlur ?
														<div className="svg">
															<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-263.5 236.5 26 26">
																<g className="svg-success">
																	<circle cx="-250.5" cy="249.5" r="12"/>
																	<path d="M-256.46 249.65l3.9 3.74 8.02-7.8"/>
																</g>
															</svg>
														</div>
													: null}
													<span className={this.state.mail ? (this.state.Lang == "he" ? "for-title active" : "for-title active ltr") : (this.state.Lang == "he" ? "for-title" : "for-title ltr")}>{this.state.Lang == "he" ? "דואר אלקטרוני" : "E-mail"}</span>
												</div>
											</div>
											<div className={this.state.msgError ? 'error textarea-wrapp' : 'textarea-wrapp'}>
												<textarea
													style={this.state.scrollHeight ? {height: this.state.scrollHeight + 'px'} : null}
													className={this.state.msgError ? 'error' : null}
													onChange={this.handleChange.bind(this, "msg")}
													onBlur={() => this.state.msg === true || !this.state.msg ? this.setState({msg: null, msgBlur: null}) : this.setState({msgBlur: true})}
													value={this.state.msg === true || !this.state.msg ? '' : this.state.msg}
													type="text"
													name="msg"
													onClick={() => !this.state.msg ? this.setState({msg: true}) : null}
            ></textarea>
												<div className={this.state.msg ? "line active" : "line"}></div>
												{this.state.msgBlur ?
													<div className="svg">
														<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="-263.5 236.5 26 26">
															<g className="svg-success">
																<circle cx="-250.5" cy="249.5" r="12"/>
																<path d="M-256.46 249.65l3.9 3.74 8.02-7.8"/>
															</g>
														</svg>
													</div>
												: null}
												<span className={this.state.msg ? (this.state.Lang == "he" ? "for-title active" : "for-title active ltr") : (this.state.Lang == "he" ? "for-title" : "for-title ltr")}>{this.state.Lang == "he" ? "הודעה" : "Message"}</span>
											</div>
											<div className="regular-button-wrapper">
												<button className="regular-button" onClick={this.sendMail}>{this.state.Lang == "he" ? "שליחת הודעה" : "Send Message"}</button>
											</div>
										</form>
									</div>
								</div>
							</div>

						</div>

					</div>
				</div>
        <div className="map">
			<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3353.6256322129666!2d34.982209615626964!3d32.80218438096443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151dbba804cc7ad5%3A0xd81b3809256cb19a!2sMoriah%20Ave%209%2C%20Haifa%2C%203457109!5e0!3m2!1sen!2sil!4v1642088183156!5m2!1sen!2sil" allowFullScreen></iframe>
		</div>
			</section>
		)
	}
}
