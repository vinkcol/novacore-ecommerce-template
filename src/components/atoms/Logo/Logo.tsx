import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative">
      <Image
        src="/identity/logo.svg"
        alt="Logo"
        width={100}
        height={40}
        className="h-auto w-auto"
        priority
      />
    </div>
  );
};

export default Logo;
