import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/" className="navbar-button">Sign up</Link>
      <Link to="/login" className="navbar-button">Login</Link>
      <Link to="/event" className="navbar-button">Event</Link>
      <Link to="/admin" className="navbar-button">Admin</Link>
    </div>
  );
};
