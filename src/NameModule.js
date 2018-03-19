import React,{Component} from 'react';
function formatName(user) {
  return user.firstName + ' ' + user.lastName;
}

function wrapperName(user) {
  if (user) {
    return formatName(user)
  } else {
    return "Stranger"
  }
}

const user = {
  firstName: 'Jsen',
  lastName: 'jobs'
};
const element = (
  <h1>
  Hello, {wrapperName(user)}!
  </h1>
);

class NameModule extends Component {
  render() {
    return element
  }
}

export default NameModule
