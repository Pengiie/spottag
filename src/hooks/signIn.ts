import { trpc } from "../utils/trpc"

export const signIn = () => {
  const mutation = trpc.useMutation('auth.spotify', {})
}