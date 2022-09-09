import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../utils/trpc";

const Callback: NextPage = () => {
    const router = useRouter();

    const mutation = trpc.useMutation("auth.callback", {
        onSuccess() {
            router.push("/dashboard");
        }
    });

    useEffect(() => {
        if(router.isReady) {
            if(router.query.code)
                mutation.mutate({ authorzationToken: router.query.code as string });
            else
                router.push("/");
        }
    }, [router.query]);

    return <main className="flex justify-center mt-48">
        <div className="flex items-center">
            <div className="loader"/>
        </div>
    </main>
}

export default Callback;