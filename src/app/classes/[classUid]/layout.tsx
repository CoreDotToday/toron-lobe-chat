// import { Nav } from "@/components/nav";
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { NavSection } from '@/components/nav-section';
import { NavSectionItems } from '@/types';

const pipelines: NavSectionItems = {
  label: '개발환경의 이해',
  icon: 'layers',
  items: [
    {
      label: 'Github의 이해',
      href: '/classes/shinhan3/room/github?subject=class1',
      icon: 'textSelect',
    },
    {
      label: 'Github 배포',
      href: '/classes/shinhan3/room/github?subject=class2',
      icon: 'braces',
    },
    {
      label: 'DevOps',
      href: '/classes/shinhan3/room/github?subject=class3',
      icon: 'checkCircle',
    },
  ],
};

const structuredData: NavSectionItems = {
  label: '클라우드 환경',
  icon: 'grid',
  items: [
    {
      label: 'AWS 알아보기',
      href: '/classes/shinhan3/room/aws?subject=class1',
      icon: 'textSelect',
    },
    {
      label: 'AWS 컴퓨팅',
      href: '/classes/shinhan3/room/aws?subject=computing',
      icon: 'invoice',
    },
    {
      label: 'AWS 네트워킹',
      href: '/classes/shinhan3/room/aws?subject=networking',
      icon: 'receipt',
    },
    {
      label: 'AWS 스토리지',
      href: '/classes/shinhan3/room/aws?subject=storage',
      icon: 'creditCard',
    },
    {
      label: 'AWS 데이터베이스',
      href: '/classes/shinhan3/room/aws?subject=database',
      icon: 'creditCard',
    },
    {
      label: 'AWS Lambda',
      href: '/classes/shinhan3/room/aws?subject=lambda',
      icon: 'creditCard',
    },
  ],
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Sidenav */}
      <div className="fixed inset-y-0 z-50 flex w-72 flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r-2 border-slate-200 bg-white pl-8 pr-6 pb-4">
          {/* Logo */}
          <Link
            href="/dashboard"
            prefetch={false}
            className="mt-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400 focus-visible:rounded-sm"
          >
            <Image
              className="flex shrink-0"
              priority
              src="/toronai_logo.svg"
              width={100}
              height={30}
              style={{ width: 'auto', height: 'auto' }}
              alt="Toron AI logo"
            />
          </Link>
          {/* Navigation */}
          <nav className="flex flex-1 flex-col">
            <NavSection className="mt-20" section={pipelines} />
            <NavSection className="mt-10" section={structuredData} />
            <div className="flex flex-1 flex-col gap-y-7">
              {/* <BottomSection
                                className="mt-auto"
                                username={user.name}
                                items={bottomItems}
                            /> */}
            </div>
          </nav>
        </div>
      </div>
      {/* Main */}
      <main className="pl-72 w-full">{children}</main>
    </div>
  );
};
// const Header = () => {
//     return (
//         <div className="h-[80px] top-0 z-40 bg-background sticky border-b flex justify-between items-center px-4">
//             <div className="w-full">{/* <AppCommand /> */}</div>
//             {/* <ThemeToggle />
//         <Search /> */}
//         </div>
//     );
// };

export default Layout;
