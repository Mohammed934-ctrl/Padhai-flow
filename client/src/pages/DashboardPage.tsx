export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Welcome back!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Study Streak", value: "7 days" },
          { label: "Today's Goal", value: "3/5 done" },
          { label: "Total Hours", value: "42 hrs" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border/60 rounded-xl p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder content */}
      <div className="bg-card border border-border/60 rounded-xl p-6 h-48 flex items-center justify-center">
        <p className="text-muted-foreground">Recent activity will go here</p>
      </div>
    </div>
  );
}