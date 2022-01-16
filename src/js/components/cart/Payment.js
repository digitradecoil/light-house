import React, { Component } from 'react';

// Styles
import './Payment.scss';

export default class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shipping: true,
      comment: false
    };
  }

  render() {
    return (
      <div className="payment-wrapper">
        <div className="toggle-shipping">
          <ul>
            <li
              onClick={ () => this.setState({ shipping: true }) }
              className={ this.state.shipping ? "active" : null }>משלוח</li>
            <li
              onClick={ () => this.setState({ shipping: false }) }
              className={ !this.state.shipping ? "active" : null }>איסוף עצמי</li>
          </ul>
        </div> {/* .toggle-shipping */}
        <div><h2>הערות לשליח</h2></div>
        <div className={ {/* COMMENTS */} }>
          <textarea
            placeholder=""
            onChange={ text => this.setState({ comment: text.target.value }) }>
            { this.state.comment ? this.state.comment : "" }
          </textarea>
        </div> {/* .comments */}
        <div><h2>סיכום</h2></div>
        <div className="first-price">
          <ul>
            <li>
              <span className="title">מחיר:</span>
              <span className="price">100</span>
            </li>
            <li>
              <span className="title">דמי משלוח:</span>
              <span className="price">99</span>
            </li>
            <li>
              <span className="title">זמן אספקה:</span>
              <span className="time">3</span>
            </li>
          </ul>
        </div> {/* .first-price */}
        <div className="final-price">
          <span className="title">סה"כ לתשלום:</span>
          <span className="price">199</span>
        </div> {/* final-price */}
        <div className="toggle-payment">
          <ul>
            <li>
              <button>אשראי</button>
            </li>
            <li>
              <button>מזומן</button>
            </li>
          </ul>
        </div> {/* .toggle-payment */}
        <div className="terms-and-conditions"></div> {/* terms-and-conditions */}
        <div className="pay">
          <button>לתשלום</button>
        </div> {/* .pay */}
        <div className="payment-icons"></div> {/* .payment-icons */}
      </div>
    );
  }
}
