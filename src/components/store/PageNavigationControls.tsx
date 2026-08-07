"use client";

import { ArrowLeft, ArrowUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function PageNavigationControls() {
  const router = useRouter();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function goBack() {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  }

  return (
    <div className="fixed bottom-5 right-4 z-30 flex flex-col gap-2 sm:bottom-7 sm:right-7">
      {showTop ? (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-volt"
          aria-label="Към началото на страницата"
          title="Към началото"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={goBack}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-accent to-rose-500 text-white shadow-lg shadow-accent/25 transition hover:-translate-y-0.5 hover:scale-105"
        aria-label="Назад"
        title="Назад"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    </div>
  );
}
