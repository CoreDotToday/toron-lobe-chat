import { UserProfile, auth, currentUser } from '@clerk/nextjs';

// import Test from '@/app/test';

const HomePage = async () => {
  const { userId } = auth();
  const user = await currentUser();
  console.log('userId', userId);
  console.log('user', user);

  return (
    <>
      TORON.AI
      {/* <Test /> */}
      <UserProfile />
    </>
  );
};

export default HomePage;
