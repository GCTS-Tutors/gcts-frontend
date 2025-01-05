import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordField = ({ 
  label, 
  name, 
  placeholder, 
  value, 
  onChange, 
  errors 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form.Group className="my-3 text-start">
      <Form.Label className="text-purple">{label}</Form.Label>
      <InputGroup>
        <Form.Control
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          isInvalid={errors && errors.length > 0}
          isValid={value.length > 0 && (!errors || errors.length === 0)}
        />
        <InputGroup.Text
          onClick={togglePasswordVisibility}
          style={{ cursor: "pointer" }}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </InputGroup.Text>
      <Form.Control.Feedback type="invalid">
        {errors?.map((error, index) => (
          <div key={index}>
            <small className="small text-danger">{error}</small>
          </div>
        ))}
      </Form.Control.Feedback>
      </InputGroup>

    </Form.Group>
  );
};

export default PasswordField;

