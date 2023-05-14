import { type GetServerSideProps } from "next";
import { columns } from "@/components/ui/columns";
import { DataTable } from "@/components/wrapper/DataTable";
import { UserNav } from "@/components/wrapper/UserNav";
import { type NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { z } from "zod";
import { getServerAuthSession } from "@/server/auth";
import { Icons } from "@/components/icons";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";

export const clientSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  billduedate: z.date(),
  billamount: z.number().nullable(),
  sendemail: z.boolean().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string(),
  invoice: z.string(),
});

export type Client = z.infer<typeof clientSchema>;

const Home: NextPage = () => {
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);
  const allClients = api.client.allClients.useQuery();

  useEffect(() => {
    if (session?.user?.email && !session.user.email.includes("@orennow.com")) {
      setShowDialog(true);
    }
  }, [session]);

  if (!session?.user?.email?.includes("@orennow.com")) {
    return (
      <div>
        {showDialog && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="max-w-xl rounded bg-white p-8 shadow-lg">
              <div className="mb-4 text-xl font-bold text-black">
                Seems like you&apos; from outside Oren
              </div>
              <div className="mb-4 text-gray-600">
                We are currently in beta and only available for Oren employees.
                We have to ask you to leave for now.
              </div>
              <div className="flex justify-end">
                <Button onClick={() => void signOut()}>Click me Senpai!</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>ManPriya</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full w-full flex-1 flex-col space-y-8 overflow-hidden p-4 sm:overflow-x-auto sm:p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Hi {session?.user?.name?.split(" ")[0]}, Welcome back! 👋
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of all the emails scheduled
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <UserNav />
          </div>
        </div>
        {allClients.data ? (
          <DataTable data={allClients.data} columns={columns} />
        ) : (
          <div className="flex h-[80vh] flex-col items-center justify-center space-y-2">
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = await getServerAuthSession(context);
  if (!user) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
