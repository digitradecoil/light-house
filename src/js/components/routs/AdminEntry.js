import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import UserEntry from './modals/UserEntry';
import Preload from "../tools/Preload";
import SweetAlert from 'sweetalert2';
import MyCropperNext from "../tools/MyCropperNext";

export default class AdminEntry extends Component {
	state = {
		preload: false,
		items: [],
		type: 5
	}
	componentDidMount = () => {
		this.getItems(5);
		setTimeout(() => window.scrollTo(0, 0), 200);
	}
	uploadImg = data => {
		let val = {
			funcName: 'uploadImg',
			token: localStorage.token,
			role: localStorage.role,
			img: data.img,
			fileName: data.fileName,
			folder: data.folder,
			type: this.state.type
		};
		$.ajax({
			url: globalServer + 'global.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let items = this.state.items;
			items.push(data);
			items.sort((a, b) => b.Id - a.Id);
			this.setState({items});
		}.bind(this)).fail(function() {	this.unsetPreload(); }.bind(this));
	}
	deleteItem = id => {
    SweetAlert({
      title: 'האם אתה בטוח?',
      text: 'האם ברצונך למחוק פריט זה? לא תוכל לשחזר זאת!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22b09a',
      cancelButtonColor: '#d80028',
      confirmButtonText: 'מחק',
      cancelButtonText: 'בטל'
    }).then(function(id, res) {
      if (res.value) {
        let items = this.state.items.filter(item => item.Id != id);
        this.setState({items});
        let val = {
          token: localStorage.token,
          role: localStorage.role,
          funcName: 'deleteItem',
          itemId: id
        };
        $.ajax({
          url: globalServer + 'global.php',
          type: 'POST',
          data: val,
        }).done(function(data) {
        }.bind(this)).fail(function() {	this.unsetPreload(); }.bind(this));
      }
    }.bind(this, id)).catch(SweetAlert.noop);
  }
	getItems = type => {
    let val = {
			funcName: 'getHomeItems',
			type: type
		};
    $.ajax({
      url: globalServer + 'global.php',
      type: 'POST',
      data: val,
    }).done(function(data) {
      this.setState({
        items: data.Items
      });
    }.bind(this)).fail(function() {	console.log("error"); });
  }
	setType = type => {
		this.setState({type});
		this.getItems(type);
	}
  setPreload = () => { this.setState({preload: true}); }
	unsetPreload = () => { this.setState({preload: false}); }
	render(){
		return (
			<div className="upload-img">
				{localStorage.role ?
					<section className="section-seventh">
	          <div className="container">
	            <ul className="tubs">
								<li className={this.state.type == 5 ? 'active' : null} onClick={e => this.setType(5)}>קעקועים</li>
								<li className={this.state.type == 6 ? 'active' : null} onClick={e => this.setType(6)}>פירסינג</li>
							</ul>
	          </div>
	          <div className="container items-container">
	            <Preload preload={this.state.preload} />
							<div className="add-item">
	              <MyCropperNext
	                aspectRatio={16/9}
	                folder="home_items"
	                uploadImg={this.uploadImg}
	                setPreload={this.setPreload}
	                unsetPreload={this.unsetPreload}
	              />
	            </div>
	            <div className="items flex-container">
	              {this.state.items.map((element, index) => {
                  return(
                    <div key={index} className="item col-lg-3">
                      <div className="img">
                        <div onClick={ e => this.deleteItem(element.Id) } className="close">
                          <img src={globalFileServer + 'icons/trash.svg'} />
                        </div>
                        <img onLoad={this.state.preload ? this.unsetPreload() : null} src={globalFileServer + 'home_items/' + element.Img} />
                      </div>
                    </div>
                  );
	              })}
	            </div>
	          </div>
	        </section>
				: <UserEntry />}
			</div>
		)
	}
}
