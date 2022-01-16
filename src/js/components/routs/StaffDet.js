import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";

let uagent = navigator.userAgent.toLowerCase();
let feed;
export default class StaffDet extends Component {
	constructor(props){
		super(props);
		this.state = {
			tabChosen:1,
			member:[],
			filesArr:[]
		}
		this.returnFilesArr = this.returnFilesArr.bind(this);
	}
	componentDidMount() {
		setTimeout(() => window.scrollTo(0, 0), 50);
		this.props.state.staffObj.length ? this.returnFilesArr(this.props.state.staffObj) : null;
	}
	componentWillReceiveProps(nextProps){
		this.setState({Lang: nextProps.state.selectedLang});
		if (nextProps.state.staffObj.length) {
			if (JSON.stringify(this.props.state.staffObj) != JSON.stringify(nextProps.state.staffObj)) {
				this.returnFilesArr(nextProps.state.staffObj);
			}
		}
	}
	returnFilesArr(staffObj){
		let memberName = this.props.history.location.pathname.split("/");
		let member = staffObj.filter(item => item.url == memberName[memberName.length-1])[0];
		this.setState({member: member});
		let val = { 'userId': member.id };
	}
	loadMore(){
		feed.next();
	}
	render(){
		return (
			<div className="staff-det-page">
				{this.props.state.staffObj && this.props.state.staffObj.length > 0 ?
					<div className="staff-det-page-cont">
						<Helmet>
							<title>{this.state.member.name + " - לייטהאוס קעקועים חיפה"}</title>
							<meta name="description" content="לייטהאוס קעקועים | מכון קעקועים בחיפה | סטודיו קעקועים בחיפה | אמני הקעקועים שלנו"/>
							<meta name="keywords" content="קעקועים, קעקועים חיפה, קעקועים בחיפה, פירסינג חיפה, פירסינג בחיפה, אלכס קעקועים חיפה, מיקה קעקועים, לייטהאוס קעקועים, מכון קעקועים, אלכס מיסורה, שירן סבג, אוולין ברזניקוב, איגור סוקולבסקי" />
              <link rel="canonical" href="https://light-house.co.il" />

            </Helmet>
						<div className="staff-det-main-cont flex-container">
							<div className="col-lg-6 right-main-cont">
								<div className="right-sub-cont">
									<h1>{this.state.member.name}</h1>
									<div className="right-sub-img-cont">
										<img src={globalFileServer + 'staff_cont/'+this.state.member.id+'/porfile1.png'}/>
									</div>
									<p>{this.state.member.staff1}</p>
									<p>{this.state.member.staff2}</p>
									<p>{this.state.member.staff3}</p>
									<p>{this.state.member.staff4}</p>
									<div className="social-main-cont">
										<div className="social-cont">
											<span>
												<a href={this.state.member.facebook} target="_blank"><img src={globalFileServer + 'home/contact/facebook-circle.svg'} /></a>
											</span>
											<span>
												<a href={this.state.member.instagram} target="_blank"><img src={globalFileServer + 'home/contact/instagram-circle.svg'} /></a>
											</span>
											<span>
												<a href={"tel:+972" + this.state.member.phone} target="_blank"><img src={globalFileServer + 'home/contact/phone-circle.svg'} /></a>
											</span>
										</div>
									</div>
								</div>
							</div>
							<div className="col-lg-6 left-main-cont">
								<div className="left-sub-cont">
									<img className="staffEle" src={globalFileServer + 'staff_cont/'+this.state.member.id+'/porfile1.png'}/>
								</div>
							</div>
						</div>
						<div className="insta-cont">
							<button onClick={this.loadMore.bind(this)} id="load">ראה עוד</button>
						</div>
					</div>
				:null}
			</div>
		)
	}
}
