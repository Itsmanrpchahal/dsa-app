import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

export interface AuthDetails {
    name: string;
    loggedIn: boolean;
    onboardingState?: "signInProcess" | "signUpProcess" | "finished" | null;
}

export interface AuthState {
    authDetails: AuthDetails;
    setAuthDetails: (authDetails: AuthDetails) => void;
    clearState: () => void;
}

export const useAuthState = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                authDetails: {
                    name: "",
                    loggedIn: false,
                    onboardingState: null,
                },
                setAuthDetails: (authDetails: AuthDetails) =>
                    set({ authDetails: authDetails }),
                clearState: () =>
                    set({
                        authDetails: {
                            name: "",
                            loggedIn: false as const,
                            onboardingState: null,
                        },
                    }),
            }),
            {
                name: "auth-state",
                storage: createJSONStorage(() => AsyncStorage),
            }
        )
    )
);
