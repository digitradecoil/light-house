import React, { Component } from "react";
import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';


// AddPoint Component Start
class AddPoint extends Component {
	constructor(props){
		super(props);
		this.state = {
			title: '',
			price: '',
			time: '',
			titleError: false,
			priceError: false,
			timeError: false
		}
		this.saveAdress = this.saveAdress.bind(this);
		this.setError = this.setError.bind(this);
	}
	componentDidMount(){
		$('body').addClass('fix');
		$('#root').addClass('blur');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('#root').removeClass('blur');
	}
	setError(){
		!this.state.title ? this.setState({titleError: true}) : null;
		!this.state.price ? this.setState({priceError: true}) : null;
		!this.state.time ? this.setState({timeError: true}) : null;
	}
	saveAdress(){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			Title: this.state.title,
			Price: this.state.price,
			Delivery: this.state.time,
			Coord: JSON.stringify(this.props.state.popup)
		};
		$.ajax({
			url: globalServer + 'polygon_add.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			if(data.result == "success") {
				this.props.saveAdress(data);
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
	render(){
		return (
			<div className="popup add-point">
				<div className="popup-wrapper">
					<div className="wrapp">
						<div onClick={this.props.close} className="close-popup">
							<img src={globalFileServer + 'icons/cross-white.svg'} alt="" />
						</div>
						<div className="top">
							<h2>הוסיפת כתובת</h2>
						</div>
						<div className="contant">
							<div className="inputs">
								<div className="input-wrapp">
									<input
										type="text"
										value={this.state.title}
										onChange={(e) => this.setState({title: e.target.value})}
										onClick={(e) => this.setState({titleError: false})}
										placeholder="שם"
										id="title"
									/>
									<label htmlFor="title">{this.state.titleError ? '!' : null}</label>
								</div>
								<div className="input-wrapp">
									<input
										type="text"
										value={this.state.price}
										onChange={(e) => this.setState({price: e.target.value})}
										onClick={(e) => this.setState({priceError: false})}
										placeholder="מחיר"
										id="price"
									/>
									<label htmlFor="title">{this.state.priceError ? '!' : null}</label>
								</div>
								<div className="input-wrapp">
									<input
										type="text"
										value={this.state.time}
										onChange={(e) => this.setState({time: e.target.value})}
										onClick={(e) => this.setState({timeError: false})}
										placeholder="זמן אספקה"
										id="time"
									/>
									<label htmlFor="title">{this.state.timeError ? '!' : null}</label>
								</div>
							</div>
							<div className="accept">
								<button onClick={this.state.title && this.state.price && this.state.time ? this.saveAdress : this.setError}>אשר</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

// AddPoint Component End

export default class Gis extends Component {
	constructor(props){
		super(props);
		this.state = {
			map: false,
			popup: false,
			polygons: []
		}
		this.loadApi = this.loadApi.bind(this);
		this.overlayComplete = this.overlayComplete.bind(this);
		this.saveAdress = this.saveAdress.bind(this);
		this.close = this.close.bind(this);
		this.getPolygons = this.getPolygons.bind(this);
		this.addPolygons = this.addPolygons.bind(this);
		this.removePolygon = this.removePolygon.bind(this);
	}
	componentWillMount(){
		const script = document.createElement("script");
		script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAmSz5YciOiq-rPQ9Pjy3ntdfB60Swex_s&libraries=places,drawing,geometry&language=he-IL";
		script.async = true;
		script.defer = true;
		script.onload = this.loadApi();
		document.body.appendChild(script);
		this.getPolygons();
	}
	editData(Id, paramName, e){
		let polygons = this.state.polygons;
		polygons.find(x=> x.Id == Id)[paramName] = e.target.value;
		this.setState({polygons});
	}
	editItems(Id, paramName, e){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			id: Id,
			paramName: paramName,
			val: e.target.value
		};
		$.ajax({
			url: globalServer + 'polygon_edit.php',
			type: 'POST',
			data: val
		}).done(function(id, data) {
		}.bind(this, id)).fail(function() { console.log('error'); });
	}
	removePolygon(id){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			id: id,
			paramName: 'Disabled',
			val: 1
		};
		$.ajax({
			url: globalServer + 'polygon_edit.php',
			type: 'POST',
			data: val
		}).done(function(id, data) {
			if(data.result == "success") {
				// let polygons = this.state.polygons.filter(item => item.Id != id);
				// this.setState({polygons});
				location.reload();
			}
		}.bind(this, id)).fail(function() { console.log('error'); });
	}
	deletePolygon(element){
		SweetAlert({
			title: 'Are you sure?',
			text: 'You want to delete this item? You will not be able to restore this!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'delete',
			cancelButtonText: 'cancel'
		}).then(function(element, res) {
			if (res.value) {
				this.removePolygon(element.Id);
			}
		}.bind(this, element)).catch(SweetAlert.noop);
	}
	addPolygons(){
		this.state.polygons.map((item) => {

			let randomColor = this.getRandomColor();
			let opts = {
				paths: item.Coord,
				strokeColor: randomColor,
				strokeOpacity: 0.8,
				strokeWeight: 3,
				fillColor: randomColor,
				fillOpacity: 0.2
			}
			let polygon = new google.maps.Polygon(opts);
			polygon.setMap(this.state.map);

		});

		let randomColor = this.getRandomColor();

		let prePolygon = [];

		let opts = {
			paths: prePolygon,
			strokeColor: randomColor,
			strokeOpacity: 0.8,
			strokeWeight: 3,
			fillColor: randomColor,
			fillOpacity: 0.2
		}
		let polygon = new google.maps.Polygon(opts);
		polygon.setMap(this.state.map);

	}
	getPolygons(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'polygon_view.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			let polygons = data.Polygons;
			polygons.map((item) => {
				item.Coord = JSON.parse(item.Coord)
			});
			this.setState({polygons});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
	overlayComplete(e){
		let randomColor = this.getRandomColor();
		let prePolygon = [];
		if (e.type == "polygon") {
			e.overlay.getPath().b.map((item) => {
				let polygon = {
					lat: item.lat(),
					lng: item.lng()
				}
				prePolygon.push(polygon);
			});
			let opts = {
				paths: prePolygon,
				strokeColor: randomColor,
				strokeOpacity: 0.8,
				strokeWeight: 3,
				fillColor: randomColor,
				fillOpacity: 0.2
			}
			let polygon = new google.maps.Polygon(opts);
			polygon.setMap(this.state.map);
			this.setState({popup: prePolygon});
		}
	}
	loadApi(){
		setTimeout(() => { this.initAPI() }, 1000);
	}
	initAPI(){
		var map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: 32.3354702, lng: 34.7723849},
			zoom: 9,
			mapTypeId: 'roadmap'
		});
		this.setState({map});
		var drawingManager = new google.maps.drawing.DrawingManager({
			drawingMode: google.maps.drawing.OverlayType.MARKER,
			drawingControl: true,
			drawingControlOptions: {
				position: google.maps.ControlPosition.TOP_CENTER,
				drawingModes: ['polygon']
			},
			markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
			polygonOptions: {
				strokeColor: '#000',
				strokeOpacity: 0.3,
				strokeWeight: 3,
				fillColor: '#000',
				fillOpacity: 0
			}
		});
		drawingManager.setMap(map);

		google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
			this.overlayComplete(event);
		});
		var input = document.getElementById('pac-input');
		var card = document.getElementById('pac-card');

