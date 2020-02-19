
const validateData = (data) => {

    const keys = Object.keys(data);
  
    if (keys.includes('from' && 'name') && keys.length === 2) {
      const yearValid = validateYear(Number(data.from));
      if (yearValid && typeof data.name === 'string') {
        return {
          from: data.from.toString(),
          name: data.name.toString()
        };
      }
      else {
        return undefined;
      }
    }
    else if (keys.includes('from' && 'to' && 'name') && keys.length === 3) {
      const yearValid = validateYear(Number(data.from)) && validateYear(Number(data.to)) && (Number(data.from) < Number(data.to));
      if (yearValid && typeof data.name === 'string') {
        return {
          from: data.from.toString(),
          to: data.to.toString(),
          name: data.name
        };
      }
      else {
        return undefined;
      }
    }
    return undefined;
  };
  
  const validateYear = (year) => {
  
    const firstPresident = 1789;
    const currentYear = new Date().getFullYear();
  
    if (isNaN(year) === true) {
      return false;
    }
    else if (year <= currentYear && year >= firstPresident) {
      return true;
    }
    else {
      return false;
    }
  };
  
  module.exports.validateData = validateData;