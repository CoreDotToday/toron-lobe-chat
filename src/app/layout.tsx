import { koKR } from '@clerk/localizations';
import {
  ClerkProvider,
  OrganizationSwitcher,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Viewport } from 'next';
import { Inter } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

import Analytics from '@/components/Analytics';

import StyleRegistry from './StyleRegistry';
import './globals.css';
import { Discord, Docs, Github, Twitter } from './icons';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

const RootLayout = ({ children }: PropsWithChildren) => {
  // get default theme config to use with ssr
  return (
    <html lang={'ko-kr'}>
      <body suppressHydrationWarning={true}>
        <StyleRegistry>
          <ClerkProvider
            localization={koKR}
            appearance={{
              variables: { colorPrimary: '#000000' },
              elements: {
                formButtonPrimary:
                  'bg-black border border-black border-solid hover:bg-white hover:text-black',
                socialButtonsBlockButton:
                  'bg-white border-gray-200 hover:bg-transparent hover:border-black text-gray-600 hover:text-black',
                socialButtonsBlockButtonText: 'font-semibold',
                formButtonReset:
                  'bg-white border border-solid border-gray-200 hover:bg-transparent hover:border-black text-gray-500 hover:text-black',
                membersPageInviteButton:
                  'bg-black border border-black border-solid hover:bg-white hover:text-black',
                card: 'bg-[#fafafa]',
              },
            }}
          >
            <body className={`${inter.className} min-h-screen flex flex-col`}>
              <header className="flex items-center h-20 gap-4 px-4 border-b border-black border-solid sm:px-8 border-opacity-20">
                <Link href="/" className="flex items-center h-20 gap-2 sm:gap-4">
                  <Image
                    src="/toronai_logo.svg"
                    alt="ToronAI Logo"
                    width={102}
                    height={32}
                    priority
                  />
                </Link>
                <div className="grow" />
                <SignedIn>
                  <div className="hidden sm:block">
                    <OrganizationSwitcher afterCreateOrganizationUrl="/dashboard" />
                  </div>
                  <div className="block sm:hidden">
                    <OrganizationSwitcher
                      afterCreateOrganizationUrl="/dashboard"
                      appearance={{
                        elements: {
                          organizationSwitcherTriggerIcon: `hidden`,
                          organizationPreviewTextContainer: `hidden`,
                          organizationSwitcherTrigger: `pr-0`,
                        },
                      }}
                    />
                  </div>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <button type="button">로그인</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button type="button">회원가입</button>
                  </SignUpButton>
                </SignedOut>
              </header>
              <main className="grow">{children}</main>
              <footer className="flex items-center h-20 gap-1 px-8 font-medium border-t md:px-20">
                <Image
                  src="/toronai_logo-min.svg"
                  alt="ToronAI Logo"
                  width={64}
                  height={32}
                  priority
                />
                <span className="text-sm">© 2024</span>
                <nav className="flex justify-end grow sm:gap-2">
                  <a
                    className="flex gap-2 px-3 py-2 text-sm font-semibold text-gray-600 transition duration-100 rounded-md hover:text-gray-800"
                    href="https://clerk.com/docs?utm_source=vercel-template&utm_medium=template_repos&utm_campaign=nextjs_template"
                  >
                    <div className="m-auto">
                      <Docs />
                    </div>
                    <span className="hidden sm:inline"> 토론 AI 이용안내</span>
                    <span className="inline sm:hidden"> Docs</span>
                  </a>
                  <a
                    className="flex gap-2 px-3 py-2 text-sm font-semibold text-gray-600 transition duration-100 rounded-md hover:text-gray-800"
                    href="https://github.com/clerkinc/clerk-next-app"
                  >
                    <div className="m-auto">
                      <Github />
                    </div>
                    <span className="hidden sm:inline"> CoreDotToday</span>
                  </a>
                  <a
                    className="flex flex-col justify-center p-2 hover:underline"
                    href="https://twitter.com/toronai"
                  >
                    <Twitter />
                  </a>
                  <a
                    className="flex flex-col justify-center p-2 hover:underline"
                    href="https://discord.com/invite/toronai"
                  >
                    <Discord />
                  </a>
                </nav>
              </footer>
            </body>
          </ClerkProvider>
        </StyleRegistry>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;

export { default as metadata } from './metadata';

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  themeColor: [
    { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
    { color: '#000', media: '(prefers-color-scheme: dark)' },
  ],
  userScalable: false,
  viewportFit: 'cover',
  width: 'device-width',
};
