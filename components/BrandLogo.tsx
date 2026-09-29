import Image from "next/image";

type LogoLockupProps = {
  className?: string;
  priority?: boolean;
};

/** Horizontal mark and wordmark for light surfaces. Tagline is not included. */
export function LogoLockup({
  className = "h-9 w-auto sm:h-11",
  priority = false,
}: LogoLockupProps) {
  return (
    <Image
      src="/brand/logo-lockup.png"
      alt="Build With Innocent"
      width={524}
      height={128}
      priority={priority}
      unoptimized
      className={className}
    />
  );
}

type LogoCircleProps = {
  className?: string;
  alt?: string;
};

/** White logo on a navy circle, for dark surfaces. */
export function LogoCircle({
  className = "h-16 w-16",
  alt = "Build With Innocent",
}: LogoCircleProps) {
  return (
    <Image
      src="/brand/logo-circle.png"
      alt={alt}
      width={384}
      height={384}
      unoptimized
      className={className}
    />
  );
}
