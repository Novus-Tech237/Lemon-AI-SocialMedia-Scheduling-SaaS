"use client"
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Logo = () => {
    const pathname = usePathname();

    // Conditionally apply mt-2 only on "/splash"
    const extraClass = pathname === "/splash" ? "mt-2" : "";

    return (
        <div className={extraClass}>
            {/* Light theme logo — hidden when .dark is on <html> */}
            <Image
                height={100}
                width={100}
                alt="logo"
                src="/images/ana-b.png"
                priority
                className="block dark:hidden"
            />
            {/* Dark theme logo — shown only when .dark is on <html> */}
            <Image
                height={100}
                width={100}
                alt="logo"
                src="/images/ana-w.png"
                priority
                className="hidden dark:block"
            />
        </div>
    );
};

export default Logo;
