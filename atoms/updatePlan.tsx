import React from 'react';
import RichText from './RichText';

const UpdatePlan: React.FC = () => {

  return (
    <div className="update-plan">
        <RichText>
          <p><b>Still have free plan?</b><br/>Find out other plans by clicking button down below</p>
        </RichText>
        <button className="primary">
          Update
      <i className="fa-solid fa-arrow-right"/>
    </button>
    </div>
  );
};

export default UpdatePlan;
