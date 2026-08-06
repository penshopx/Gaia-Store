import { Zap, RefreshCw, MessageCircle } from "lucide-react";

export default function TrustBadges() {
  const badges = [
    {
      icon: Zap,
      text: "Akses Instan Setelah Pembayaran"
    },
    {
      icon: RefreshCw,
      text: "Materi Update Regulasi Terkini"
    },
    {
      icon: MessageCircle,
      text: "CS Responsif"
    }
  ];

  return (
    <section className="w-full bg-background border-t border-border py-12 px-4 mt-8">
      <div className="container mx-auto max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {badges.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div key={idx} className="flex flex-col items-center justify-center text-center pt-8 md:pt-0 first:pt-0 px-4 group">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="text-sm font-semibold text-white max-w-[200px]">
                  {badge.text}
                </h4>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
