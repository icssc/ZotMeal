"use client";

export default function MyAccountPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">My Account</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
        Manage your ZotMeal account details here.
      </p>

      <div className="space-y-6">
        {/* Username section */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Username</h2>
          <p className="text-xs text-neutral-500">
            This is the name shown in your ratings and favorites.
          </p>
          {/* TODO: wire to real data later */}
          <input
            type="text"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
            placeholder="Enter username"
          />
        </section>

        {/* Password section */}
        <section className="space-y-2">
          <h2 className="text-lg font-medium">Password</h2>
          <p className="text-xs text-neutral-500">
            Update your password to keep your account secure.
          </p>
          {/* TODO: wire to real data later */}
          <div className="space-y-2">
            <input
              type="password"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
              placeholder="Current password"
            />
            <input
              type="password"
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
              placeholder="New password"
            />
            <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Save changes
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}