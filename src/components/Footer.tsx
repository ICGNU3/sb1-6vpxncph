import React from 'react';
import { Github, Twitter, Linkedin, Hexagon } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Hexagon className="h-6 w-6 text-green-400" />
              <span className="text-lg font-bold text-white">NEPLUS</span>
            </div>
            <p className="text-gray-400">Empowering the next generation of creators and innovators.</p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Navigation</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="hover:text-green-400 transition-colors duration-200">About</a></li>
              <li><a href="/explore" className="hover:text-green-400 transition-colors duration-200">Explore</a></li>
              <li><a href="/support" className="hover:text-green-400 transition-colors duration-200">Support</a></li>
              <li><a href="/get-started" className="hover:text-green-400 transition-colors duration-200">Get Started</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Legal</h3>
            <ul className="space-y-2">
              <li><a href="/privacy" className="hover:text-green-400 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-green-400 transition-colors duration-200">Terms of Service</a></li>
              <li><a href="/copyright" className="hover:text-green-400 transition-colors duration-200">Copyright Info</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Community</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-400 transition-colors duration-200">
                <Github className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-400 transition-colors duration-200">
                <Linkedin className="h-6 w-6" />
              </a>
            </div>
            <button className="mt-4 gradient-border bg-slate-900 text-green-400 px-4 py-2 rounded-lg font-semibold hover:text-green-300 transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} NEPLUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}