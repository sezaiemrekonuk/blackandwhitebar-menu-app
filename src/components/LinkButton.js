import React from 'react';
import { Link } from 'react-scroll';
export function LinkButton({ to, children }) {
  return (
    <Link to={to} smooth duration={500} className="inline-block px-6 py-3 bg-accent text-primary font-medium rounded-full cursor-pointer hover:opacity-90">
      {children}
    </Link>
  );
}
