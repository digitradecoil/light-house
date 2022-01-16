import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Slider from 'react-slick';
import ContactUs from "./ContactUsHome";
import {Helmet} from "react-helmet";

let settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: window.innerWidth > 1000 ? true : false,
    rtl: false,
    cssEase: 'ease-in-out',
    speed: 500,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 4000
}

export default class Home extends Component {
  state = {
    galArr: [],
    staffId: 0
  }
  componentDidMount = () => {
    setTimeout(() => { window.scrollTo(0,0) }, 200);
    this.getItems();
  }
  getItems = () => {
    let val = {
      funcName: 'getHomeItems',
      type: 5
    };
    $.ajax({
      url: globalServer + 'global.php',
      type: 'POST',
      data: val,
    }).done(function(data) {
      this.setState({
        galArr: data.Items
      });
    }.bind(this)).fail(function() {	console.log("error"); });
  }
    render(){
        return (
            <div id="pageContainer" className="page-container home-page">
              <Helmet>
                <title>לייטהאוס קעקועים | קעקועים בחיפה | פירסינג חיפה</title>
                <meta name="description" content="לייטהואס מכון קעקועים בחיפה, מתמחים בכל סוגי הקעקועים: טרייבל, בלאקוורק, אולד סקול, גיאומטרי, ועוד. קעקועים בהתאמה אישית, לפי דוגמה או עיצוב מקורי ממיטב אמני הקעקועים בחיפה. " />
                <meta name="keywords" content="קעקועים, קעקועים חיפה, קעקועים בחיפה, פירסינג חיפה, פירסינג בחיפה, אלכס קעקועים חיפה, מיקה קעקועים, לייטהאוס קעקועים, מכון קעקועים, אלכס מיסורה, שירן סבג, אוולין ברזניקוב, איגור סוקולבסקי" />
                <link rel="canonical" href="https://light-house.co.il" />
              </Helmet>
              <section id="firstSection" className="first-section">
                <Slider {...settings}>
                  <div className="img">
                    <img src={window.innerWidth > 1000 ? globalFileServer + 'home/sec1-1.png' : globalFileServer + 'home/sec1-1-mob.jpg'}/>
                  </div>
                  <div className="img">
                    <img src={window.innerWidth > 1000 ? globalFileServer + 'home/sec1-2.png' : globalFileServer + 'home/sec1-2-mob.jpg'}/>
                  </div>
                  <div className="img">
                    <img src={window.innerWidth > 1000 ? globalFileServer + 'home/sec1-3.png' : globalFileServer + 'home/sec1-3-mob.jpg'}/>
                  </div>

                </Slider>
                <div className="main-title">
                  <img src={globalFileServer + 'home/big-logo.png'}/>
                  <h1>מכון הקעקועים המוביל בחיפה.</h1>
                  <h2>כל הסגנונות בהתאמה אישית, ממיטב אמני הקעקועים של חיפה.</h2>
                </div>
              </section>
              <section id="secondSection" className="second-section">
                <div className="main-cont flex-container">
                  <div className="col-lg-4 main-right-cont">
                    <h2>אנחנו לייטהאוס</h2>
                    <p className="hide-mob quote">"הסטודיו חשוך, ועדיין יש בו המון אור… אור שמביאים האנשים שבאים אליו כל יום. בגלל זה קראתי למקום לייטהאוס, מגדלור. אור שמביא אותנו הביתה.”</p>
                    <p className="hide-mob author">אלכס מיסיורה, מייסד לייטהאוס</p>
                    <p className="first-p reg-p">אנחנו לייטהואס, מכון קעקועים מוביל בחיפה. בסטודיו פועלים מיטב אמני הקעקועים של חיפה והאזור, ובראשם אלכס מיסיורה, אמן קעקועים שחי ונושם ציור ואמנות. </p>
                    <p className="hide-mob second-p reg-p">לכל אחד מאמני הקעקועים שלנו ההתמחויות והסגנונות האהובים עליו. יחד, אנחנו מכסים את כל סוגי הקעקועים שניתן לחשוב עליהם: אולד סקול, טרייבל, גיאומטרי, ריאליסטי, יפני, ועוד. לכל אמן בסטודיו  אופי וסגנון ייחודיים ומקוריים, שבאים לידי ביטוי בכל עבודה. </p>
                    <p className="hide-mob third-p reg-p">ניתן להזמין עבודות מקוריות, לפי תמונה, או לבחור מהקטלוג שבסטודיו. </p>
                  </div>
                  <div className="col-lg-4 main-img-cont">
                    <img src={globalFileServer + 'home/machine.png'}/>
                  </div>
                  <div className="col-lg-4 main-left-cont">
                    <ul>
                      <li>
                        <img src={globalFileServer + 'home/ribbon.svg'}/>
                        <p>אמני הקעקועים המובילים בחיפה</p>
                      </li>
                      <li>
                        <img src={globalFileServer + 'home/support.svg'}/>
                        <p>סביבה נקיה והיגיינית</p>
                      </li>
                      <li>
                        <img src={globalFileServer + 'home/currency.svg'}/>
                        <p>מחירים שווים לכל נפש</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
              <section id="thirdSection" className="third-section">
                <img className="main-img" src={window.innerWidth > 1000 ? globalFileServer + 'home/sec3-skills.png' : globalFileServer + 'home/sec3-skills.jpg'}/>
                <div className="main-title">
                  <h1>סטייל וסגנונות</h1>
                  <h2>הצוות המוכשר שלנו מתמחה בכל סגנונות הקעקועים והפירסינג.</h2>
                  <img src={globalFileServer + 'icons/down-arrow.svg'}/>
                </div>
              </section>
              <section id="forthSection" className="forth-section">
                <div className="pierce-cont flex-container">
                  <div className="col-lg-6 right-cont">
                    <div className="text-cont">
                      <h1>פירסינג</h1>
                      <h2>אנו מבצעים את כל סוגי הפירסינג הקיימים והבטוחים ביותר לעשייה
מתמחים בפירסינג איכותי. בשימוש בחומרים הכי איכותיים, עגילי טיטניום וזהב מלא בלבד שתואם את הסטנדרטים העולמיים של מתכות לשימוש בגוף האדם.</h2>
                      <NavLink exact to={"/pirsing"}>
                        <div className="info-btn-cont">
                          <div className="info-btn">גלריה</div>
                        </div>
                      </NavLink>
                    </div>
                  </div>
                  <div className="col-lg-6 left-cont">
                    <div className="img-cont">
                      <img src={globalFileServer + 'home/styles/piercing.png'}/>
                    </div>
                  </div>
                </div>
              </section>
              <section id="fifthSection" className="fifth-section">
                <img className="main-img" src={window.innerWidth > 1000 ? globalFileServer + 'home/sec5-team.png' : globalFileServer + 'home/sec5-team.png'}/>
                <div className="main-title">
                  <h1>האמנים שלנו</h1>
                  <h2>הלב והנשמה של הסטודיו הם אמני הקעקועים המוכשרים שלנו, כל אחד עם סגנון ואמירה משלו. בואו תכירו. </h2>
                  <img src={globalFileServer + 'icons/down-arrow.svg'}/>
                </div>
              </section>
              <section id="sixthSection" className="sixth-section">
                {this.props.state.staffObj && this.props.state.staffObj.length > 0 ?
                  <div className="main-cont">
                    <div className="all-staff-cont flex-container">
                      {this.props.state.staffObj.map((ele,ind) => {
                        return(
                          <div key={ind} onClick={()=> this.setState({staffId:ind})} className="profile-cont col-lg-3">
                            <img className={this.state.staffId == ele.id ? "active" : null} src={globalFileServer + 'home/team/'+ele.id+'.png'}/>
                            <h3>{ele.name}</h3>
                          </div>
                        )
                      })}
                    </div>
                    <div className="staff-det-cont flex-container">
                      <div className="staff-det-sub-cont flex-container">
                        <div className="text-cont col-lg-6">
                          <div className="text-sub-cont col-lg-6 staffEle">
                            <h2>{this.props.state.staffObj[this.state.staffId].name}</h2>
                            <p>{this.props.state.staffObj[this.state.staffId].txt1}</p>
                            <p className="quote">{this.props.state.staffObj[this.state.staffId].txt2}</p>
                            <NavLink exact to={"/team/"+this.props.state.staffObj[this.state.staffId].url}>
                              <div className="info-btn-cont">
                                <div className="info-btn">מידע ועבודות</div>
                              </div>
                            </NavLink>
                          </div>
                        </div>
                        <div className="img-cont col-lg-6">
                          <img className="staffEle" src={globalFileServer + 'home/team/'+this.props.state.staffObj[this.state.staffId].id+'-big.png?20:21'}/>
                        </div>
                      </div>
                    </div>
                  </div>
                :null}
              </section>
              <section id="seventhSection" className="seventh-section">
                <img className="main-img" src={window.innerWidth > 1000 ? globalFileServer + 'home/sec7-gallery.png' : globalFileServer + 'home/sec7-gallery.jpg'}/>
                <div className="main-title">
                  <h1>גלריית עבודות</h1>
                  <h2>מבחר קטן ממאות העבודות שכבר עשינו אצלנו בסטודיו לקעקועים לייטהאוס בחיפה.</h2>
                  <NavLink exact to={"/gallery"}>
                    <div className="info-btn-cont">
                      <div className="info-btn">גלריית קעקועים</div>
                    </div>
                  </NavLink>
                </div>
              </section>
              <section id="eighthSection" className="eighth-section">
                <div className="main-cont">
                  {this.state.galArr.map((e,i) => {
                    if (i < 12) {
                    return(
                      <div key={i} className="img-cont">
                        <img src={globalFileServer + 'home_items/'+e.Img}/>
                      </div>
                    )}
                  })}
                </div>
              </section>
              <section id="ninthSection" className="ninth-section">
                <img className="main-img" src={window.innerWidth > 1000 ? globalFileServer + 'home/sec9-contact.png' : globalFileServer + 'home/sec9-contact.jpg'}/>
                <div className="main-title">
                  <h1>צרו קשר</h1>
                  <h2>רוצים לשמוע עוד? צרו אתנו קשר או בואו לבקר</h2>
                  <img src={globalFileServer + 'icons/down-arrow.svg'}/>
                </div>
              </section>
              <div className="contact-home-sec">
                <ContactUs {...this.props}/>
              </div>
            </div>
            )
        }
    }
