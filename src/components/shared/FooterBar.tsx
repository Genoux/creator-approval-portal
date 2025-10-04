"use client";

export function Footer() {
  return (
    <footer className="px-6 py-12">
      <div className="flex justify-center items-center text-center w-full">
        <div className="text-sm text-black/60">
          v{process.env.APP_VERSION} - All rights reserved © InBeat{" "}
          {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
}
