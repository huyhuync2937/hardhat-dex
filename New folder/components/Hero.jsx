import React, { useEffect, useState } from "react";
import { IoCloseOutline } from 'react-icons/io5'
const Hero = ({
  setInputAmount,
  setLoader,
  setOpenToken,
  LOAD_TOKEN,
  token_1,
  token_2,
  setToken_1,
  setToken_2,
  swap
}) => {
  const reset = () => {
    setToken_1("");
    setToken_2("");
  }
  return <div className="banner" id="home">
    <div className="illustration">
      <ima className="one" src="../public/assets/img/banner-bg-1.png" alt="sdfg" />
      <img alt="sdfg" className="two" src="../public/assets/img/banner-bg-2.png" />
      <img alt="sdfg" className="three" src="../public/assets/img/banner-bg-3.png" />
    </div>
    <div className="hero-area">
      <div className="container">
        <div className="row align-items-center justify-content-between ">
          <div className="col-xl-7 col-lg-6">
            <div className="banner-content wow fadeInUp">
              <h3 className="subtitle"> Fast and convenient</h3>
              <p>Crypto Exchange</p>
            </div>
          </div>
          <div className="col-xl-4 col-lg-6 wow fadeInRightBig">
            <div className="exchange">
              <h5 className="ex-head">Crypto Exchange</h5>
              <div className="exchange-box">
                <div className="selector">
                  <p className="text">Your Change</p>
                  <div className="coin">
                    <span>{token_1?.symbol}</span>
                  </div>
                </div>
                <div>
                  <div className="form-froup">
                    <span onClick={() => setOpenToken(true)}>Open</span>
                    <input type="text" placeholder={token_1?.symbol || "select"}
                      className="form-control" onChange={(e) => setInputAmount(e.target.value)}
                    />
                  </div>
                </div>
                {
                  token_1 ? (
                    <span className="rate">
                      {`Balance: ${token_1?.balance.slice(0, 10)}`} $ {token_1?.symbol}
                    </span>) : (
                    ""
                  )}
              </div>
              <a className="rotate">
                <img src="../public/assets/img/exchange-img.png" alt="" onClick={() => reset()} />
              </a>
              <div className="exchange-box">
                <div className="selector">
                  <p className="text">Your Get</p>
                  <div className="coin">
                    <span>{token_2?.symbol}</span>
                  </div>
                </div>
                <div>
                  <div className="form-froup">
                    <span onClick={() => setOpenToken(true)}>Open</span>
                    <input type="text" placeholder={token_2?.symbol || "select"}
                      className="form-control" onClick={()=>setOpenToken(true)}
                    />
                  </div>
                </div>
                {
                  token_2 ? (
                    <span className="rate">
                      {`Balance: ${token_2?.balance.slice(0, 10)}`} $ {token_2?.symbol}
                    </span>) : (
                    ""
                  )}
              </div>
             <a onClick={()=>swap()} className="button-1">Exchange</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>;
};

export default Hero;
