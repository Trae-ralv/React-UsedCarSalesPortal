//Consistensy Mantainence
const getCurrentTimestamp = () => {
  return new Date().toISOString().replace('T', ' ').substring(0, 19);
};


//getCurrentUser is not used Future Implementation
const getCurrentUser = () => {
  return process.env.REACT_APP_USERNAME || 'Trae-ralv';
};

module.exports = {
  getCurrentTimestamp,
  getCurrentUser
};