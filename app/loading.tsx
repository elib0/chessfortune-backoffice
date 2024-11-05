import { Loader } from "@/components/shared";

export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <Loader size="xl" />
    </div>
  );
}
