import { auth, clerkClient } from '@clerk/nextjs';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { OrgDetails, SessionDetails, UserDetails } from './details';

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  const user = await clerkClient.users.getUser(userId);

  return (
    <div className="px-8 py-12 sm:py-16 md:px-20">
      {user && (
        <>
          <h1 className="text-3xl font-semibold text-black">
            👋 어서오세요, {user.firstName || `Stranger`} 님
          </h1>
          <div className="grid gap-4 mt-8 lg:grid-cols-3">
            <UserDetails />
            <SessionDetails />
            <OrgDetails />
          </div>
          <h2 className="mt-16 mb-4 text-3xl font-semibold text-black">이용 방법</h2>
          Read the{' '}
          <Link
            className="font-medium text-primary-600 hover:underline"
            href="https://toron.ai"
            target="_blank"
          >
            토론 AI의 이용 순서 -&gt;
          </Link>
        </>
      )}
    </div>
  );
}
