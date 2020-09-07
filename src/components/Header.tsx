import Link from 'next/link';
import React from 'react';

type headerProps = {};

function Header(props: headerProps) {
  return (
    <ul>
      <li>
        <Link href="/">Home</Link>
      </li>
      <li>
        <Link href="/login">Login</Link>
      </li>
      <li>
        <Link href="/register">Register</Link>
      </li>
      <li>
        <Link href="token_test">Token Test</Link>
      </li>
    </ul>
  );
}

export default Header;
