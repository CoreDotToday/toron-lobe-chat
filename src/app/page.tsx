import { UserProfile, auth, currentUser } from '@clerk/nextjs';

const HomePage = async () => {
  const { userId } = auth();
  const user = await currentUser();
  console.log('userId', userId);
  console.log('user', user);

  return (
    <>
      <UserProfile />
      TORON.AI
    </>
  );
};

export default HomePage;
