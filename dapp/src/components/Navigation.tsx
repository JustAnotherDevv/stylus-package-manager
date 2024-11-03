import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Package, Search, Home, Layout, BookOpen } from "lucide-react";

export default function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center">
              <Package className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Stylus Package Manager
              </span>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {[
                { path: "/", icon: Home, text: "Packages" },
                { path: "/dashboard", icon: Layout, text: "Dashboard" },
              ].map(({ path, icon: Icon, text }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    isActive(path)
                      ? "text-purple-600 border-b-2 border-purple-600"
                      : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {text}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search packages..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-purple-600 focus:border-purple-600 sm:text-sm"
              />
            </div>

            <button className="ml-4 px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
