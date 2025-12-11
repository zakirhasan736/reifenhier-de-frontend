// 'use client';

// import {
//   FacebookShareButton,
//   FacebookIcon,
//   WhatsappShareButton,
//   WhatsappIcon,
//   LinkedinShareButton,
//   LinkedinIcon,
//   TwitterShareButton,
//   TwitterIcon,
// } from 'next-share';

// import { useState } from 'react';
// import { Copy } from 'lucide-react';

// export default function SocialShareButtons({
//   url,
//   title,
// }: {
//   url: string;
//   title: string;
// }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(url);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="mt-4">
//       {/* TITLE */}
//       <h3 className="text-[15px] font-medium text-[#16171A] mb-2">
//         Produkt teilen
//       </h3>

//       {/* SHARE BUTTONS WRAPPER */}
//       <div className="flex flex-wrap items-center gap-4">
//         {/* COPY LINK */}
//         <button
//           onClick={handleCopy}
//           className="flex items-center gap-2 px-3 py-1.5 
//                      border border-gray-300 rounded-md text-sm
//                      text-[#404042] hover:bg-gray-100 transition"
//         >
//           <Copy className="w-4 h-4" />
//           {copied ? 'Kopiert!' : 'Kopieren'}
//         </button>

//         {/* ICONS SECTION */}
//         <div className="flex items-center gap-3">
//           <FacebookShareButton url={url} quote={title}>
//             <FacebookIcon round size={36} />
//           </FacebookShareButton>

//           <TwitterShareButton url={url} title={title}>
//             <TwitterIcon round size={36} />
//           </TwitterShareButton>

//           <WhatsappShareButton url={url} title={title}>
//             <WhatsappIcon round size={36} />
//           </WhatsappShareButton>

//           <LinkedinShareButton url={url}>
//             <LinkedinIcon round size={36} />
//           </LinkedinShareButton>

//         </div>
//       </div>
//     </div>
//   );
// }
// 'use client';

// import {
//   FacebookShareButton,
//   FacebookIcon,
//   WhatsappShareButton,
//   WhatsappIcon,
//   EmailShareButton,
//   EmailIcon,
//   LinkedinShareButton,
//   LinkedinIcon,
//   TwitterShareButton,
//   TwitterIcon,
// } from 'next-share';

// import { useState } from 'react';
// import { Copy } from 'lucide-react';

// export default function SocialShareButtons({
//   url,
//   title,
// }: {
//   url: string;
//   title: string;
// }) {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     await navigator.clipboard.writeText(url);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   return (
//     <div className="mt-6 p-4 bg-[#F5F7FF] border border-[#E0E0E5] rounded-lg">
//       {/* SECTION TITLE */}
//       <h3 className="text-[16px] font-semibold text-[#16171A] mb-1">
//         Produkt teilen
//       </h3>
//       <p className="text-[13px] text-[#555] mb-4">
//         Teile dieses Produkt mit Freunden oder speichere den Link.
//       </p>

//       {/* COPY BUTTON */}
//       <button
//         onClick={handleCopy}
//         className="flex items-center gap-2 px-3 py-2 mb-4
//                    border border-gray-300 rounded-md text-sm
//                    text-[#404042] hover:bg-gray-100 transition"
//       >
//         <Copy className="w-4 h-4" />
//         {copied ? 'Link kopiert!' : 'Link kopieren'}
//       </button>

//       <div className="border-t border-[#E0E0E5] my-4"></div>

//       {/* SHARE ICONS */}
//       <div className="flex flex-wrap items-center gap-4">
//         <FacebookShareButton url={url} quote={title}>
//           <FacebookIcon
//             size={40}
//             round
//             className="hover:scale-110 transition-transform"
//           />
//         </FacebookShareButton>

//         <TwitterShareButton url={url} title={title}>
//           <TwitterIcon
//             size={40}
//             round
//             className="hover:scale-110 transition-transform"
//           />
//         </TwitterShareButton>

//         <WhatsappShareButton url={url} title={title}>
//           <WhatsappIcon
//             size={40}
//             round
//             className="hover:scale-110 transition-transform"
//           />
//         </WhatsappShareButton>

//         <LinkedinShareButton url={url}>
//           <LinkedinIcon
//             size={40}
//             round
//             className="hover:scale-110 transition-transform"
//           />
//         </LinkedinShareButton>

//         <EmailShareButton url={url} subject={title}>
//           <EmailIcon
//             size={40}
//             round
//             className="hover:scale-110 transition-transform"
//           />
//         </EmailShareButton>
//       </div>
//     </div>
//   );
// }
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
