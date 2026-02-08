import React from "react";
import image1 from "./../assets/pexels-esmanur-m-280716932-13003306.jpg";

function EnjoyLearning() {
  return (
   <>
  <section className="EnjoyLearning">
    <div className="container">

    <div className="content_header">
      <h2>استمتع بالتعلم التفاعلي</h2>
      <p>
        اختيار أفضل المواد لمنزلك — بجانب الطلاء والكسوة، هناك تشطيبات
        داخلية أخرى يمكن أن تعزز مظهر ووظيفة منزلك.
      </p>
      <button className="bUnifier" >اكتشف المزيد</button>
    </div>
    
    <div className="content_image">
      <div className="row">
        <div className="col-md-4">
          <div className="image">
            <img src={image1} alt="Enjoy learning" />
          </div>
          <div className="content_under_image">
            <i className="fa-solid fa-location-dot" style={{color: '#906df8'}} />
            <br />
            <p>
              no.4shaben ElKom <br />
              no.4shaben ElKom 
            </p>
            <p>(+20)1012345678</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img src={image1} alt="Enjoy learning" />
          </div>
          <div className="content_under_image">
            <i className="fa-solid fa-location-dot" style={{color: '#906df8'}} />
            <br />
            <p>
              no.4shaben ElKom <br />
              no.4shaben ElKom 
            </p>
            <p>(+20)1012345678</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="image">
            <img src={image1} alt="Enjoy learning" />
          </div>
          <div className="content_under_image">
            <i className="fa-solid fa-location-dot" style={{color: '#906df8'}} />
            <br />
            <p>
              no.4shaben ElKom <br />
              no.4shaben ElKom 
            </p>
            <p>(+20)1012345678</p>
          </div>
        </div>
      </div>
    </div>
    </div>

    <hr />
  </section>
</>

  );
}

export default EnjoyLearning;
