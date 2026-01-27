import React from "react";

const UpscaylSVGLogo = ({ ...rest }) => {
  return (
    <svg
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...rest}
    >
      <rect width="500" height="500" rx="80" ry="80" fill="#4A90E2"/>
      <path
        d="M125 100 L125 300 Q125 400 250 400 Q375 400 375 300 L375 100 L295 100 L295 300 Q295 330 250 330 Q205 330 205 300 L205 100 Z"
        fill="white"
      />
    </svg>
  );
};

export default UpscaylSVGLogo;
