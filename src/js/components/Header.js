import React, { Component } from 'react';
import { NavLink } from "react-router-dom";

let lastScrollTop = 0;

export default class Header extends Component {
	constructor(props){
		super(props);
		this.state = {
			viewMenu: false,
			mobile: false
		}
		this.exit = this.exit.bind(this);
		this.openMobileMenu = this.openMobileMenu.bind(this);
	}
	componentDidMount(){}
	openMobileMenu(){
		this.setState({	viewMenu: true });
	}
	exit(){
		localStorage.clear();
		this.props.history.push('/');
	}
	setLanguage(lang){
		if(lang=="he"){
			if(this.props.state.selectedLang == "en"){
				let pathName = "";
				if(this.props.history.location.pathname == "/en/home"){
					let pathName = "/"
				} else {
					pathName = this.props.history.location.pathname.replace("/en","");
				}
				this.props.history.push(pathName);
			}
			this.props.setLanguage("he");
		}else if(lang=="en"){
			if(this.props.state.selectedLang == "he"){
				let lastChar = this.props.history.location.pathname.substr(this.props.history.location.pathname.length - 1);
				if(this.props.history.location.pathname == "/"){
					this.props.history.push(this.props.history.location.pathname + "en/home");
				}else{
					this.props.history.push("/en" + this.props.history.location.pathname);
				}

			}
			this.props.setLanguage("en");
		}
		this.setState({viewMenu:false});
	}
	render(){
		return (
			<div>
				<header id="siteHeader">
					<div className="skew-cont"></div>
					<div className="hedear-top-cont flex-container">
						<div className="col-lg-6 right-cont">
							<div className="social-cont">
								<a href="https://www.facebook.com/lighthousetattoo1"><img src={globalFileServer + 'icons/facebook.svg'} /></a>
							</div>
							<div className="social-cont">
								<a href="https://www.instagram.com/lh_lighthousetattoo"><img src={globalFileServer + 'icons/instagram.svg'} /></a>
							</div>
							<div className="lang-cont">
								<ul>
									<li className={this.props.state.selectedLang == "he" ? "active" : null} onClick={this.setLanguage.bind(this,"he")}>HE</li>
									<li className={this.props.state.selectedLang == "en" ? "active" : null}  onClick={this.setLanguage.bind(this,"en")}>EN</li>
								</ul>
							</div>
						</div>
						<div className="col-lg-6 left-cont">
							<div className="social-cont">
								<a href="tel:+972527721116">
									<p>052-772-1116</p>
								</a>
							</div>
							<div className="social-cont">
								<a href="/"><img src={globalFileServer + 'icons/phone.svg'} /></a>
							</div>
							<a href="https://www.waze.com/ul?ll=32.80246222%2C34.98441696&navigate=yes&zoom=15" target="_blank">

								<div className="social-cont">
									{this.props.state.selectedLang == "he" ?
										<p>שדרות מוריה 9, חיפה</p>
									:
									<p>Moriah Ave 9, Haifa</p>
									}
								</div>
								<div className="social-cont">
									<img src={globalFileServer + 'home/contact/address_circle.svg'} />
								</div>
							</a>
						</div>
						<div className="logo">
							<a href="/"><img src={globalFileServer + 'home/small-logo.svg'} /></a>
						</div>
					</div>
					<div className="navigation-container">
						<nav className={this.props.state.selectedLang == "he" ? "main-navigation horizontal" : "main-navigation horizontal en"}>
							<ul>
								<li><NavLink exact to={this.props.state.selectedLang == "he" ? "/" : "/en/home"}>{this.props.state.selectedLang == "he" ? "בית" : "Home"}</NavLink></li>
								<li><NavLink to={this.props.state.selectedLang == "he" ? "/aboutUs" : "/en/aboutUs"}>{this.props.state.selectedLang == "he" ? "אודות" : "About"}</NavLink></li>
								<li ><NavLink className={this.props.history.location.pathname.includes("team") ? "active" : null}  to={this.props.state.selectedLang == "he" ? "/staff" : "/en/staff"}>{this.props.state.selectedLang == "he" ? "הצוות" : "Team"}</NavLink></li>
									<li><NavLink to={this.props.state.selectedLang == "he" ? "/gallery" : "/en/gallery"}>{this.props.state.selectedLang == "he" ? "קעקועים" : "Tattoo"}</NavLink></li>
									<li><NavLink to="/pirsing">{this.props.state.selectedLang == "he" ? "פירסינג" : "Piercing"}</NavLink></li>
									<li><NavLink to={this.props.state.selectedLang == "he" ? "/contacts" : "/en/contacts"}>{this.props.state.selectedLang == "he" ? "צור קשר" : "Contact"}</NavLink></li>
								</ul>
							</nav>
						</div>
					</header>
					<div className="header-mobile">
						<div className="header-top flex-container">
							<div className="header-skew"></div>
							<div onClick={this.openMobileMenu} className="menu-button col-lg-2">
								<img src={globalFileServer + 'icons/menu-open.png'} />
							</div>
							<div className="mob-social col-lg-8">
								<div className="social-cont">
									<a href="https://www.waze.com/ul?ll=32.80246222%2C34.98441696&navigate=yes&zoom=15" target="_blank">
										<img src={globalFileServer + 'home/contact/address_circle.svg'} />
									</a>
								</div>
								<div className="social-cont">
									<a href={"https://api.whatsapp.com/send?phone=972527721116&text=שלום לייט האוס:)"} target="_blank"><img src={globalFileServer + 'icons/WhatsApp.svg'} /></a>
								</div>
								<div className="social-cont">
									<a href="https://www.instagram.com/lh_lighthousetattoo"><img src={globalFileServer + 'icons/instagram.svg'} /></a>
								</div>
								<div className="social-cont">
									<a href="tel:+972527721116"><img src={globalFileServer + 'icons/phone.svg'} /></a>
								</div>
							</div>
						</div>
						<div className={this.state.viewMenu ? "header-wrapper" : "header-wrapper hidden"}>
							<div className="navigation-container">
								<nav className="main-navigation animated slideInRight">
									<ul>
										<li onClick={()=> this.setState({viewMenu: false})}><NavLink exact to={this.props.state.selectedLang == "he" ? "/" : "/en/home"}>{this.props.state.selectedLang=="he" ? "בית" : "Home"}</NavLink></li>
										<li onClick={()=> this.setState({viewMenu: false})}><NavLink to={this.props.state.selectedLang=="he" ? "/aboutUs" : "/en/aboutUs"}>{this.props.state.selectedLang=="he" ? "אודות" : "About"}</NavLink></li>
										<li onClick={()=> this.setState({viewMenu: false})}>
											<NavLink className={this.props.history.location.pathname.includes("team") ? "active" : null} to={this.props.state.selectedLang=="he" ? "/staff" : "/en/staff"}>{this.props.state.selectedLang=="he" ? "הצוות" : "Team"}</NavLink>
										</li>
										<li onClick={()=> this.setState({viewMenu: false})}><NavLink to={this.props.state.selectedLang == "he" ? "/gallery" : "/en/gallery"}>{this.props.state.selectedLang == "he" ? "קעקועים" : "Tattoo"}</NavLink></li>
										<li onClick={()=> this.setState({viewMenu: false})}><NavLink to="/pirsing">{this.props.state.selectedLang == "he" ? "פירסינג" : "Piercing"}</NavLink></li>
										<li onClick={()=> this.setState({viewMenu: false})}><NavLink to={this.props.state.selectedLang=="he" ? "/contacts" : "/en/contacts"}>{this.props.state.selectedLang=="he" ? "צור קשר" : "Contact"}</NavLink></li>
									</ul>
								</nav>
							</div>
							<div className="menu-footer">
								<div className="lang-cont">
									<ul>
										<li className={this.props.state.selectedLang=="he" ? "active" : null} onClick={this.setLanguage.bind(this,"he")}>HE</li>
										<li className={this.props.state.selectedLang=="en" ? "active" : null}  onClick={this.setLanguage.bind(this,"en")}>EN</li>
									</ul>
								</div>
								<div className="logo">
									<a href="/"><img src={globalFileServer + 'home/small-logo.svg'} /></a>
								</div>
							</div>
						</div>
						<div onClick={() => this.setState({viewMenu: false})} className={this.state.viewMenu ? "fake-click" : "fake-click hidden"}></div>
					</div>
				</div>
			)
		}
}
