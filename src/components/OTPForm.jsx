import React, { useState } from 'react';

const OTPForm = ({ onSubmit, onClose }) => {
    const [otp, setOtp] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(otp);  // Send OTP to the backend for verification
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="otp">Enter OTP sent to your email:</label>
                <input
                    type="text"
                    id="otp"
                    className="form-control my-3"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength="6"
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100 site-btn">
                Verify OTP
            </button>
        </form>
    );
};

export default OTPForm;