		var options = {
			types: ['(cities)'],
			componentRestrictions: {country: "IL"}
		};

		var autocomplete = new google.maps.places.Autocomplete(input, options);
		var infowindow = new google.maps.InfoWindow();
        var infowindowContent = document.getElementById('infowindow-content');
        infowindow.setContent(infowindowContent);
        var marker = new google.maps.Marker({
        	map: map,
	        anchorPoint: new google.maps.Point(0, -29)
        });

		autocomplete.addListener('place_changed', function() {
			infowindow.close();
			marker.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				window.alert("No details available for input: '" + place.name + "'");
				return;
			}
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(17);
			}
			marker.setPosition(place.geometry.location);
			marker.setVisible(true);

			var address = '';
			if (place.address_components) {
				address = [
				    (place.address_components[0] && place.address_components[0].short_name || ''),
				    (place.address_components[1] && place.address_components[1].short_name || ''),
				    (place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}

			infowindowContent.children['place-icon'].src = place.icon;
			infowindowContent.children['place-name'].textContent = place.name;
			infowindowContent.children['place-address'].textContent = address;
			infowindow.open(map, marker);
        }.bind(this));
		setTimeout(() => { this.addPolygons() }, 1000);
	}
	showLocation(location){
		let opts = {
			paths: location,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 3,
			fillColor: '#FF0000',
			fillOpacity: 0.2
		}
		let polygon = new google.maps.Polygon(opts);
		google.maps.Polygon.prototype.getBoundingBox = function() {
			var bounds = new google.maps.LatLngBounds();
			this.getPath().forEach(function(element,index) {
				bounds.extend(element)
			});
			return(bounds);
		};
		let myPolygon = {
			lat: polygon.getBoundingBox().getCenter().lat(),
			lng: polygon.getBoundingBox().getCenter().lng()
		}
		this.state.map.panTo( new google.maps.LatLng( myPolygon ) );
		this.state.map.setZoom(16);
	}
	componentDidMount(){}
	componentWillUnmount(){}
	saveAdress(data){
		let polygon = JSON.parse(data.id);
		polygon.Coord = JSON.parse(polygon.Coord);
		let polygons = this.state.polygons;
		polygons.push(polygon);
		this.setState({polygons, popup: false});
	}
	close(){
		this.setState({popup: false});
	}
	render(){
		return (
			<div className="page gis">
				{this.state.popup ? <AddPoint {...this} /> : null}
				<h1 className="admin-title">מערכת מידע גאוגרפית</h1>
				<div className="container">
					<div className="map">
						<div className="pac-card" id="pac-card">
							<div id="pac-container">
								<input id="pac-input" type="text" placeholder="עיר" />
							</div>
						</div>
						<div id="map"></div>
						<div id="infowindow-content">
							<img src="" width="16" height="16" id="place-icon" />
							<span id="place-name"  className="title"></span><br/>
							<span id="place-address"></span>
						</div>
					</div>
					<div className="edit-polygons">
						{this.state.polygons.length ? this.state.polygons.map((element, index) => {
							return(
								<div key={index} className="polygon-item flex-container">
									<div className="col-lg-4">
										<div className="wr">
											<input
												type="text"
												value={element.Title}
												onChange={this.editData.bind(this, element.Id, 'Title')}
												onBlur={this.editItems.bind(this, element.Id, 'Title')}
												placeholder="שם"
											/>
										</div>
									</div>
									<div className="col-lg-3">
										<div className="wr">
											<input
												type="text"
												value={element.Price}
												onChange={this.editData.bind(this, element.Id, 'Price')}
												onBlur={this.editItems.bind(this, element.Id, 'Price')}
												placeholder="מחיר"
											/>
										</div>
									</div>
									<div className="col-lg-3">
										<div className="wr">
											<input
												type="text"
												value={element.Delivery}
												onChange={this.editData.bind(this, element.Id, 'Delivery')}
												onBlur={this.editItems.bind(this, element.Id, 'Delivery')}
												placeholder="זמן אספקה"
											/>
										</div>
									</div>
									<div className="col-lg-2">
										<ul className="actions">
											<li>
												<button onClick={this.showLocation.bind(this, element.Coord)}>
													<img src={globalFileServer + 'icons/gps.svg'} alt="" />
												</button>
											</li>
											<li>
												<button onClick={this.deletePolygon.bind(this, element)}>
													<img src={globalFileServer + 'icons/delete.svg'} alt="" />
												</button>
											</li>
										</ul>
									</div>
								</div>
							)
						}) : null}
					</div>
				</div>
			</div>
		)
	}
}
