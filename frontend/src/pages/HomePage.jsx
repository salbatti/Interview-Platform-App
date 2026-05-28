import {
    SignedOut,
    SignedIn,
    SignInButton,
    SignOutButton,
    UserButton
} from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function HomePage() {

    const [books,setBooks]=useState([])
    const [isLoading,setIsLoading]=useState(true)
    const [error,setError]=useState(null)

    // useEffect(()=>{
    //     get
    // })
    return (
        <div>
            <button className="btn btn-secondary" onClick={()=>toast.success("This is a success toast")}>
                Click me
            </button>

            <SignedOut>
                <SignInButton mode="modal">
                    <button>Login</button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <SignOutButton />
            </SignedIn>

            <UserButton />
        </div>
    );
}

export default HomePage;