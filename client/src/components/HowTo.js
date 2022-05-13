import React from "react";
import Step1 from "../img/howto/Step1.png";
import Step2 from "../img/howto/Step2.png";
import Step3 from "../img/howto/Step3.png";
import Step4 from "../img/howto/Step4.png";

const HowTo = () => {
  return (
    <div>
      <h1>Follow the steps below to generate your access token!</h1>
      <br />
      <h2>Step 1</h2>
      <img
        className="howToImg"
        src={Step1}
        alt="Navigate to your stevens canvas account, and go to settings."
      />
      <br />
      <br />
      <h2>Step 2</h2>
      <img
        className="howToImg"
        src={Step2}
        alt="Scroll down to Approved Integrations, and click the New Access Token button."
      />
      <br />
      <br />
      <h2>Step 3</h2>
      <img
        className="howToImg"
        src={Step3}
        alt="You can type in the purpose of the access token, and choose an expiry date for the token. We only require your token the first time you sign up, so you can set an expiry date of the next day if you'd like. Click Generate Token once you're done."
      />
      <br />
      <br />
      <h2>Step 4</h2>
      <img
        className="howToImg"
        src={Step4}
        alt="Copy the Access Token that is displayed. Remember to copy it before shutting this window, as once you shut it you will not be able to access it again. You will have to perform the process all over again and generate a new access token if you do not copy it. Now head over to Sign Up and create your account!"
      />
    </div>
  );
};

export default HowTo;
