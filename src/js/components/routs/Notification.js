import React, { Component } from 'react';
import Message from './notification/Message';
import EditMessage from './notification/EditMessage';
import ViewMessage from './notification/ViewMessage';

import './notification/Notification.scss';

export default class Notification extends Component {
	constructor(props){
		super(props);
		this.state = {
			messagePopup: false,
			editMessage: false,
			viewMessage: false,
			notifications: [],
			notice: [],
			messagesCount: "",
			viewAll: true,
			viewed: true,
			isSent: true
		}
		this.closeMessagePopup = this.closeMessagePopup.bind(this);
		this.getNotifications = this.getNotifications.bind(this);
		this.getUserNotifications = this.getUserNotifications.bind(this);
		this.updateResult = this.updateResult.bind(this);
		this.updateUserMessage = this.updateUserMessage.bind(this);
	}
	componentDidMount(){
		if (localStorage.user_id && localStorage.user_name && localStorage.token) {
			this.getUserNotifications(localStorage.user_id);
		}
		if (localStorage.role) {
			this.getNotifications();
		}
	}
	componentWillUpdate(nextProps, nextState) {
		if (nextState.viewMessage !== this.state.viewMessage) {
			nextState.viewMessage ? $('body').addClass('fix') : $('body').removeClass('fix');
		}
		if (nextState.editMessage !== this.state.editMessage) {
			nextState.editMessage ? $('body').addClass('fix') : $('body').removeClass('fix');
		}
		if (nextState.messagePopup !== this.state.messagePopup) {
			nextState.messagePopup ? $('body').addClass('fix') : $('body').removeClass('fix');
		}
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
	}
	updateResult(res){
		let notifications = this.state.notifications;
		notifications.find(x=> x.Id == res.id)[res.paramName] = res.val;
		this.setState({notifications});
	}
	edit(el){
		this.setState({editMessage: true, notice: el})
	}
	viewMessage(el){
		this.setState({viewMessage: true, notice: el})
	}
	markMessage(el) {
		this.setState({notice: el})
		this.updateUserMessage(el.Id, 1, 'Viewed');
	}
	updateUserMessage(itemId, text, paramName){
		let val = {
			id: itemId,
			val: text,
			paramName: paramName
		};
		$.ajax({
			url: globalServer + 'mark_message.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let notifications = this.state.notifications;
				notifications.find(x=> x.Id == d.id)[d.paramName] = d.val;
				this.setState({notifications, viewMessage: true});
			} else {console.log('nothing change')}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	getUserNotifications(id) {
		let val = { 'id': id };
		$.ajax({
			url: globalServer + 'view_messages_user.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let messages = data.filter((element) => { return !element.Viewed });
			this.setState({ notifications: data, messagesCount: messages.length});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getNotifications(){
		let val = {	role: localStorage.role, token: localStorage.token };
		$.ajax({
			url: globalServer + 'view_messages_admin.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ notifications: data });
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	closeMessagePopup(data) {
		if (data) {
			let notifications = [];
			notifications.push(data);
			this.state.notifications.map((element, index)=>{
				notifications.push(element);
			});
			this.setState({notifications, messagePopup: false});
		} else {
			this.setState({messagePopup: false});
		}
	}
	render(){
		const meta = {
			title: 'שליחת הודעות פרסומיות',
			description: 'I am a description, and I can create multiple tags',
			canonical: 'http://example.com/path/to/page',
			meta: {
				charset: 'utf-8',
				name: {
					keywords: 'react,meta,document,html,tags'
				}
			}
		};
		if (localStorage.role) {
		return (
			<div className="page-container notification notification-admin">
				<div className="wrapper">
					<h1 className="title">שליחת הודעות פרסומיות</h1>
					<div className="navigation">
						<ul>
							<li onClick={ ()=> this.setState({ isSent: null, viewAll: true }) } className={this.state.viewAll ? "active" : null}>
								<img src={globalFileServer + 'icons/letter-close.svg'} alt="" />
								<span>כל הפרסומיות</span>
							</li>
							<li onClick={ ()=> this.setState({ isSent: true, viewAll: false }) } className={this.state.isSent && !this.state.viewAll ? "active" : null}>
								<img src={globalFileServer + 'icons/letter-open.svg'} alt="" />
								<span>הודעות שנשלחו</span>
							</li>
							<li onClick={ ()=> this.setState({ isSent: null, viewAll: false }) } className={!this.state.isSent && !this.state.viewAll ? "active" : null}>
								<img src={globalFileServer + 'icons/letter-wait.svg'} alt="" />
								<span>הודעות ממתינות</span>
							</li>
							<button onClick={ () => this.setState({messagePopup: true}) } className="new-message">
								<span>צור הודעה חדשה</span>
								<img src={globalFileServer + 'icons/newMessage.svg'} alt="" />
							</button>
						</ul>
						<div className="container flex-container">
							{this.state.notifications.map((element, index) => {
								if (this.state.viewAll || this.state.isSent == element.IsSent) {
								return (
									<div className="col-lg-4" key={index}>
										<div className="wrapp">
											<div className="actions">
												<p>תאריך יצר: <span className="bold">{element.CreationDate}</span></p>
												{element.LastSend ? <p>שליחה אחרונה: <span className="bold">{element.LastSend}</span></p> : null}
											</div>
											<div onClick={this.edit.bind(this, element)} className="settings"><img src={globalFileServer + 'icons/cog-blue.svg'} alt="settings" /></div>
											{element.Img ? <img src={globalFileServer + 'messages/' + element.Img} /> : <img src={globalFileServer + 'messages/empty.jpg'} />}
											<div className="desc">
												<h3 className={element.Title && element.Title.length > 26 ? 'max-length' : null}>{element.Title}</h3>
												<p>{element.Message && element.Message.length > 128 ? element.Message.substring(0,128) + " ..." : element.Message}</p>
											</div>
										</div>
									</div>
								)}
							})}
						</div>
					</div>
				</div>
				{this.state.messagePopup ? <Message notice={this.state.notice} parent={this} /> : null}
				{this.state.editMessage ? <EditMessage updateResult={this.updateResult} notice={this.state.notice} close={()=>this.setState({editMessage: false})} /> : null}
			</div>
		)
		} else {
			return (
				<div className="page-container notification">
					<div className="wrapper">
						<h1 id="getUserNotifications" onClick={this.getUserNotifications.bind(this, localStorage.user_id)} className="title">הודעות פרסומיות</h1>
						<div className="navigation">
							<ul>
								<li onClick={ ()=> this.setState({ viewed: null, viewAll: true }) } className={this.state.viewAll ? "active" : null}>
									<img src={globalFileServer + 'icons/letter-close.svg'} alt="" />
									<span>נכנסות{' (' + this.state.messagesCount + ')'}</span>
								</li>
								<li onClick={ ()=> this.setState({ viewed: null, viewAll: false }) } className={!this.state.viewed && !this.state.viewAll ? "active" : null}>
									<img src={globalFileServer + 'icons/letter-close.svg'} alt="" />
									<span>לא נקראו</span>
								</li>
								<li onClick={ ()=> this.setState({ viewed: true, viewAll: false }) } className={this.state.viewed && !this.state.viewAll ? "active" : null}>
									<img src={globalFileServer + 'icons/letter-open.svg'} alt="" />
									<span>שנקראו</span>
								</li>
							</ul>
							<div className="container flex-container">
								{this.state.notifications.map((element, index) => {
									if (this.state.viewAll || this.state.viewed == element.Viewed) {
									return (
										<div className="col-lg-4" key={index}>
											<div onClick={element.Viewed ? this.viewMessage.bind(this, element) : this.markMessage.bind(this, element)} className={element.Viewed ? "wrapp viewed" : "wrapp not-viewed"}>
												<div className="actions">
													<p><span className="bold">{element.CreationDate}</span></p>
												</div>
												{element.Viewed ?
													<div className="settings">
														<img src={globalFileServer + 'icons/letter-open.svg'} alt="settings" />
													</div>
													:
													<div className="settings">
														<img src={globalFileServer + 'icons/letter-close.svg'} alt="settings" />
													</div>
												}
												{element.Img ? <img src={globalFileServer + 'messages/' + element.Img} /> : <img src={globalFileServer + 'messages/empty.jpg'} />}
												<div className="desc">
													<h3 className={element.Title && element.Title.length > 26 ? 'max-length' : null}>{element.Title}</h3>
													<p>{element.Message && element.Message.length > 128 ? element.Message.substring(0,128) + " ..." : element.Message}</p>
												</div>
											</div>
										</div>
									)}
								})}
							</div>
						</div>
					</div>
					{this.state.viewMessage ? <ViewMessage updateResult={this.updateResult} notice={this.state.notice} close={()=>this.setState({viewMessage: false})} /> : null}
				</div>
			)
		}
	}
}
