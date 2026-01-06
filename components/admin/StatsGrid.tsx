"use client";

export default function StatsGrid({ events }: { events: any[] }) {
  const totalRevenue = events.reduce((acc, event) => {
    const eventRevenue =
      event.registrations?.reduce((regAcc: number, reg: any) => {
        // Step 1: Check if payments array exists
        if (!reg.payments || reg.payments.length === 0) {
          return regAcc;
        }

        const registrationPayment =
          reg.payments?.reduce((payAcc: number, pay: any) => {
            // Step 2: Ensure status is 'success' and amount is a number
            if (pay.status === "success" && pay.amount > 0) {
              return payAcc + Number(pay.amount);
            }
            return payAcc;
          }, 0) || 0;

        return regAcc + registrationPayment;
      }, 0) || 0;

    return acc + eventRevenue;
  }, 0);

  // Athletes count logic
  const totalAthletes = events.reduce((acc, event) => {
    return (
      acc +
      (event.registrations
        ?.filter((r: any) => r.status === "paid")
        .reduce(
          (sum: number, r: any) => sum + (r.participants?.length || 0),
          0
        ) || 0)
    );
  }, 0);

  const activeEventsCount = events.filter((e) => e.is_active).length;

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      color: "text-black",
    },
    { label: "Paid Athletes", value: totalAthletes, color: "text-black" },
    {
      label: "Active Races",
      value: activeEventsCount,
      color: "text-green-600",
    },
    {
      label: "Avg. Rev / Event",
      value: `₹${
        events.length
          ? Math.round(totalRevenue / events.length).toLocaleString("en-IN")
          : 0
      }`,
      color: "text-zinc-400",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border-2 border-zinc-100 p-8 rounded-[2.5rem] shadow-sm"
        >
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 mb-2">
            {stat.label}
          </p>
          <p
            className={`text-4xl font-black italic uppercase tracking-tighter ${stat.color}`}
          >
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
