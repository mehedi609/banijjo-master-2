import React,{Component} from 'react';

class Header extends Component{
    
    render(){
        let url = "http://admin.banijjo.com.bd";
        return (
            <React.Fragment>
            <div className="top-bar">
            <div className="row">
               <div className="top-bar-left">
                  </div>
                  <div className="top-bar-right">
                     <ul className="menu">
                        <li>
                        </li>
                        <li>
                        </li>
                     </ul>
                  </div>
               </div>
            </div>
            <div className="row">
                    <div className="medium-10 columns" style="background-color:#e6e7e8">
                       <ul className="dropdown menu" data-dropdown-menu style="font-size: 13px;">
                          <li className="has-submenu">
                             <a href="http://admin.banijjo.com.bd/login" target="__blank">Seller Center |</a>
                        
                             </li>
                             <li className="has-submenu">
                                <a href="#">Help |</a>
                                <ul className="submenu menu vertical" data-submenu>
                                   <li><a href="#">Demo</a></li>
                                </ul>
                             </li>
                             <li className="has-submenu">
                                <a href="#">Buyer Protection |</a>
                                <ul className="submenu menu vertical" data-submenu>
                                   <li><a href="#">Demo</a></li>
                                </ul>
                             </li>
                             <li className="has-submenu">
                                <a href="#"><i className="fa fa-mobile" aria-hidden="true"></i> App |</a>
                                <ul className="submenu menu vertical" data-submenu>
                                   <li><a href="#">Demo</a></li>
                                </ul>
                             </li>
                             <li className="has-submenu">
                                <a href="#">Taka/USD |</a>
                                <ul className="submenu menu vertical" data-submenu>
                                   <li><a href="#">Demo</a></li>
                                </ul>
                             </li>
                             <li className="has-submenu">
                                <a href="#">Bangla/English |</a>
                                <ul className="submenu menu vertical" data-submenu>
                                   <li><a href="#">Demo</a></li>
                                </ul>
                             </li>
                             <li className="has-submenu">
                                <a href="#"><i className="fa fa-heart-o" aria-hidden="true"></i> Wish List |</a>
                                <ul className="submenu menu vertical" data-submenu>
                                   <li><a href="#">Demo</a></li>
                                </ul>
                             </li>
                             <li className="has-submenu">
                                
                                <a href="#"><i className="fa fa-user-o" aria-hidden="true"></i> Account |</a>
                                <ul className="dropdown-menu">
                                   <li>
                                      <div className="navbar-login">
                                         <div className="row">
                                         <div className="col-lg-12">
                                            <p className="text-left" style="padding-left: 10px;"><strong>Welcome to Banijjo!</strong></p>
                                            <div className="col-lg-6">
                                               <p className="text-left">
                                                  <a id="registerButton" target="__blank" href="http://admin.banijjo.com.bd/register" className="btn btn-block btn-sm">Register</a>
                                               </p>
                                            </div>
                                            <div className="col-lg-6">
                                               <p className="text-left">
                                                  <a id="loginButton" target="__blank" href="http://admin.banijjo.com.bd/login" className="btn btn-block btn-sm">Sign In</a>
                                               </p>
                                            </div>
                                         </div>
                                      </div>
                                   </div>
                                </li>
                                <li><a href="#">My Orders</a></li>
                                <li><a href="#">Message Center<span className="unread-message-count"></span></a></li>
                                <li><a href="#">Wish List</a></li>
                                <li><a href="#">My Favorite Stores</a></li>
                                <li><a href="#">My Coupons</a></li>
                             </ul>
                          </li>
                          <li className="has-submenu">
                             <a href="#"><img src="/image/bd_small.png" alt="Banijjo logo"/></a>
                          </li>
                       </ul>
                    </div>
                 </div>
            
            </React.Fragment>

            )
        }
    }
    
    export default Header;