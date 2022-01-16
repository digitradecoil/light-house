import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";

export default class AboutUs extends Component {
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
			<div className="page-container about">
        <Helmet>
          <title>מכון קעקועים | מכון פירסינג | קעקועים בצפון</title>
          <meta name="description" content="לייטהאוס מכון קעקועים בחיפה. בראש המכון עומד אמן הקעקועים אלכס מיסיורה. הצוות מונה אמני קעקועים מובילים מאזור חיפה. ניתן להזמין עבודות מותאמות אישית, קיימת הקפדה רבה על היגיינה ודיוק."/>
          <meta name="keywords" content="קעקועים, קעקועים חיפה, קעקועים בחיפה, פירסינג חיפה, פירסינג בחיפה, אלכס קעקועים חיפה, מיקה קעקועים, לייטהאוס קעקועים, מכון קעקועים, אלכס מיסורה, שירן סבג, אוולין ברזניקוב, איגור סוקולבסקי" />
          <link rel="canonical" href="https://light-house.co.il" />
          
        </Helmet>
				<div className="about-main-cont flex-container">
          <div className="col-lg-6 right-main-cont">
            <div className="right-sub-cont">
              <h1 className="title">לייטהאוס מכון קעקועים בחיפה</h1>
              <p>לייטהאוס הוא סטודיו לקעקועים בחיפה.
                הסטודיו הוקם בשנת 2017 על ידי אלכס מיסיורה, צייר ואמן קעקועים בעל שנות ניסיון רבות.
              החזון שעמד מאחורי לייטהאוס הוא לפתוח מכון לקעקועים בחיפה שיהיה בית ומשפחה לאנשים שבאים אליו,  עובדים ולקוחות כאחד. </p>
              <p>החזון התגשם והפך למציאות. צוות האמנים המוכשר שעובד במקום מביא איתו ניסיון, אכפתיות ויכולת להפוך רעיון לקעקוע מלא רגש ועומק.</p>
              <p>כל אמן קעקועים בסטודיו מתמחה בסגנון שונה: גיאומטרי, טרייבל, אולד סקול, קוביסטי, יפני, ריאליסטי, ועוד. יחד, כל האמנים מכסים את כל הסגנונות המוכרים. זאת בנוסף לנגיעה האישית הייחודית שהם מעניקים לכל עבודה. </p>
              <p>בלייטהאוס אנחנו נענים לכל הבקשות. השראה לקעקוע יכולה לבוא מציור, תמונה או סקיצה שמביא הלקוח. לחילופין, אפשר לבוא אלינו עם רעיון או בקשה, ויחד נפתח אותה לקעקוע המושלם עבורכם. </p>
              <p>אנחנו מקפידים על היגיינה ועבודה נקיה, פרטיות, ואווירה חיובית ופתוחה. </p>
              <p className="quest">מחפשים סטודיו קעקועים בחיפה? יש לכם רעיון ואתם מחפשים את האמן שיהפוך אותו למציאות?</p>
              <NavLink exact to={"/contacts/"}>
                <div className="info-btn-cont">
                  <div className="info-btn">דברו אתנו</div>
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
