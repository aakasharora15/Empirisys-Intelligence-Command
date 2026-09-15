export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-text-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-4 border-card-border border-t-accent animate-spin" />
        <p className="text-sm font-bold text-text-secondary uppercase tracking-widest animate-pulse">
          Initializing Intelligence Engine...
        </p>
      </div>
    </div>
  );
}
