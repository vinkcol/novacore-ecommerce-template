import React from "react";
import Image from "next/image";

const Logo = () => {
  return (
    <div className="relative">
      <img
        src="/images/identity/logo.svg"
        alt="Vink Logo"
        style={{ width: '120px', height: '40px' }}
        className="object-contain"
      />
    </div>
  );
};

export default Logo;
