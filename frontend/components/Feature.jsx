import React from "react";

const Feature = ({getPool}) => {
  return (
    <div className="feature" id="howworks">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 text-center wow fadeInUp" data-wow-duration="0.3s">
            <div className="section-head">
              <h4 className="lasthead">
                How does it works
              </h4>
              <a onClick={()=>getPool()} className="button-1">Pool</a>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default Feature;
