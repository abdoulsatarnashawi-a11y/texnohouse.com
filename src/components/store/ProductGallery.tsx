"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useState } from "react";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const gallery =
    images.length > 0 ? images : [{ src: "/placeholder-product.svg", alt: productName }];
  const [active, setActive] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const current = gallery[active];

  function previous() {
    setActive((index) => (index - 1 + gallery.length) % gallery.length);
  }

  function next() {
    setActive((index) => (index + 1) % gallery.length);
  }

  return (
    <>
      <div className="rounded-3xl border border-ink/5 bg-white/80 p-4 shadow-sm sm:p-6">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand">
          <Image
            src={current.src}
            alt={current.alt || productName}
            fill
            className="object-contain p-6 transition duration-300"
            sizes="(max-width:1024px) 100vw, 50vw"
            priority
            unoptimized
          />

          {gallery.length > 1 ? (
            <>
              <button
                type="button"
                onClick={previous}
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-volt hover:text-white"
                aria-label="Предишна снимка"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow-lg transition hover:bg-volt hover:text-white"
                aria-label="Следваща снимка"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/75 px-3 py-1 text-xs font-semibold text-white">
                {active + 1} / {gallery.length}
              </span>
            </>
          ) : null}

          <button
            type="button"
            onClick={() => setZoomOpen(true)}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-ink/80 text-white shadow-lg transition hover:bg-accent"
            aria-label="Увеличи изображението"
          >
            <Expand className="h-5 w-5" />
          </button>
        </div>

        {gallery.length > 1 ? (
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {gallery.map((image, index) => (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setActive(index)}
                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-sand transition ${
                  index === active ? "border-volt" : "border-transparent hover:border-ink/20"
                }`}
                aria-label={`Снимка ${index + 1}`}
              >
                <Image
                  src={image.thumbnail || image.src}
                  alt=""
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  unoptimized
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {zoomOpen ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/95 p-4">
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Затвори"
          >
            <X className="h-6 w-6" />
          </button>
          {gallery.length > 1 ? (
            <button
              type="button"
              onClick={previous}
              className="absolute left-4 top-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:left-8"
              aria-label="Предишна снимка"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
          ) : null}
          <div className="relative h-[82vh] w-full max-w-6xl">
            <Image
              src={current.src}
              alt={current.alt || productName}
              fill
              className="object-contain"
              sizes="100vw"
              unoptimized
            />
          </div>
          {gallery.length > 1 ? (
            <button
              type="button"
              onClick={next}
              className="absolute right-4 top-1/2 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 sm:right-8"
              aria-label="Следваща снимка"
            >
              <ChevronRight className="h-7 w-7" />
            </button>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
