import React, { Component } from "react";

import "./OrderDetails.scss";

class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipping: true
    }
  }
  render() {
    return (
      <div className="order-details">
        <div className="toggle">
          <button onClick={ () => this.setState({ shipping: true }) } className={ this.state.shipping ? "active" : null }>משלוח</button>
          <button onClick={ () => this.setState({ shipping: false }) } className={ !this.state.shipping ? "active" : null }>איסוף עצמי</button>
        </div>
        { this.state.shipping
          ?
            <div>
              <div className="shipping-details">
                <button>בחר כתובת</button>
              </div>
              <div className="table table-2cols">
                <div className="table-cell title">מחיר</div>
                <div className="table-cell price">55.00</div>

                <div className="table-cell title">הנחה</div>
                <div className="table-cell price">55.00</div>

                <div className="table-cell title">דמי משלוח</div>
                <div className="table-cell price">55.00</div>

                <div className="table-cell title">זמן אספקה</div>
                <div className="table-cell price">55.00</div>

                <div className="table-cell title">סה"כ לתשלום</div>
                <div className="table-cell total-price">55.00</div>
              </div>
            </div>

          :
          <div>איסוף עצמי</div>
        }
      </div>
    );
  }
}

export default OrderDetails;
