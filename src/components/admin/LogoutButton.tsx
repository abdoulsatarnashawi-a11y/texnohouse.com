"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="mt-2 block w-full rounded-lg px-3 py-2 text-left text-sm text-red-300 hover:bg-white/5"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        window.location.href = "/admin/login";
      }}
    >
      Изход
    </button>
  );
}
