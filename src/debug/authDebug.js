import * as authApi from "../api/authApi";

// Expose auth API functions on window for quick console testing in development
// Usage in browser console:
// window.authDebug.login({ email: 'a@b.com', password: 'pass' }).then(r => r.data).then(console.log)

const authDebug = {
  login: (data) => authApi.login(data),
  forgotPassword: (data) => authApi.forgotPassword(data),
  resetPassword: (token, data) => authApi.resetPassword(token, data),
  logout: () => authApi.logout(),
};

window.authDebug = authDebug;

export default authDebug;
