import axios from "axios";
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
export default function Login(){

    const navigation = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

    // const onSubmit = (data) => console.log(data)

    async function onSubmit(data){
        const res = await axios.get("http://localhost:3000/login",{
            headers:{
                email:data.email,
                password:data.password
            }
        }) 
        console.log(res.data);
        if(res.status === 201){
            Cookies.set("token",res.data.token)
            Cookies.set("id",res.data.userId)
            navigation("/")
        }
    }


    return(<div className="flex flex-col w-full h-[100vh] justify-center items-center">
        <h1 className="text-4xl font-bold mb-5 text-green-500" >LOGIN</h1>
        <form className="flex flex-col gap-3 md:w-1/3" onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="email" type="text" className="outline-none border-2 px-3 py-2 rounded-xl" {...register("email",{required:true})} />
            {errors.email && <span className="text-red-800 ms-3">Lütfen bir email giriniz.</span>}

            <input placeholder="password" type="password" className="outline-none border-2 px-3 py-2 rounded-xl" {...register("password", { required: true })} />
            {/* errors will return when field validation fails  */}
            {errors.password && <span className="text-red-800 ms-3">Lütfen bir şifre giriniz.</span>}

            <button className="bg-green-400  px-2 py-2 text-white rounded-xl hover:opacity-75 duration-300" type="submit">Giriş Yap</button>
        </form>
        <a className="mt-5 text-green-500 hover:underline" href="/signup">Üye ol</a>
    </div>)
}