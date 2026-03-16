"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LoginForm } from "@/app/(auth)/login/login-form";

const leftPanelVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.15,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

const sliderVariants = {
  hidden: { opacity: 1, x: "42%", scale: 0.99 },
  visible: {
    opacity: 1,
    x: "0%",
    scale: 1,
    transition: {
      duration: 1.1,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function LoginPageContent({ next }: { next?: string }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FCFBF9] lg:px-6 lg:py-5 xl:px-8 xl:py-6">
      <div className="mx-auto flex min-h-screen max-w-[1520px] flex-col lg:min-h-[calc(100vh-3rem)] lg:flex-row">
        <motion.div
          variants={leftPanelVariants}
          initial="hidden"
          animate="visible"
          className="relative flex w-full flex-col lg:w-[48%] xl:w-[46%]"
        >
          <div className="px-6 pt-6 sm:px-8 sm:pt-8 md:px-12 md:pt-10">
            <div className="flex items-center gap-2.5">
              <div className="flex size-9 items-center justify-center rounded-xl bg-brand-primary">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="text-white"
                >
                  <path
                    d="M9 1.5C4.86 1.5 1.5 4.86 1.5 9s3.36 7.5 7.5 7.5 7.5-3.36 7.5-7.5S13.14 1.5 9 1.5Zm0 13.5c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6Z"
                    fill="currentColor"
                  />
                  <circle cx="9" cy="9" r="3" fill="currentColor" />
                </svg>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-neutral-900">
                Obliq
              </span>
            </div>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 py-8 sm:px-6 sm:py-10 md:px-10 md:py-12 lg:px-12 lg:py-16">
            <div className="pointer-events-none absolute inset-x-[8%] bottom-0 top-[18%] hidden rounded-[36px] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.96),rgba(255,255,255,0.12)_58%,transparent_78%)] blur-2xl md:block" />
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10 w-full max-w-[420px] rounded-[24px] bg-white px-5 py-7 shadow-[0_24px_80px_-30px_rgba(194,182,170,0.45),0_0_0_1px_rgba(232,225,218,0.9)] sm:px-7 sm:py-8 md:px-9 md:py-10 lg:px-10 lg:py-12"
            >
              <LoginForm next={next} />
            </motion.div>
          </div>
        </motion.div>

        <div className="relative flex w-full items-center px-4 pb-6 sm:px-6 sm:pb-8 md:px-10 md:pb-10 lg:w-[52%] lg:justify-end lg:px-0 lg:pb-0 xl:w-[54%]">
          <div className="relative h-[250px] w-full overflow-hidden rounded-[24px] sm:h-[320px] md:h-[420px] lg:h-[min(82vh,820px)] lg:w-[min(100%,780px)] lg:rounded-[28px] xl:w-[min(100%,860px)]">
            <Image
              src="/images/background.png"
              alt=""
              fill
              priority
              className="object-cover"
            />

            <motion.div
              variants={sliderVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-y-[9%] left-[18%] flex w-[102%] items-center justify-end sm:inset-y-[8%] sm:left-[18%] md:inset-y-[8%] md:left-[16%] lg:inset-y-[8%] lg:left-[18%] xl:left-[17%]"
            >
              <div className="relative h-full w-full overflow-hidden rounded-l-[22px] rounded-r-none border border-white/40 bg-white/16 shadow-[0_32px_100px_-36px_rgba(120,42,8,0.56)] backdrop-blur-[2px] lg:rounded-l-[26px]">
                <Image
                  src="/images/slider-image.png"
                  alt="Application dashboard preview"
                  fill
                  priority
                  className="object-cover object-left-top"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
