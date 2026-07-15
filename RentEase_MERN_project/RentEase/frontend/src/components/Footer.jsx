import React from 'react';
import { Building, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer class="bg-slate-950 border-t border-slate-900 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div class="space-y-4">
            <div class="flex items-center space-x-2 text-primary-400 font-extrabold text-xl">
              <Building class="h-6 w-6 text-primary-500" />
              <span>RentHaven</span>
            </div>
            <p class="text-slate-400 text-sm leading-relaxed">
              Find and book your dream rental home. A modern, premium property platform designed to connect tenants with premium rental properties.
            </p>
          </div>

          {/* Quick links */}
          <div class="space-y-4">
            <h3 class="text-slate-200 font-bold text-md tracking-wider">Quick Navigation</h3>
            <ul class="space-y-2 text-sm text-slate-400">
              <li>
                <a href="/" class="hover:text-primary-400 transition-colors">Browse Homes</a>
              </li>
              <li>
                <a href="/login" class="hover:text-primary-400 transition-colors">Sign In</a>
              </li>
              <li>
                <a href="/register" class="hover:text-primary-400 transition-colors">Register Account</a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div class="space-y-4">
            <h3 class="text-slate-200 font-bold text-md tracking-wider">Get in Touch</h3>
            <ul class="space-y-2.5 text-sm text-slate-400">
              <li class="flex items-center space-x-2">
                <MapPin class="h-4 w-4 text-primary-500" />
                <span>123 Luxury Dr, Suite 500, New York</span>
              </li>
              <li class="flex items-center space-x-2">
                <Phone class="h-4 w-4 text-primary-500" />
                <span>+1 (555) 019-2834</span>
              </li>
              <li class="flex items-center space-x-2">
                <Mail class="h-4 w-4 text-primary-500" />
                <span>support@renthaven.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div class="border-t border-slate-900 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} RentHaven Inc. All rights reserved.</p>
          <div class="flex space-x-4 mt-2 md:mt-0">
            <a href="#" class="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
