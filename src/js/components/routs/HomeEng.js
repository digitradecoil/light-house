import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import Slider from 'react-slick';
import ContactUs from "./ContactUsHome";
import {Helmet} from "react-helmet";

let uagent = navigator.userAgent.toLowerCase();
let settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: window.innerWidth > 600 ? true : false,
    rtl: false,
    cssEase: 'ease-in-out',
    speed: 500,
    swipe: true,
    autoplay: true,
    autoplaySpeed: 4000
}

export default class HomeEng extends Component {
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
            <div id="pageContainer" className="page-container home-page en">
              <Helmet>
                <title>Lighthouse Tattoos | Tattoo haifa | About the Studio</title>
                <meta name="description" content="Lighthouse Tattoos in Haifa specializes in all styles of tattoo: tribal tattoos, blackwork, old school, geometric tattoos, and more. We tattoo anything you can imagine: original ideas, images you show us, and more." />
                <meta name="keywords" content="tattoo haifa, lighthouse tattoo, alex misura, shorn sabba, evelin brazhnikov, igor sokolovskii, custom made tattoos, tattoo artist israel" />
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
                  <h1>Haifa’s leading tattoo studio.</h1>
                  <h2>Custom tattoo designs, in every style.</h2>
                </div>
              </section>
              <section id="secondSection" className="second-section">
                <div className="main-cont flex-container">
                  <div className="col-lg-4 main-right-cont">
                    <h2>We Are Lighthouse</h2>
                    <p className="hide-mob quote">“The studio is dark, yet full of light… all the people who come to the studio bring their light with them. That’s why I named this place Lighthouse. It’s the light which brings us home.”</p>
                    <p className="hide-mob author">-Alex Misura founder of Lighthouse</p>
                    <p className="first-p reg-p">We are Lighthouse, a leading tattoo studio in Haifa. We have Haifa’s best tattoo artists, led by Alex Misura - a tattoos expert how lives and breathes painting and art. </p>
                    <p className="hide-mob second-p reg-p">Each of our tattoo artists has their own style specialization. Together, we cover practically all styles of tattoos: old school, tribal, geometric, realistic, Japanese, and more. The unique touch of each of our artists is visible in every work we do. </p>
                    <p className="hide-mob third-p reg-p">We can help with every request for a tattoo: original ideas, recreate an existing image, and more.</p>
                  </div>
                  <div className="col-lg-4 main-img-cont">
                    <img src={globalFileServer + 'home/machine.png'}/>
                  </div>
                  <div className="col-lg-4 main-left-cont">
                    <ul>
                      <li>
                        <img src={globalFileServer + 'home/ribbon.svg'}/>
                        <p>Haifa’s leading tattoo artists</p>
                      </li>
                      <li>
                        <img src={globalFileServer + 'home/support.svg'}/>
                        <p>Clean environment</p>
                      </li>
                      <li>
                        <img src={globalFileServer + 'home/currency.svg'}/>
                        <p>Affordable prices</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>
              <section id="thirdSection" className="third-section">
                <img className="main-img" src={window.innerWidth > 1000 ? globalFileServer + 'home/sec3-skills.png' : globalFileServer + 'home/sec3-skills.jpg'} />
                <div className="main-title">
                  <h1>Our Styles</h1>
                  <h2>Our talented artists can help with every style of tattoo, such as:</h2>
                  <img src={globalFileServer + 'icons/down-arrow.svg'}/>
                </div>
              </section>
              <section id="forthSection" className="forth-section">
                <div className="pierce-cont flex-container">
                  <div className="col-lg-6 right-cont">
                    <div className="text-cont">
                      <h1>piercing</h1>
                      <h2>Our Professional staff specialises in Body Piercing. We give special attention to accurate work, hygiene, privacy, and a positive approach. We believe in a personal touch and accompany our clients throughout all the process.</h2>
                      <NavLink exact to={"/pirsing"}>
                        <div className="info-btn-cont">
                          <div className="info-btn">Gallery</div>
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
                  <h1>Our Artists</h1>
                  <h2>The heart and soul of Lighthouse are the talented tattoo artists who work here, and their unique style and signature. </h2>
                  <img src={globalFileServer + 'icons/down-arrow.svg'}/>
                </div>
              </section>
              <section id="sixthSection" className="sixth-section">
                {this.props.state.staffObj && this.props.state.staffObj.length > 0 ?
                  <div className="main-cont">
                    <div className="all-staff-cont flex-container">
                      {this.props.state.staffObj.map((ele,ind) => {
                        return(
                          <div key={ind} onClick={()=> this.setState({staffId:ele.id})} className="profile-cont col-lg-3">
                            <img className={this.state.staffId == ele.id ? "active" : null} src={globalFileServer + 'home/team/'+ele.id+'.png'}/>
                            <h3>{ele.nameEng}</h3>
                          </div>
                        )
                      })}
                    </div>
                    <div className="staff-det-cont flex-container">
                      <div className="staff-det-sub-cont flex-container">
                        <div className="text-cont col-lg-6">
                          <div className="text-sub-cont col-lg-6 staffEle">
                            <h2>{this.props.state.staffObj[this.state.staffId].nameEng}</h2>
                            <p>{this.props.state.staffObj[this.state.staffId].txt1Eng}</p>
                            <p className="quote">{this.props.state.staffObj[this.state.staffId].txt2Eng}</p>
                            <NavLink exact to={"/en/team/"+this.props.state.staffObj[this.state.staffId].url}>
                              <div className="info-btn-cont">
                                <div className="info-btn">More info and works</div>
                              </div>
                            </NavLink>
                          </div>
                        </div>
                        <div className="img-cont col-lg-6">
                          <img className="staffEle" src={globalFileServer + 'home/team/'+this.props.state.staffObj[this.state.staffId].id+'-big.png'}/>
                        </div>
                      </div>
                    </div>
                  </div>
                :null}
              </section>
              <section id="seventhSection" className="seventh-section">
                <img className="main-img" src={window.innerWidth > 1000 ? globalFileServer + 'home/sec7-gallery.png' : globalFileServer + 'home/sec7-gallery.jpg'}/>
                <div className="main-title">
                  <h1>Work Gallery</h1>
                  <h2>A humble selection out of the hundreds of works we did so far.</h2>
                  <img src={globalFileServer + 'icons/down-arrow.svg'}/>
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
                  <h1>Contact Us</h1>
                  <h2>Want to hear more? Contact us, or drop by:</h2>
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
