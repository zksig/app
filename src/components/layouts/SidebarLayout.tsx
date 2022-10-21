import React, { Fragment } from "react";
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const MobileHeader = () => {
  return (
    <header className="flex items-center justify-between bg-slate-900 py-2 px-4">
      <div className="w-24">
        <Image
          alt="zksig logo"
          src="/logo.png"
          width="507"
          height="210"
          layout="responsive"
        />
      </div>
      <div>
        <Menu>
          <Menu.Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6 text-purple-100"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 9h16.5m-16.5 6.75h16.5"
              />
            </svg>
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 top-0 h-screen w-2/5 bg-purple-100">
              <Menu.Item
                as="a"
                href="/agreements"
                className="my-2 flex w-full gap-2 px-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                Agreements
              </Menu.Item>

              <Menu.Item
                as="a"
                href="#"
                className="my-2 flex w-full gap-2 px-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
                Signatures
              </Menu.Item>

              <Menu.Item
                as="a"
                href="/profile"
                className="my-2 flex w-full gap-2 px-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
                Profile
              </Menu.Item>

              <Menu.Item
                as="a"
                href="#"
                className="my-2 flex w-full gap-2 px-2 py-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
                  />
                </svg>
                Settings
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

const DesktopHeader = () => (
  <>
    <div className="flex h-16 w-full items-center bg-slate-900 p-4">
      <div className="m-auto w-1/3">
        <Image
          alt="zksig logo"
          src="/logo.png"
          width="507"
          height="210"
          layout="responsive"
        />
      </div>
    </div>
    <nav className="p-2">
      <Link href="/agreements">
        <a
          href="#"
          className="my-2 flex w-full gap-2 rounded p-4 text-purple-100 hover:bg-purple-300 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          Agreements
        </a>
      </Link>

      <Link href="/signatures">
        <a
          href="#"
          className="my-2 flex w-full gap-2 rounded p-4 text-purple-100 hover:bg-purple-300 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
            />
          </svg>
          Signatures
        </a>
      </Link>

      <Link href="/profile">
        <a
          href="#"
          className="my-2 flex w-full gap-2 rounded p-4 text-purple-100 hover:bg-purple-300 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          Profile
        </a>
      </Link>

      <Link href="/settings">
        <a
          href="#"
          className="my-2 flex w-full gap-2 rounded p-4 text-purple-100 hover:bg-purple-300 hover:text-slate-900"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          </svg>
          Settings
        </a>
      </Link>
    </nav>
  </>
);

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  if (isLoading) return null;

  return (
    <div className="md:flex">
      <div className="md:hidden">
        <MobileHeader />
      </div>
      <div className="hidden h-screen w-72 bg-slate-900 md:block">
        <DesktopHeader />
      </div>
      <main className="w-full">
        <header className="flex h-16 w-full items-center justify-end bg-slate-900 p-4">
          <img
            className="inline-block h-8 w-8 rounded-full"
            src={
              user?.picture ||
              `https://avatar.oxro.io/avatar.svg?name=${user?.name}&background=8b5cf6&length=2&rounded=100%`
            }
            alt=""
          />
        </header>
        <section className="p-4" style={{ height: "calc(100vh - 64px)" }}>
          <div className="h-full overflow-y-scroll rounded bg-white p-8">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
}
