import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
// import AdminReport from './AdminReport';


export default class OrderHistory extends Component {
	constructor(props){
		super(props);
		this.state = {
			history: [],
			view: 4,
			intervalId: false,
      hideRevealArr:[],
      report:false
		}
		this.getHistory = this.getHistory.bind(this);
		this.timer = this.timer.bind(this);
    this.close = this.close.bind(this);

	}
	componentWillMount(){
		this.getHistory();
	}
	componentDidMount(){
		setTimeout(() => {window.scrollTo(0, 0)}, 100);
		let intervalId = setInterval(this.timer, 3000);
		this.setState({intervalId: intervalId});
	}
	timer(){
		this.getHistory();
	}
	componentWillUnmount(){
		clearInterval(this.state.intervalId);
	}
	getHistory(){
		let val = {
			role: localStorage.role ? localStorage.role : false,
			token: localStorage.token,
      user_id: localStorage.user_id ? localStorage.user_id : false
		};
		$.ajax({
			url: globalServer + 'history_view.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			let history = data.Histories;
      let hideRevealArr = [];
			history.map((item) => {
				item.Products = JSON.parse(item.Products);
				item.UserInfo = JSON.parse(item.UserInfo);
        hideRevealArr.push(false);
			});
			if (JSON.stringify(history) != JSON.stringify(this.state.history)) {
				this.setState({history,hideRevealArr});
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
  hideRevealFunc(index){
    let hideRevealArr = this.state.hideRevealArr;
    hideRevealArr[index] = !hideRevealArr[index];
    this.setState({hideRevealArr});
  }
  close(){
    this.setState({report:false});
  }
	render(){
		return (
			<div className="page admin-history">
        {/* {this.state.report ? <AdminReport {...this} /> : null} */}
				<div className="container">
					<h1 className="title">היסטוריה הזמנות</h1>
          {/* <div className="goToExpPop">
            <p onClick={()=>this.setState({report:true})}>ייצוא דוחות</p>
          </div> */}
					<div className="wrapper">
						<div className="products">
							<div className="wrapp">
								{this.state.history.length ? this.state.history.map((element, index) => {
									if (index < this.state.view) {
										return (
											<div key={index} className="separator">
												<div className="date"><p>{element.Time + " " + element.Date}</p></div>
												<div className="total">
													<div className="peyment-method">
														{element.UserInfo.paymentMethod ?
															<img src={globalFileServer + 'icons/cash.svg'} alt="" />
														:
														<img src={globalFileServer + 'icons/viza.svg'} alt="" />
														}
													</div>
													<div className="flex-container">
														<div className="col-lg-4 quantity">
															<div className="wr">
																{element.UserInfo.deliveryPrice ?
																	<ul>
																		<li className="for-title">
																			<p>פרטי משלוח</p>
																		</li>

																		<li>
																			<p>
																				<span>עיר: </span>
																				<span>{element.UserInfo.town}</span>
																			</p>
																		</li>
																		<li>
																			<p>
																				<span>רחוב: </span>
																				<span>{element.UserInfo.streetName + ' ' + element.UserInfo.streetNumber}</span>
																			</p>
																		</li>
																		<li>
																			{element.UserInfo.houseNumber ? <p>
																				<span>דירה: </span>
																				<span>{element.UserInfo.houseNumber}</span>
																			</p> : null}
																			{element.UserInfo.entry ? <p className="second">
																				<span>כניסה: </span>
																				<span>{element.UserInfo.entry}</span>
																			</p> : null}
																			{element.UserInfo.floor ? <p className="second">
																				<span>קומה: </span>
																				<span>{element.UserInfo.floor}</span>
																			</p> : null}
																		</li>
                                    <li>
                                      {element.UserInfo.entryCode ? <p>
																				<span>קוד כניסה: </span>
																				<span>{element.UserInfo.entryCode}</span>
																			</p> : null}
                                    </li>
																		{element.UserInfo.presentTel2 ?
																			<li>
																				<p>
																					<span>טלפון 2: </span>
																					<span>{element.UserInfo.presentTel2}</span>
																				</p>
																			</li> : null}
																	</ul>
																:
																<ul>
																	<li><p>איסוף עצמי</p></li>
																</ul>
																}
															</div>
														</div>
														<div className="col-lg-4 price">
															<div className="wr">
																<ul>
																	<li className="for-title">
																		<p>מידע על הלקוח</p>
																	</li>
																	<li>
																		<p>{element.UserInfo.user_name}</p>
																	</li>
																	<li>
																		<p>{element.UserInfo.email}</p>
																	</li>
																	<li>
																		<p>{element.UserInfo.phone}</p>
																	</li>
                                  <li>
																		<p>{element.UserInfo.bday}</p>
																	</li>
																</ul>
															</div>
														</div>
														<div className="col-lg-4 actions">
															<div className="wr">
																<ul>
																	<li className="for-title">
																		<p>סיכום</p>
																	</li>
																	<li>
																		<p>
																			<span>לפני משלוח: </span>
																			<span>{element.UserInfo.price}</span>
																		</p>
																	</li>
																	<li>
																		<p>
																			<span>דמי משלוח: </span>
																			<span>{element.UserInfo.deliveryPrice}</span>
																		</p>
																	</li>
																	<li>
																		<p>
																			<span>סה''כ: </span>
																			<span>{element.UserInfo.fullPrice}</span>
																		</p>
																	</li>
																</ul>
															</div>
														</div>
                            {element.UserInfo.comment || element.UserInfo.presentMessage ?
    													<div className="general-comment col-lg-6">
    														{element.UserInfo.comment ?
    															<div>
    																<p className="for-title">הערות לקוח:</p>
    																<p>{element.UserInfo.comment}</p>
    															</div>
    														: null}
    													</div>
    												: null}
                            <div className="hideRevealBtn"
                              onClick={this.hideRevealFunc.bind(this,index)}>
                              <img src= {!this.state.hideRevealArr[index] ? globalFileServer + 'icons/open_btn.png' : globalFileServer + 'icons/close_btn.png'}/>
                            </div>
													</div>
												</div>

												<div className={this.state.hideRevealArr[index] ? "items" : "items hidden"}>
													{element.Products.length ? element.Products.map((ele, ind) => {
                            return (
                              <div key={ind} className="item">
                                <div className="flex-container">
                                  <div className="col-lg-2 img">
                                    <div className="wr">
                                      <img onError={(e) => e.target.src = globalFileServer + 'products/product.jpg'} src={globalFileServer + 'products/' + ele.product.CatalogNum + ".jpg"} alt="" />
                                    </div>
                                  </div>
                                  <div className="col-lg-4 title">
                                    <div className="wr">
                                      <ul>
                                        <li><p>{ele.product.ProdName}</p></li>
                                        <li>
                                          <p className="price">
                                            {ele.quantity && ele.quantity > 0 ? <span className="quan">{ele.quantity + " x "}</span> : null}
                                            <span className="p">{ele.product.ProdPrice}</span>
                                          </p>
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
													}) : null}
												</div>
											</div>
										)
									}
								}) : null}
							</div>
						</div>
						{this.state.history.length > this.state.view ?
							<button className="view-more" onClick={() => this.setState({view: this.state.view + 4})}>ראה עוד</button>
						: null}
						<audio id="audio" className="my-audio" controls preload="none">
							<source src={globalFileServer + 'beep.mp3'} type="audio/mpeg" />
						</audio>
					</div>
				</div>
			</div>
		)
	}
}
