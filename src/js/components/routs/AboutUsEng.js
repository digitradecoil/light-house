import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";

export default class AboutUsEng extends Component {
	constructor(props){
		super(props);
		this.state = {
		}
	}
	componentDidMount() {
		setTimeout(() => {
			window.scrollTo(0,0);
		}, 50);
	}
	render(){
		return (
			<div className="page-container about en">
				<Helmet>
					<title>Lighthouse Tattoos in Haifa | About the Studio</title>
					<meta name="description" content="Lighthouse tattoo studio in Haifa. The studio is led by tattoo artists Alex Misura. Some of Haifa’s leading tattoo artists work here with us. We do high precision custom tattoos, in a clean, positive environment. " />
					<meta name="keywords" content="tattoo haifa, lighthouse tattoo, alex misura, shorn sabba, evelin brazhnikov, igor sokolovskii, custom made tattoos, tattoo artist israel" />
          <link rel="canonical" href="https://light-house.co.il" />
      	</Helmet>
				<div className="about-main-cont flex-container">
					<div className="col-lg-6 right-main-cont">
						<div className="right-sub-cont">
							<h1 className="title">Lighthouse, a tattoo studio in Haifa</h1>
							<p>Lighthouse is a tattoo studio in Haifa.
								The studio was established in 2017 by Alex Misura, a painter and an experienced tattoo artist.
								The vision behind Lighthouse was to open a tattoo studio in Haifa which will become a home to the people who go there, staff and clients alike.
							</p>
							<p>The vision became reality. The talented group of artists who work here bring their experience, sensitivity, and the ability to transform any idea into a beautiful, soulful tattoo. </p>
							<p>Each of our artists specializes in different styles: geometric tattoos, tribal, old school, cubist, Japanese, realistic, and more. Together, we cover all known tattoo styles and add our special touch to each work. </p>
							<p>In Lighthouse we help with every request. The inspiration for a tattoo can come from a painting, an image, or a sketch the client has. In other cases, clients tell us their idea for a tattoo. Together we explore their ideas and turn them to perfect custom tattoos.</p>
							<p>We give special attention to accurate work, hygiene, privacy, and a positive approach. </p>
							<p className="quest">Looking for a tattoo studio in Haifa? Have an idea for a tattoo design and you’re looking for the artist who’ll make it a reality? </p>
							<NavLink exact to={"/en/contacts/"}>
								<div className="info-btn-cont">
									<div className="info-btn">Lets talk</div>
								</div>
							</NavLink>
						</div>
					</div>
					<div className="col-lg-6 left-main-cont">
						<div className="left-sub-cont">
							<img className="main-img" src={globalFileServer + 'home/aboutUs.png'}/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
