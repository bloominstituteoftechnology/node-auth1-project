import React, {Component} from 'react'
import LoadingHOC from './LoadingHOC'
import '../styles/main.css'

const List = (props) =>{
  const{usernames} = props
const userElts = usernames.map(user => <li key={user.id}>{user.username}</li>)
console.log(userElts);


  return(
    <ul>
      {userElts}

    </ul>
  )
}

export default LoadingHOC(List)