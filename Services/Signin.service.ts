import { fecthFormData , fecthData} from "./fetchData"

export const SignUpApi=(data:FormData)=>fecthFormData.post('/signin',data)
export const getUserData=()=>fecthData.get('/signin/users')