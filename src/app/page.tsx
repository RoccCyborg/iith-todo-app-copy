"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

export default function Home() {
  return (
    <main className="flex min-h-screen">
      <div className="container gap-12 px-4 py-16 ">
        <div>
          <h1 className="text-center text-3xl">Todo Application</h1>
        </div>
      </div>
    </main>
  );
}
