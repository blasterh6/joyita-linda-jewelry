import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-center justify-center p-2", className)}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Stylized 'J' and 'L' based on the requested monogram */}
        <path
          d="M50 15C35 15 25 25 25 40C25 55 35 65 50 65C65 65 75 55 75 40C75 25 65 15 50 15Z"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-primary/10"
        />
        <path
          d="M50 25C50 25 40 25 40 45C40 65 50 85 50 85"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        <path
          d="M50 15C50 15 65 15 65 40C65 65 50 80 50 80"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-primary"
        />
        <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
      </svg>
    </div>
  );
}
