import React, { useState } from 'react';
import './Tooltip.scss';

const Tooltip = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 200);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  return (
    <div className="Tooltip-Wrapper" onMouseEnter={showTip} onMouseLeave={hideTip}>
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || 'top'}`}>
          <span>{props.content}</span>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
