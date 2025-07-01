import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SessionProvider from "@/components/SessionProvider";
import { auth } from "@/auth";

export const metadata: Metadata = {
	title: "Job Posting App",
	description: "Create by zahid ali khan",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	return (
		<html lang="en">
			<body>
				<SessionProvider session={session}>
					<div className="min-h-screen bg-gray-50">
						<Navbar />
						<main className="container mx-auto px-4 py-8">
							{children}
						</main>
					</div>
				</SessionProvider>
			</body>
		</html>
	);
}
