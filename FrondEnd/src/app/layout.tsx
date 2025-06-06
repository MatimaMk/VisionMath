import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConfigProvider from "antd/es/config-provider";
import { AuthProvider } from "@/provider/auth-provider";
import { UserProvider } from "@/provider/users-provider";
import { TopicProvider } from "@/provider/topic-Provider";
import { ContentProvider } from "@/provider/content-provider";
import { TestProvider } from "@/provider/test-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConfigProvider
        theme={{
          token: {
            colorSuccess: "#52c41a",
            colorWarning: "#faad14",
            colorPrimary: "#35be8994",
            colorInfo: "#35be8994",
            colorLink: "#1677ff",
          },
          components: {
            Button: {
              contentFontSize: 18,
              contentFontSizeLG: 17,
              contentFontSizeSM: 0,
              contentLineHeightLG: 7.5,
              paddingBlock: 4,
              controlHeight: 49,
            },
            Input: {
              controlHeight: 45,
              lineWidth: 1.7,
              borderRadius: 15,
              activeBg: "rgb(255, 255, 255)",
            },
            Layout: {
              headerHeight: 55,
              headerBg: "#35be8994",
            },
            Spin: {
              dotSize: 57,
              fontSize: 25,
              motionDurationMid: "0.1s",
            },
            Carousel: {
              dotHeight: 12,
            },
            Select: {
              controlHeight: 49,
              borderRadius: 15,
            },
            InputNumber: {
              controlHeight: 48,
              borderRadius: 15,
              lineWidth: 2,
            },
          },
        }}
      >
        <body className={`${geistSans.variable} ${geistMono.variable}`}>
          <AuthProvider>
            <UserProvider>
              <TopicProvider>
                <ContentProvider>
                  <TestProvider>{children}</TestProvider>
                </ContentProvider>
              </TopicProvider>
            </UserProvider>
          </AuthProvider>
        </body>
      </ConfigProvider>
    </html>
  );
}
