import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";

let uagent = navigator.userAgent.toLowerCase();

export default class StaffEng extends Component {
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
    let props = Object.assign({}, this.props);
		return (
			<div className="staff-page en">
        <Helmet>
          <title>Lighthouse Tattoos | Tattoo haifa | About the Studio</title>
          <meta name="description" content="Meet the talented artists working here at Lighthouse Tattoo Studio in Haifa. Our tattoo artists specialize in all styles of tattoos: tribal, dot work, geometric, and more. Their original touch can be seen in every work." />
          <meta name="keywords" content="tattoo haifa, lighthouse tattoo, alex misura, shorn sabba, evelin brazhnikov, igor sokolovskii, custom made tattoos, tattoo artist israel" />
          <link rel="canonical" href="https://light-house.co.il" />
        </Helmet>
        {this.props.state.staffObj && this.props.state.staffObj.length > 0 ?
          <div className="staff-page-cont flex-container">
            {this.props.state.staffObj.map((ele,ind) => {
              return(
                <div key={ind} className="col-lg-6 person-main-cont">
                  <div className="person-sub-cont">
                    <NavLink exact to={"/en/team/"+ele.url}>
                      <img className="staffEle" src={globalFileServer + 'staff_cont/'+ele.id+'/profile-wide.png'}/>
                      <h1>{ele.nameEng}</h1>
                      <p>{ele.txt1Eng}</p>
                    </NavLink>
                    <div className="social-main-cont">
                      <div className="social-cont">
                        <span>
                          <a href={ele.facebook} target="_blank"><img src={globalFileServer + 'home/contact/facebook-circle.svg'} /></a>
                        </span>
                        <span>
                          <a href={ele.instagram} target="_blank"><img src={globalFileServer + 'home/contact/instagram-circle.svg'} /></a>
                        </span>
                        <span>
                          <a href={"tel:+972" + ele.phone} target="_blank"><img src={globalFileServer + 'home/contact/phone-circle.svg'} /></a>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        :null}
      </div>
		)
	}
}
