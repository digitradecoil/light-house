import React, { Component } from 'react';
import Slider from 'react-slick';


let settings = {
	dots: false,
	autoplay: true,
	infinite: true,
	speed: 500,
	autoplaySpeed: 4000,
	slidesToShow: 4,
	slidesToScroll: 1,
	responsive: [{
			breakpoint: 1100,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			}
		}, {
			breakpoint: 800,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		}, {
			breakpoint: 480,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			}
		}]
};

export default class Brands extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [
				{Id: 0, Img: "brands1"},
				{Id: 1, Img: "brands2"},
				{Id: 2, Img: "brands3"},
				{Id: 3, Img: "brands4"}
			]
		}
	}
	render(){
		return (
			<section id="brands" className="brands">
				<div className="container">
				{ this.state.items.length ?
					<Slider {...settings}>
						{this.state.items.map((element, index) => {

							return (
								<div key={element.Id}>

									<div className="wrapp">
										<div className="img">
												<img
													onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'}
													src={globalFileServer + element.Img + ".jpg"}
												/>

										</div>

									</div>
								</div>
							);
						})}
					</Slider>
				: null}
				</div>

			</section>
		)
	}
}
