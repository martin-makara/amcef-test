import type { Metadata } from "next";
import { Reddit_Mono } from "next/font/google";
import "./globals.css";

const inter = Reddit_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "ToDo App",
	description: "A simple todo app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
