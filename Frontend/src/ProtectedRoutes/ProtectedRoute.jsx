import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

function ProtectedRoute({children}) {
    const {user} = useSelector(store => store.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if(!user){
            navigate('/')
        }
    }, [])
  return (
    <>{children}</>
  )
}

export default ProtectedRoute
    