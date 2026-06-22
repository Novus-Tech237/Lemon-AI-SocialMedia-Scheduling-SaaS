"use client"

import { motion, type Variants } from "motion/react";
import Image from "next/image";
import { ArrowRight, Brain, Smartphone, Users2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SectionOnePage = () => {
    const router = useRouter()
    const onClick = () => {
        router.push("/main")
    }
    return (
        <div className="relative isolate overflow-hidden bg-background">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-[5rem] -left-12 w-72 h-72 bg-slate-200/20 rounded-full blur-2xl"></div>
                <div className="absolute top-1/3 -right-12 w-48 h-48 bg-slate-300/20 rounded-full blur-2xl"></div>
                <div className="absolute bottom-1/4 left-1/3 w-56 h-56 bg-slate-400/20 rounded-full blur-2xl"></div>
                <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-slate-300/20 rounded-full"></div>
                <div className="absolute bottom-1/4 right-1/4 w-20 h-20 bg-slate-400/20 rounded-full rotate-180"></div>
                <div className="absolute top-1/3 right-1/3 w-12 h-12 bg-slate-200/20 rounded-full rotate-90"></div>
                <div className="absolute bottom-1/2 left-1/3 w-14 h-14 bg-slate-300/20 rounded-full -rotate-90"></div>
            </div>
            <div className="mx-auto max-w-7xl px-6 py-20 lg:flex lg:items-center lg:gap-x-[10rem] lg:px-6">
                <motion.div 
                className="mx-auto relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                >
                  
                    <Image
                        src={"/images/0_1.jpeg"}
                        alt="AI-powered social media scheduling dashboard"
                        height={800}
                        width={800}
                        className="mx-auto mt-16 lg:mt-0 md:w-162.5 relative z-10 rounded-[55%_45%_40%_60%/45%_55%_45%_55%]"
                    />
                </motion.div>
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg lg:flex-shrink-0">
                <motion.h1
                    className="md:mt-10 mt-4 text-5xl  font-bold text-foreground"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-gradient md:whitespace-wrap">Schedule social posts with Artificial Intelligence</span>
                </motion.h1>
                <motion.p
                        className="mt-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span
                            className={`text-lg leading-8 text-muted-foreground`}
                        >
                           Plan, draft, and publish across every well-known platform from one workspace. Let AI handle the busywork so you can focus on growing your audience.
                        </span>
                    </motion.p>
                    <motion.div
                        className="mt-10 flex gap-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div>
                            <div className="text-5xl font-bold text-foreground">8+</div>
                            <div className="mt-2 text-sm leading-snug text-muted-foreground">Social platforms<br />supported in one place</div>
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-foreground">AI</div>
                            <div className="mt-2 text-sm leading-snug text-muted-foreground">Drafts &amp; schedules<br />your posts for you</div>
                        </div>
                    </motion.div>
                </div>
               
            </div>
        </div>
    );
}

export default SectionOnePage;