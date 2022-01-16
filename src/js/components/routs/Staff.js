import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";

let uagent = navigator.userAgent.toLowerCase();

export default class Staff extends Component {
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
			<div className="staff-page">
        <Helmet>
          <title>לייטהאוס  - מכון קעקועים ופירסינג בחיפה</title>
          <meta name="description" content="הכירו את צוות האמנים המוכשרים של לייטהאוס, מכון קעקועים בחיפה. אמני הקעקועים שלנו מתמחים בכל הסוגים: טרייבל, דוט וורק, גיאומטרי, ועוד. בכל עבודה הם משלבים את הטאצ' האישי המיוחד שלהם. "/>
          <meta name="keywords" content="קעקועים, קעקועים חיפה, קעקועים בחיפה, פירסינג חיפה, פירסינג בחיפה, אלכס קעקועים חיפה, מיקה קעקועים, לייטהאוס קעקועים, מכון קעקועים, אלכס מיסורה, שירן סבג, אוולין ברזניקוב, איגור סוקולבסקי" />
          <link rel="canonical" href="https://light-house.co.il" />
        </Helmet>
        {this.props.state.staffObj && this.props.state.staffObj.length > 0 ?
          <div className="staff-page-cont flex-container">
            {this.props.state.staffObj.map((ele,ind) => {
              return(
                <div key={ind} className="col-lg-6 person-main-cont">
                  <div className="person-sub-cont">
                    <NavLink exact to={"/team/"+ele.url}>
                      <img className="staffEle" src={globalFileServer + 'staff_cont/'+ele.id+'/profile-wide.png'}/>
                      <h1>{ele.name}</h1>
                      <p>{ele.txt1}</p>
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
