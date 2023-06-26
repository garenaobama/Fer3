import React from "react";

const CustomInput = React.forwardRef(({ type, name, placeholder, className, errMes, ...rest }, ref) => {
  return (
    <div>
      <input
        ref={ref}
        type={type}
        name={name}
        placeholder={placeholder}
        className={`form-control ${className ? className : ''}`}
        {...rest}
      />
      <span className="text-danger mt-2">{errMes ? errMes: ""}</span>
    </div>
  );
});

export default CustomInput;