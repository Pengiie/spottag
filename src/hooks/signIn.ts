import { useRouter } from "next/router";
import { trpc } from "../utils/trpc"

export const useSignIn = () => {
  const mutation = trpc.useMutation('auth.signin');

  const router = useRouter();

  return async () => {
    const { url } = await mutation.mutateAsync();
    router.push(url);
  }
}