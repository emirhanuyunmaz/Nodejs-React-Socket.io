import axios from "axios"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

export default function Signup(){
    const navigation = useNavigate()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm()

    //   const onSubmit = (data) => console.log(data)

      async function onSubmit(data){
        const res = await axios.post("http://localhost:3000/signup",{
            data
        })
        console.log(res);
        
        if(res.status === 201){
            navigation("/login")
        }
      }

    return(<div className="flex flex-col justify-center items-center w-full h-[100vh]">
         <h1 className="text-4xl font-bold mb-5 text-green-500" >SIGNUP</h1>
        <form className="flex flex-col gap-3 md:w-1/3" onSubmit={handleSubmit(onSubmit)}>
            <input placeholder="Ad Soyad" type="text" className="outline-none border-2 px-3 py-2 rounded-xl" {...register("nameSurname",{required:true})} />
            {errors.email && <span className="text-red-800 ms-3">Lütfen bir isim giriniz.</span>}

            <input placeholder="email" type="text" className="outline-none border-2 px-3 py-2 rounded-xl" {...register("email",{required:true})} />
            {errors.email && <span className="text-red-800 ms-3">Lütfen bir email giriniz.</span>}

            <input placeholder="password" type="password" className="outline-none border-2 px-3 py-2 rounded-xl" {...register("password", { required: true })} />
            {/* errors will return when field validation fails  */}
            {errors.password && <span className="text-red-800 ms-3">Lütfen bir şifre giriniz.</span>}

            <button className="bg-green-400  px-2 py-2 text-white rounded-xl hover:opacity-75 duration-300" type="submit">Üye Ol</button>
        </form>
    </div>)
}