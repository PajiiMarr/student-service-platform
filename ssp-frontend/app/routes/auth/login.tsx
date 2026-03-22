import type { Route } from "./+types/login"
import { Link } from 'react-router'

export function meta({}: Route.MetaArgs) {
    return [
        { title: "Login" },
        { name: "description", content: "Login to your account" },
    ]
}

export async function loader({ request, context}: Route.LoaderArgs) {
    return null 
}

export async function action({request, context}: Route.ActionArgs) {

}

export default function Login() {
    return (
        <div className="flex justify-center items-center w-full h-full">
            <form action="" method="post" className="p-10 rounded-lg shadow-lg w-1/4">
                <h2>Login your account</h2>
                <div className="flex flex-col my-5">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" className="border rounded-lg p-2"/>
                </div>

                <div className="flex flex-col my-5">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" className="border rounded-lg p-2"/>
                </div>

                <div className="flex flex-col mt-3">
                    <button className="bg-red-500 rounded-lg p-2 text-white" type="submit">Submit</button>
                </div>

                <div className="flex flex-col mt-3">
                    <Link to='/signup'>
                        <button className="underline text-blue-500 cursor-pointer">Hello</button>
                    </Link>
                </div>
            </form>
        </div>
    )
}