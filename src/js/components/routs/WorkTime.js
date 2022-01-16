import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import TimePicker from 'react-times';


export default class WorkTime extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			focusFrom: false,
			focusTo: false,
			openShop: true
		}
		this.getItems = this.getItems.bind(this);
		this.setTimeFrom = this.setTimeFrom.bind(this);
		this.setTimeTo = this.setTimeTo.bind(this);
		this.getOpenShop = this.getOpenShop.bind(this);
		this.setOpenShop = this.setOpenShop.bind(this);
	}
	componentWillMount(){
		this.getItems();
		this.getOpenShop();
	}
	componentDidMount(){
		window.scrollTo(0, 0);
	}
	componentWillUnmount(){}
	componentWillReceiveProps(nextProps){}
	getOpenShop() {
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'get-open_shop.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			this.setState({openShop: data.Open == "1" ? 1 : 0});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	setOpenShop(e){
		this.setState({openShop: e});
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			Open: e
		};
		$.ajax({
			url: globalServer + 'write_open_shop.php',
			type: 'POST',
			data: val
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getItems() {
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'get-time.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			this.setState({items: data});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	setTimeFrom(id, paramName, time){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			Id: id,
			ParamName: paramName,
			Val: time
		};
		$.ajax({
			url: globalServer + 'write_time.php',
			type: 'POST',
			data: val
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	onHourChangeFrom(id, time){
		let items = this.state.items;
		items.map((item) => {
			if (item.Id == id) {
				if (item.From.split(':').length > 1) {
					item.From.split(':')[0] = time;
					item.From = time + ":" + item.From.split(':')[1];
				} else {
					item.From = time + ":" + "00";
				}

			}
		});
		this.setState({items});
	}
	onMinuteChangeFrom(id, time){
		let from = false;
		let items = this.state.items;
		items.map((item) => {
			if (item.Id == id) {
				from = item.From.split(':')[0] + ":" + time;
				item.From = from;
			}
		});
		this.setState({items});
		this.setTimeFrom(id,'From', from);
	}
	onFocusChangeFrom(id, focus){
		this.setState({focusFrom: false});
	}
	setTimeTo(id, paramName, time){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			Id: id,
			ParamName: paramName,
			Val: time
		};
		$.ajax({
			url: globalServer + 'write_time.php',
			type: 'POST',
			data: val
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	onHourChangeTo(id, time){
		let items = this.state.items;
		items.map((item) => {
			if (item.Id == id) {
				if (item.To.split(':').length > 1) {
					item.To.split(':')[0] = time;
					item.To = time + ":" + item.To.split(':')[1];
				} else {
					item.To = time + ":" + "00";
				}

			}
		});
		this.setState({items});
	}
	onMinuteChangeTo(id, time){
		let from = false;
		let items = this.state.items;
		items.map((item) => {
			if (item.Id == id) {
				from = item.To.split(':')[0] + ":" + time;
				item.To = from;
			}
		});
		this.setState({items});
		this.setTimeTo(id,'To', from);
	}
	onFocusChangeTo(id, focus){
		this.setState({focusTo: false});
	}
	render(){
		return (
			<div style={{backgroundImage: 'url(' + globalFileServer + 'mountain_3.jpg)' }} className="page work-time admin">
				<h1 className="admin-title">שעות פתיחה</h1>
				<div className="container">
					<div className="terms-and-conditions">
						<div className="checkboxes-and-radios">
							<input
								type="checkbox"
								name="checkbox-cats"
								checked={this.state.openShop}
								id="checkbox_5" value="5"
								onChange={(e) => this.setOpenShop(e.target.checked ? 1 : 0)}
							/>
							<label
								className={this.state.rememberMe ? "active" : null}
								htmlFor="checkbox_5"
							></label>
						</div>
						<span>הפעלת מערכת הזמנות</span>
					</div>
					<div className="flex-container title">
						<div className="col-lg-2">
							<div className="wrapp day">
								<p>יום</p>
							</div>
						</div>
						<div className="col-lg-5">
							<div className="wrapp from">
								<p>שעת התחלה</p>
							</div>
						</div>
						<div className="col-lg-5">
							<div className="wrapp to">
								<p>שעת סיום</p>
							</div>
						</div>
					</div>
					{this.state.items.length ? this.state.items.map((element, index) => {
						return (
							<div key={index} className="flex-container contant">
								<div className="col-lg-2">
									<div className="wrapp day">
										<p>{element.Day}</p>
									</div>
								</div>
								<div className="col-lg-5">
									<div className="wrapp from">
										<div onClick={() => this.setState({focusFrom: element.Id})} className="fake">
											<p>{element.From ? element.From : '00:00'}</p>
										</div>
										{this.state.focusFrom == element.Id ?
											<TimePicker
												focused={this.state.focusFrom == element.Id}
												withoutIcon={true}
												time={element.From ? element.From : '00:00'}
												theme="material"
												timeMode="24"
												minuteStep={1}
												timezone="Asia/Jerusalem"
												onFocusChange={this.onFocusChangeFrom.bind(this, element.Id)}
												onHourChange={this.onHourChangeFrom.bind(this, element.Id)}
												onMinuteChange={this.onMinuteChangeFrom.bind(this, element.Id)}
											/>
										: null}
									</div>
								</div>
								<div className="col-lg-5">
									<div className="wrapp to">
										<div onClick={() => this.setState({focusTo: element.Id})} className="fake">
											<p>{element.To ? element.To : '00:00'}</p>
										</div>
										{this.state.focusTo == element.Id ?
											<TimePicker
												focused={this.state.focusTo == element.Id}
												withoutIcon={true}
												time={element.To ? element.To : '00:00'}
												theme="material"
												timeMode="24"
												minuteStep={1}
												timezone="Asia/Jerusalem"
												onFocusChange={this.onFocusChangeTo.bind(this, element.Id)}
												onHourChange={this.onHourChangeTo.bind(this, element.Id)}
												onMinuteChange={this.onMinuteChangeTo.bind(this, element.Id)}
											/>
										: null}
									</div>
								</div>
							</div>
						)
					}) : null}
				</div>
			</div>
		)
	}
}
