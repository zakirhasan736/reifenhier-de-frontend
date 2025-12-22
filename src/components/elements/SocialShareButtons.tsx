'use client';

import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  LinkedinShareButton,
  LinkedinIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'next-share';

import { useState, useEffect, useRef } from 'react';
import { Copy, Share2 } from 'lucide-react';

export default function SocialShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // CLICK OUTSIDE TO CLOSE
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative inline-block text-left">
      {/* SHARE BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="py-2 px-3 border rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <Share2 className="w-4 h-4 text-[#404042]" />
      </button>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-44 bg-white border rounded-xl overflow-hidden shadow-lg z-50"
        >
          {/* Arrow */}
          <div className="absolute -top-2 right-4 w-3 h-3 rotate-45 bg-white border-l border-t"></div>

          <ul className="pt-2 socials-sheare-button-list overflow-hidden">
            {/* EMAIL */}
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <EmailShareButton
                url={url}
                subject={title}
                className="flex items-center gap-2"
              >
                <EmailIcon size={28} round />
                <span>Email</span>
              </EmailShareButton>
            </li>

            {/* PINTEREST → using LinkedIn icon if needed */}
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <LinkedinShareButton
                url={url}
                className="flex items-center gap-2"
              >
                <LinkedinIcon size={28} round />
                <span>Pinterest</span>
              </LinkedinShareButton>
            </li>

            {/* FACEBOOK */}
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <FacebookShareButton
                url={url}
                quote={title}
                className="flex items-center gap-2"
              >
                <FacebookIcon size={28} round />
                <span>Facebook</span>
              </FacebookShareButton>
            </li>

            {/* X / TWITTER */}
            <li className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2">
              <TwitterShareButton
                url={url}
                title={title}
                className="flex items-center gap-2"
              >
                <TwitterIcon size={28} round />
                <span>X.com</span>
              </TwitterShareButton>
            </li>

            {/* COPY LINK */}
            <li
              onClick={handleCopy}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2 text-[#404042]"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Kopiert!' : 'Link kopieren'}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
