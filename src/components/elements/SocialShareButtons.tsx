'use client';

import {
  FacebookShareButton,
  FacebookIcon,
  EmailShareButton,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  TelegramShareButton,
  TelegramIcon,
} from 'next-share';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Copy, Check, Share2 } from 'lucide-react';

type Props = {
  url: string;
  title: string;
  /** Product image (needed for Pinterest) */
  image?: string;
};

function withUtm(url: string, source: string) {
  try {
    const u = new URL(url);
    u.searchParams.set('utm_source', source);
    u.searchParams.set('utm_medium', 'social_share');
    return u.toString();
  } catch {
    return url;
  }
}

async function copyText(text: string) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // fall through to legacy copy
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function SocialShareButtons({ url, title, image }: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle');
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Click outside / Escape closes. The ref wraps the trigger too, so the
  // trigger button can close the menu again (it used to reopen instantly).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('touchstart', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('touchstart', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const handleTrigger = useCallback(async () => {
    // Phones: use the native share sheet (WhatsApp, Messenger, SMS, ...)
    const isTouch =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(pointer: coarse)').matches;
    if (isTouch && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url: withUtm(url, 'native_share') });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return; // user cancelled
      }
    }
    setOpen(o => !o);
  }, [title, url]);

  const handleCopy = async () => {
    const ok = await copyText(url);
    setCopied(ok ? 'ok' : 'fail');
    setTimeout(() => setCopied('idle'), 1800);
  };

  const close = () => setOpen(false);
  const itemCls =
    'flex w-full items-center gap-2 px-3 py-2 hover:bg-gray-100 text-[#404042] text-[14px]';

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={handleTrigger}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Produkt teilen"
        className="py-2 px-3 border rounded-md hover:bg-gray-100 transition cursor-pointer"
      >
        <Share2 className="w-4 h-4 text-[#404042]" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-52 bg-white border rounded-xl overflow-hidden shadow-lg z-50"
        >
          <ul className="py-1 socials-sheare-button-list">
            <li role="none">
              <WhatsappShareButton
                url={withUtm(url, 'whatsapp')}
                title={title}
                separator=" – "
                onClick={close}
                style={{ width: '100%' }}
              >
                <span className={itemCls}>
                  <WhatsappIcon size={28} round />
                  WhatsApp
                </span>
              </WhatsappShareButton>
            </li>
            <li role="none">
              <FacebookShareButton
                url={withUtm(url, 'facebook')}
                quote={title}
                onClick={close}
                style={{ width: '100%' }}
              >
                <span className={itemCls}>
                  <FacebookIcon size={28} round />
                  Facebook
                </span>
              </FacebookShareButton>
            </li>
            <li role="none">
              <TwitterShareButton
                url={withUtm(url, 'x')}
                title={title}
                onClick={close}
                style={{ width: '100%' }}
              >
                <span className={itemCls}>
                  <TwitterIcon size={28} round />
                  X (Twitter)
                </span>
              </TwitterShareButton>
            </li>
            {image ? (
              <li role="none">
                <PinterestShareButton
                  url={withUtm(url, 'pinterest')}
                  media={image}
                  description={title}
                  onClick={close}
                  style={{ width: '100%' }}
                >
                  <span className={itemCls}>
                    <PinterestIcon size={28} round />
                    Pinterest
                  </span>
                </PinterestShareButton>
              </li>
            ) : null}
            <li role="none">
              <TelegramShareButton
                url={withUtm(url, 'telegram')}
                title={title}
                onClick={close}
                style={{ width: '100%' }}
              >
                <span className={itemCls}>
                  <TelegramIcon size={28} round />
                  Telegram
                </span>
              </TelegramShareButton>
            </li>
            <li role="none">
              <EmailShareButton
                url={withUtm(url, 'email')}
                subject={title}
                body={`${title}\n`}
                onClick={close}
                style={{ width: '100%' }}
              >
                <span className={itemCls}>
                  <EmailIcon size={28} round />
                  E-Mail
                </span>
              </EmailShareButton>
            </li>
            <li role="none">
              <button
                type="button"
                role="menuitem"
                onClick={handleCopy}
                className={itemCls}
              >
                {copied === 'ok' ? (
                  <Check className="w-4 h-4 mx-[6px] text-green-600" />
                ) : (
                  <Copy className="w-4 h-4 mx-[6px]" />
                )}
                {copied === 'ok'
                  ? 'Link kopiert!'
                  : copied === 'fail'
                    ? 'Kopieren fehlgeschlagen'
                    : 'Link kopieren'}
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
