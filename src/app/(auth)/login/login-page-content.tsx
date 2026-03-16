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
  hidden: { opacity: 0, x: "32%", scale: 0.98 },
  visible: {
    opacity: 1,
    x: "0%",
    scale: 1,
    transition: {
      duration: 1,
      delay: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function LoginPageContent({ next }: { next?: string }) {
  return (
    <div className="flex min-h-screen">
      {/* Left side — form area */}
      <motion.div
        variants={leftPanelVariants}
        initial="hidden"
        animate="visible"
        className="relative flex w-full flex-col bg-[#FAF8F6] lg:w-[45%] xl:w-[42%]"
      >
        {/* Logo */}
        <div className="px-8 pt-8 md:px-12 md:pt-10">
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

        {/* Centered login card */}
        <div className="flex flex-1 items-center justify-center px-6 py-12 md:px-12">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[420px] rounded-[24px] bg-white px-8 py-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.03)] md:px-10 md:py-12"
          >
            <LoginForm next={next} />
          </motion.div>
        </div>
      </motion.div>

      {/* Right side — background image + slider overlay */}
      <div className="relative hidden overflow-hidden lg:block lg:w-[55%] xl:w-[58%]">
        {/* Orange wavy background */}
        <Image
          src="/images/background.png"
          alt=""
          fill
          priority
          className="object-cover"
        />

        {/* Slider image (app screenshot) */}
        <motion.div
          variants={sliderVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-y-0 right-[-44%] flex w-[92%] items-center justify-end pr-0 xl:right-[-46%] xl:w-[96%]"
        >
          <div className="relative h-[78vh] max-h-[820px] min-h-[560px] w-full overflow-hidden rounded-l-[28px] rounded-r-none border border-white/35 bg-white/12 shadow-[0_32px_100px_-36px_rgba(120,42,8,0.58)] backdrop-blur-[2px]">
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
  );
}
