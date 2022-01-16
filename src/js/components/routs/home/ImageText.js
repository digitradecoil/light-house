import React, { Component } from 'react';


export default class ImageText extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	render(){
		return (
			<section style={{backgroundImage: 'url(' + globalFileServer + 'odot.jpg)'}} id="about" className="image-text">
				<div className="wrapper">
					<div className="wrapp">
						<div className="logo">
							<img src={globalFileServer + 'logo.svg'} alt="" />
						</div>
						<span>
							הוא פשוט טקסט גולמי של תעשיית ההדפסה וההקלדה. Lorem Ipsum היה טקסט סטנדרטי עוד במאה ה-16,
							כאשר הדפסה לא ידועה לקחה מגש של דפוס ועירבלה אותו כדי ליצור סוג של ספר דגימה. ספר זה שרד לא רק
							חמש מאות שנים אלא גם את הקפיצה לתוך ההדפסה האלקטרונית, ונותר כמו שהוא ביסודו. ספר זה הפך פופולרי
							יותר בשנות ה-60 עם ההוצאה לאור של גליון פונטי המכיל פסקאות של Lorem Ipsum. ועוד יותר לאחרונה עם פרסום
							תוכנות המחשב האישי כגון Aldus page maker שמכיל גרסאות של Lorem Ipsum
						</span>
					</div>
				</div>
			</section>
		)
	}
}
