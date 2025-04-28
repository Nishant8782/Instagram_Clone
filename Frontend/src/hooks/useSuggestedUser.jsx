import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setSuggestedUser } from "../Components/redux/suggestedUser"

const useSuggestedUser = () => {
    const dispatch = useDispatch()
    useEffect ( () => {
        const fetchSuggestedUser = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/v1/user/suggested", {
                    withCredentials : true
                })

                if(res.data.success){
                    console.log("responseeeeeeeee",res.data)
                    dispatch(setSuggestedUser(res.data.users));
                }
            } catch (error) {
                console.log(error);
                
            }
        }

        fetchSuggestedUser();
    }, [])
}

export default useSuggestedUser
