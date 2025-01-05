
// Format date to Thursday 23rd April 2023
export function FormatDateTime(dateTime, options) {
    // Include the day of the week in the options object
    const dayOfWeek = new Date(dateTime).toLocaleDateString('en-US', { weekday: 'long' });
    const dayOfWeekFormatted = `${dayOfWeek}, ${new Date(dateTime).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}`;
    return dayOfWeekFormatted;
};

export function validateEmail(email) {
    let errors = [];
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
        errors.push("Email is required");
    } else if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
    }
    // eslint-disable-next-line
    return errors;
};

export function validatePassword(password) {
    let errors = [];

    if (!password) {
        errors.push("Password is required.");
    } else {
        if (password.length < 8) {
            errors.push("Password must be at least 8 characters.");
        }
        if (password.length > 20) {
            errors.push("Password must be less than 20 characters.");
        }
        if (!/[a-z]/.test(password)) {
            errors.push("Password must contain at least one lowercase letter.");
        }
        if (!/[A-Z]/.test(password)) {
            errors.push("Password must contain at least one uppercase letter.");
        }
        if (!/\d/.test(password)) {
            errors.push("Password must contain at least one digit.");
        }
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
            errors.push("Password must contain at least one special character.");
        }
    }
    return errors;
};

export function validateConfirmPassword(password, confirmPassword) {
    let errors = [];
    if (password !== confirmPassword) {
        errors.push("Passwords do not match");
    }
    return errors;
};

export function getFileNameFromUrl(url) {
    const parsedUrl = new URL(url);
    return parsedUrl.pathname.split('/').pop();
};
