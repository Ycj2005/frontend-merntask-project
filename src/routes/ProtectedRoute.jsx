import React from 'react'
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({children}) {

    let token = localStorage.getItem("islogin");
  return (
    <div>
        {
            !token ? 
               <Navigate to={'/'}/>
            :
            <>
                {children}
            </>
        }
    </div>
  )
}
