
export function generateRandomPassword() {
  const lowerCaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  const upperCaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const specialCharacters = '!@#$%^&*()_+{}:"<>?[];,./~`';
  const numbers = '0123456789';

  // Ensure the password meets the minimum length and contains at least one of each required type of character
  const allCharacters = lowerCaseLetters + upperCaseLetters + specialCharacters + numbers;

  let password = '';

  // Randomly add one lowercase letter
  password += lowerCaseLetters[Math.floor(Math.random() * lowerCaseLetters.length)];

  // Randomly add one uppercase letter
  password += upperCaseLetters[Math.floor(Math.random() * upperCaseLetters.length)];

  // Randomly add one special character
  password += specialCharacters[Math.floor(Math.random() * specialCharacters.length)];

  // Fill the rest of the password with random characters, ensuring the password is at least 8 characters long
  while (password.length < 8 && password.length <= 20) {
    password += allCharacters[Math.floor(Math.random() * allCharacters.length)];
  }

  // Shuffle the characters in the password to ensure randomness
  password = password.split('').sort(() => Math.random() - 0.5).join('');

  return password;
}

export function generateRandomUsername() {
  const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const minLength = 8;
  const maxLength = 20;

  // Randomly determine the length of the username
  const usernameLength = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  let username = '';

  // Generate a random username of the determined length
  for (let i = 0; i < usernameLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    username += characters[randomIndex];
  }

  return username;
}

