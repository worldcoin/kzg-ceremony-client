import create from 'zustand'

export type AuthResponse = {
	sub: string
	exp: string
	nickname: string
	provider: string
	session_id: string
}

export type AuthStore = {
	authResponse: AuthResponse | null
	setAuthResponse: (authResponse: AuthResponse) => void
}

const useAuthStore = create<AuthStore>()((set, get) => ({
	authResponse: null,
	setAuthResponse: (authResponse: AuthResponse) => set({ authResponse }),
}))

export default useAuthStore
