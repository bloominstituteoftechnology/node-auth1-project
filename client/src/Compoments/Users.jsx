import React, { useEffect } from 'react'
//imports
import axios from 'axios'
export default function Users(props) {

    useEffect(() => {
        
        axios.get(`http://localhost:2100/api/users`)
        .then(res=>{
            console.log(res.data)
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])
    return (
        <div>
            
        </div>
    )
}
