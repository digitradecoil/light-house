import React, { Component } from 'react';


export default class YouTubeBanner extends Component {
	constructor(props){
		super(props);
		this.state = {
			play: false,
			workHovers: false,
			mobile: false
		}
		this.handleScroll = this.handleScroll.bind(this);
	}
	componentWillMount(){}
	componentDidMount(){
		if (window.outerWidth > 800) {
			window.addEventListener('scroll', this.handleScroll, true);
		} else {
			this.setState({mobile: true});
			let video = document.getElementById("video_1");
			var vid_2 = document.getElementById("video_2");
			let promise = video.play();
			if (promise === undefined) {
				console.log('Promisified video play() not supported');
			} else {
				promise.then(function() {
					console.log('Video playback successfully initiated, returning a promise');
				}).catch(function(error) {
					console.log('Error initiating video playback: ', error);
				});
			}
			let prom = vid_2.play();
			if (prom === undefined) {
				console.log('Promisified video play() not supported');
			} else {
				prom.then(function() {
					console.log('Video playback successfully initiated, returning a promise');
				}).catch(function(error) {
					console.log('Error initiating video playback: ', error);
				});
			}
		}
	}
	componentWillUnmount(){
		if (window.outerWidth > 800) {
			window.removeEventListener('scroll', this.handleScroll, true);
		}
	}
	handleScroll(e) {
		let el = document.getElementById('banners_youtube');
		if (e.currentTarget.pageYOffset > 250 && !this.state.play) {
			this.setState({play: true});
			var vid = document.getElementById("video_1");
			vid.autoplay = true;
			vid.playsinline = true;
			vid.load();
			var vid_2 = document.getElementById("video_2");
			vid_2.autoplay = true;
			vid_2.playsinline = true;
			vid_2.load();
		}
	}
	render(){
		return (
			<section id="banners_youtube" className="banners-youtube">
				<div className={this.state.workHovers ? "corner-contact active" : "corner-contact"}>
					<div onClick={() => this.setState({workHovers: !this.state.workHovers})} className="phone active">
						<img src={globalFileServer + 'icons/phone.svg'} alt="" />
					</div>
					<div className="contact-wrapper">
						<h2>שעות עבודה</h2>
						<div className="time flex-container">
							<div className="col-lg-6">
								<p>א-ה</p>
								<p>ו-</p>
								<p>ש-</p>
							</div>
							<div className="col-lg-6">
								<p>12.00 - 23.00</p>
								<p>12.00 - 18.00</p>
								<p>19.00 - 23.00</p>
							</div>
						</div>
						<div className="contact-wrapper">
							<h2>להזמנות</h2>
							<h3><a href="tel:04-689-88-81">04-689-88-81</a></h3>
						</div>
					</div>
				</div>
				{!this.state.mobile ?
				<div className="banners-wrapper flex-container">
					<div className="col-lg-6 user">
						<div className="wrapp">
							<video id="video_1" controls={false} loop={true} muted preload="none">
								<source src={globalFileServer + 'r.mp4'} type="video/mp4" />
								<source src={globalFileServer + 'r.webm'} type="video/webm" />
							</video>
						</div>
					</div>
					<div className="col-lg-6 user">
						<div className="wrapp">
							<video id="video_2" controls={false} loop={true} muted preload="none">
								<source src={globalFileServer + 'l.mp4'} type="video/mp4" />
								<source src={globalFileServer + 'l.webm'} type="video/webm" />
							</video>
						</div>
					</div>
				</div>
				:
				<div className="banners-wrapper flex-container">
					<div className="col-lg-6 user">
						<div className="wrapp">
							<video id="video_1" autoplay muted loop={true} playsinline>
								<source src={globalFileServer + 'r.webm'} type="video/webm" />
								<source src={globalFileServer + 'r.mp4'} type="video/mp4" />
							</video>
						</div>
					</div>
					<div className="col-lg-6 user">
						<div className="wrapp">
							<video id="video_2" autoplay muted loop={true} playsinline>
								<source src={globalFileServer + 'l.webm'} type="video/webm" />
								<source src={globalFileServer + 'l.mp4'} type="video/mp4" />
							</video>
						</div>
					</div>
				</div>
				}
			</section>
		)
	}
}
