// app/loading.tsx
export default function Loading() {
  return (
    <div className="flex h-[70vh] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-black"></div>
    </div>
  );
}
