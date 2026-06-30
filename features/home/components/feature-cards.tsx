"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IdCard, Sparkles, Brain, Clock, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/shared/glass-card";

const features = [
  {
    href: "/citizen-card",
    icon: IdCard,
    title: "Thẻ Công Dân",
    description:
      "Tạo thẻ công dân Ô Diên độc nhất với ảnh, QR code và số định danh riêng.",
    color: "from-odien-red/20 to-odien-red/5",
  },
  {
    href: "/wrapped",
    icon: Sparkles,
    title: "My Ô Diên 2026",
    description:
      "Wrapped cá nhân kiểu Spotify sau khi hoàn thành Thẻ, Quiz và Hộp Thời Gian.",
    color: "from-odien-gold/20 to-odien-gold/5",
  },
  {
    href: "/quiz",
    icon: Brain,
    title: "Bạn là người Ô Diên bao nhiêu %?",
    description:
      "15 câu hỏi vui về ẩm thực, lịch sử, địa danh và đời sống Ô Diên.",
    color: "from-primary/20 to-primary/5",
  },
  {
    href: "/time-capsule",
    icon: Clock,
    title: "Hộp Thời Gian",
    description:
      "Gửi lời nhắn niêm phong cho tương lai — chờ ngày cộng đồng cùng mở hộp.",
    color: "from-secondary/20 to-secondary/5",
  },
];

export function FeatureCards() {
  return (
    <section className="py-20 px-4">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Trải nghiệm <span className="text-gradient">Ô Diên One</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Bốn hành trình để bạn kết nối, khám phá và lưu giữ kỷ niệm cùng cộng đồng.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link href={feature.href}>
                <GlassCard className={`h-full bg-gradient-to-br ${feature.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-background/80 shadow-sm">
                      <feature.icon className="text-primary" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center gap-1 text-sm text-primary font-medium">
                        Khám phá <ArrowRight size={16} />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
