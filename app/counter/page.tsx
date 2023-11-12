export default function Component() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter text-center text-zinc-900 dark:text-zinc-100">
          Resources For Assistance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
          <div className="rounded-lg shadow-md  dark:bg-zinc-900 p-6">
            <div className="flex items-center space-x-4">
              <svg
                className=" w-6 h-6 text-zinc-900 dark:text-zinc-100"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 10h.01" />
                <path d="M15 10h.01" />
                <path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" />
              </svg>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Deceased
              </h3>
            </div>
            <p className="text-sm md:text-base lg:text-lg mt-3 text-zinc-600 dark:text-zinc-400">
              Resources for the deceased individuals and their families.
            </p>
          </div>
          <div className="rounded-lg shadow-md bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center space-x-4">
              <svg
                className=" w-6 h-6 text-zinc-900 dark:text-zinc-100"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <path d="M7.5 8 10 9" />
                <path d="m14 9 2.5-1" />
                <path d="M9 10h0" />
                <path d="M15 10h0" />
              </svg>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Wounded
              </h3>
            </div>
            <p className="text-sm md:text-base lg:text-lg mt-3 text-zinc-600 dark:text-zinc-400">
              Resources for the wounded individuals and their families.
            </p>
          </div>
          <div className="rounded-lg shadow-md bg-white dark:bg-zinc-900 p-6">
            <div className="flex items-center space-x-4">
              <svg
                className=" w-6 h-6 text-zinc-900 dark:text-zinc-100"
                fill="none"
                height="24"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9 12h.01" />
                <path d="M15 12h.01" />
                <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" />
                <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
              </svg>
              <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
                Children
              </h3>
            </div>
            <p className="text-sm md:text-base lg:text-lg mt-3 text-zinc-600 dark:text-zinc-400">
              Resources for children and their families.
            </p>
          </div>
        </div>
        <div className="mt-10 text-center">
          <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Source of Resources
          </h3>
          <p className="text-sm md:text-base lg:text-lg mt-3 text-zinc-600 dark:text-zinc-400">
            All resources are provided by the local government and non-profit
            organizations.
          </p>
        </div>
      </div>
    </section>
  );
}
