import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <>
      <header>
        <h1>my website</h1>
        <nav>
          <ul className="flex">
            <li>
              <Link href="/course">course</Link>
            </li>
            <li>
              <Link href="/discuss">discuss</Link>
            </li>
            <li>
              <Link href="/problems">problems</Link>
            </li>
            <li>
              <Link href="/contest">contest</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
};

export default Header;
