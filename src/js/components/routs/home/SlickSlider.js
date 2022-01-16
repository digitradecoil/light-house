import React, { Component } from 'react';
import Slider from 'react-slick';


export default class SlickSlider extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [
				{ id: 1, img: '1.jpg' },
				{ id: 2, img: '2.jpg' },
				{ id: 3, img: '3.jpg' }
			]
		}
	}
	render(){
		let settings = [];
		if (window.innerWidth < 600) {
			settings = {
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 3000,
				speed: 3000,
				dots: true,
				pauseOnHover: false
			}
		} else {
			settings = {
				slidesToShow: 1,
				slidesToScroll: 1,
				infinite: false,
				autoplay: true,
				autoplaySpeed: 4000,
				speed: 4000,
				swipe: false,
				swipeToSlide: false,
				dots: true,
				cssEase: 'linear',
				pauseOnHover: false
			}
		}
		return (
			<section className="slider">
				<Slider {...settings}>
					{this.state.items.map((element, index) => {
						return(
							<div key={element.id}>
								{window.innerWidth > 600 ? <img src={globalFileServer + 'slider/' + element.img} alt="" /> :
									<img src={globalFileServer + 'slider/mini/' + element.img} alt="" />
								}
							</div>
						)
					})}
				</Slider>
			</section>
		)
	}
}
