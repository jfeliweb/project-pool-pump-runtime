import { currentUser } from '@clerk/nextjs/server';
import { Sponsors } from './Sponsors';

export const Hello = async () => {
  const user = await currentUser();

  return (
    <div>
      <p className="text-lg">
        {`👋 Hello, ${user?.primaryEmailAddress?.emailAddress ?? 'there'}!`}
      </p>
      <p className="mt-2 text-gray-600">
        Welcome to PoolCalc. Manage your pool configurations and track your savings.
      </p>
      <Sponsors />
    </div>
  );
};
