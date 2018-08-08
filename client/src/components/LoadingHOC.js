import React, {Component} from 'react'
import spinner from '../spinner.gif'

const LoadingHOC = (WrappedState) =>{
  return(
    class LoadingHOC extends Component{
      render(){
        return this.props.usernames.length === 0 ? <img className="isLoading" alt="spinner" src={spinner}/> : <WrappedState {...this.props}/>
      }
    }
  )
}

export default LoadingHOC