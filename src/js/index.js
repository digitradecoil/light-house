import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

import Home from './components/routs/Home';
import HomeEng from './components/routs/HomeEng';
import StaffDet from './components/routs/StaffDet';
import StaffDetEng from './components/routs/StaffDetEng';
import Staff from './components/routs/Staff';
import StaffEng from './components/routs/StaffEng';
import AboutUs from './components/routs/AboutUs';
import AboutUsEng from './components/routs/AboutUsEng';
import ContactUsHome from './components/routs/ContactUsHome';
import Gallery from './components/routs/Gallery';
import Pirsing from './components/routs/Pirsing';
import AdminEntry from './components/routs/AdminEntry';
import Header from './components/Header';
import Footer from './components/Footer';

import './App.scss';
require('./globals.js');

if (module.hot) {
	module.hot.accept();
}

const BasicRouter = (prop) => (
	<Router>
		<div>
			<Route {...prop} render={matchProps => (<Header {...matchProps}{...prop}/>)} />
			<main>
				<Switch>
					<Route path="/" exact render={(props) => (<Home {...props}{...prop}/>)} />
					<Route path="/en/home" render={(props) => (<HomeEng {...props}{...prop}/>)} />
					<Route path="/team/:name" render={(props) => (<StaffDet {...props}{...prop}/>)} />
					<Route path="/en/team/:name" render={(props) => (<StaffDetEng {...props}{...prop}/>)} />
					<Route path="/staff" render={(props) => (<Staff {...props}{...prop}/>)} />
					<Route path="/en/staff" render={(props) => (<StaffEng {...props}{...prop}/>)} />
					<Route path="/aboutUs" render={(props) => (<AboutUs {...props}{...prop}/>)} />
					<Route path="/en/aboutUs" render={(props) => (<AboutUsEng {...props}{...prop}/>)} />
					<Route path="/contacts" render={(props) => (<ContactUsHome {...props}{...prop}/>)} />
					<Route path="/en/contacts" render={(props) => (<ContactUsHome {...props}{...prop}/>)} />
					<Route path="/gallery" render={(props) => (<Gallery {...props}{...prop}/>)} />
					<Route path="/en/gallery" render={(props) => (<Gallery {...props}{...prop}/>)} />
					<Route path="/admin-entry" render={(props) => (<AdminEntry {...props}{...prop}/>)} />
					<Route path="/pirsing" render={(props) => (<Pirsing {...props}{...prop}/>)} />
				</Switch>
			</main>
			<Route {...prop} render={matchProps => (<Footer {...matchProps}{...prop} />)} />
		</div>
	</Router>
);
export default BasicRouter;

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			selectedLang: "he",
			staffObj:[]
		}
		this.setLanguage = this.setLanguage.bind(this);
		this.getInfo = this.getInfo.bind(this);
	}
	componentDidMount(){
		this.getInfo();
		if(location.pathname.includes("/en")){
			this.setLanguage("en");
		}
	}
	getInfo(){
		$.ajax({
			url: globalServer + 'getInfo.php',
			type: 'POST'
		}).done(function(data) {
			this.setState({ staffObj: data});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	setLanguage(lang){
		this.setState({selectedLang:lang})
	}
	render() {
		return (
			<BasicRouter {...this} />
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
