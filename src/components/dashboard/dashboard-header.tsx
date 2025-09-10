export function DashboardHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col w-full">
        <div className="text-sm text-black/60">Shared Lists</div>
        <div className="flex items-center gap-2 w-full justify-between">
          <h1 className="text-2xl font-bold text-black/90">
            Creator Management
          </h1>
        </div>
      </div>
    </div>
  );
}
