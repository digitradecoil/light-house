import React, {Component} from 'react';

const Preload = e => {
	if (e.preload) {
		return(
			<div className="spinner-wrapper">
				<div className="spinner">
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</div>
			</div>
		);
	} else return null;
}

export default Preload;
