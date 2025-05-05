// app/layout.js
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import ExploreBtn from "./ExploreBtn"; // Import the ExploreBtn component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ELIXIR",
  description: "AI platform for replicating users",
};

export default function RootLayout({ children }) {
  const navStyle = {
    position: "absolute",
    backdropFilter: "blur(10px)",
    zIndex: "1000",
    height: "46px",
    top: "1px",
    display: "flex",
    flexDirection: "row",
    width: "250px",
    borderStyle: "solid",
    boxShadow: "2px 0px 20px #45455D",
    borderRadius: "20px",
    borderWidth: "1px",
    marginTop: "2px",
    padding: "5px 8px 5px 8px",
    marginBottom: "20px",
    borderColor: "transparent",
    marginLeft: "1250px",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  };

  return (
    <ClerkProvider frontendApi={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          <script src="https://cdn.lordicon.com/libs/frtqyjwu.js"></script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ul style={navStyle}>
            <li className="navbar-item">
              <SignedOut>
                <div className="auth-buttons">
                  <SignInButton className="auth-button" />
                  <SignUpButton className="auth-button" />
                </div>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </li>
          </ul>

          {/* Conditionally render ExploreBtn */}
          <SignedOut>
            <ExploreBtn active={false} />
          </SignedOut>
          <SignedIn>
            <ExploreBtn active={true} />
          </SignedIn>

          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
