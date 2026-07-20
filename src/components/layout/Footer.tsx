import { Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="saas-footer mt-10 border-t border-line pt-6">
      <div className="grid gap-5 text-[15px] font-medium sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <p className="text-center sm:text-left">© 2026 GreenMind AI</p>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap justify-center gap-5 sm:gap-6"
        >
          <Link className="saas-footer-link focus-ring rounded-md" to="/help">
            Help Center
          </Link>
          <Link
            className="saas-footer-link focus-ring rounded-md"
            to="/settings"
          >
            Settings
          </Link>
        </nav>

        <div className="flex flex-wrap justify-center gap-5 sm:justify-end sm:gap-6">
          <a
            className="saas-footer-link focus-ring inline-flex items-center gap-2 rounded-md"
            href="mailto:rashidhussainrasho@gmail.com"
            aria-label="Email Rashid Hussain at rashidhussainrasho@gmail.com"
          >
            <Mail className="saas-footer-icon" size={19} aria-hidden="true" />
            <span>rashidhussainrasho@gmail.com</span>
          </a>
          <a
            className="saas-footer-link focus-ring inline-flex items-center gap-2 rounded-md"
            href="https://www.linkedin.com/in/rashid-hussain-973587316"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open Rashid Hussain's LinkedIn profile in a new tab"
          >
            <Linkedin
              className="saas-footer-icon"
              size={19}
              aria-hidden="true"
            />
            <span>LinkedIn Profile</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
