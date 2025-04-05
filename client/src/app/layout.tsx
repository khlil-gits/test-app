import "./globals.css";
import type { Metadata } from "next";
import { TaskProvider } from "./providers";

export const metadata: Metadata = {
  title: "Task Manager",
  description: "A simple task management application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <TaskProvider>
          <div className="max-w-4xl mx-auto p-6">{children}</div>
        </TaskProvider>
      </body>
    </html>
  );
}
