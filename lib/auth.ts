'use server'

import { signIn, signOut } from "@/auth";

export async function login() {
    try {
        return await signIn("github", { redirectTo: "/" });
    } catch (error) {
        console.error("Login error:", error);
        throw error;
    }
}

export async function logout() {
    try {
        return await signOut({ redirectTo: "/auth/signin" });
    } catch (error) {
        console.error("Logout error:", error);
        throw error;
    }
}
