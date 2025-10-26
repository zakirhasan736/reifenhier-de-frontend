'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import toast  from 'react-hot-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState<{
  //   type: 'success' | 'error' | null;
  //   text: string;
  // }>({
  //   type: null,
  //   text: '',
  // });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email) {
    toast.error('Bitte geben Sie Ihre E-Mail-Adresse ein.');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001'
      }/api/newsletter/subscribe`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer_form' }),
      }
    );

    const data = await res.json();

    if (data.success) {
      toast.success(
        'Danke! Sie haben unseren Newsletter erfolgreich abonniert 🎉'
      );
      setEmail('');
    } else {
      toast.error(data.message || 'Fehler beim Abonnieren.');
    }
  } catch (err) {
    console.error('Newsletter error:', err);
    toast.error('Serverfehler. Bitte versuchen Sie es später erneut.');
  } finally {
    setLoading(false);
  }
};

  return (
    <footer className="footer-section bg-[#F7F8FA]">
      <div className="footer-wrapper pt-4">
        <div className="custom-container">
          <div className="footer-main-centent">
            <div className="footer-cta-section bg-primary-100 md:py-[60px] py-8 xl:px-[78px] md:px-9 px-6 rounded-[20px]">
              <div className="footer-cta-content flex items-center justify-between max-sm:flex-col max-sm:gap-4">
                <div className="left-content">
                  <h2 className="font-medium font-primary text-[24px] lg:text-[30px] md:text-left text-center text-mono-0 leading-[120%]">
                    Abonnieren Sie unseren Newsletter
                  </h2>
                  <p className="font-normal font-secondary text-[16px] lg:text-[16px] md:text-left text-center text-mono-0 mt-3 leading-[150%]">
                    Bleiben Sie auf dem Laufenden mit exklusiven Angeboten
                  </p>
                </div>
                <div className="right-content max-sm:w-full">
                  <form
                    onSubmit={handleSubmit}
                    className="reifencheck-subscription-form w-full flex md:flex-row max-sm:flex-col gap-3 items-center"
                  >
                    <label htmlFor="email" className="sr-only"></label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="Ihre E-Mail-Adresse"
                      className="border form-subs-input text-[16px] text-left font-normal font-secondary border-[#FFFFFF6F] md:max-w-[344px] placeholder:!text-[#FFFFFF] !text-[#FFFFFF] focus:!text-[#FFFFFF] focus-within:!text-[#ffffff] !shadow-none w-full h-[47px] !bg-[#16171A34] px-6 py-[15px] !rounded-full focus-visible:!rounded-full focus:!rounded-full focus-within:!rounded-full !outline-none focus:outline-none"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className={`bg-mono-0 whitespace-nowrap max-sm:w-full flex items-center text-[16px] font-normal justify-center h-[47px] text-primary-100 text-center body-regular font-secondary rounded-full px-6 py-2 border border-primary-100 transition ease cursor-pointer leading-[100%] ${
                        loading
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:bg-transparent hover:text-mono-0 hover:border-mono-0'
                      }`}
                    >
                      {loading ? 'Loading …' : 'Abonnieren'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="footer-top-area flex items-start justify-between pt-8  pb-[19px] max-sm:flex-col lg:gap-0 gap-5">
              <div className="footer-logo-wrapper lg:max-w-[350px] max-w-[280px] w-full">
                <Image
                  src="/images/footer-brand-logo.svg"
                  className="opacity-100 max-sm:w-[130px] sm:w-[140px] w-[180px] h-auto"
                  alt="company logo"
                  width={180}
                  height={70}
                  loading="lazy"
                />
                <p className="sm:text-[16px] text-[14px] text-left font-normal font-secondary  text-[#404042] md:text-[#404042] leading-[150%] mt-3">
                  Ihre zuverlässige Quelle für hochwertige Reifen von
                  Top-Marken. Wir machen es Ihnen leicht, die perfekte Passform
                  für Ihr Fahrzeug zu finden – mit schnellem Versand und
                  kompetenter Unterstützung.
                </p>
              </div>
              <div className="footer-quick-link-cont max-w-[690px] w-full flex items-start justify-between max-sm:flex-col max-sm:gap-4">
                <div className="quick-link-cont">
                  <h3 className="mb-2 md:mb-3 md:text-[18px] text-[16px] text-left font-normal font-primary text-[#404042] leading-[150%]">
                    Direktlinks
                  </h3>
                  <ul className="quick-link-list flex flex-col gap-1 md:gap-[6px]">
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/produkte"
                      >
                        Produkte
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/blogs"
                      >
                        News & Artikel
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/favorites"
                      >
                        Favoriten
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="quick-link-cont">
                  <h3 className="mb-2 md:mb-3 md:text-[18px] text-[16px] text-left font-normal font-primary text-[#404042] leading-[150%]">
                    Direktlinks
                  </h3>
                  <ul className="quick-link-list flex flex-col gap-1 md:gap-[6px]">
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/produkte?kategorie=Sommerreifen"
                      >
                        Sommerreifen
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/produkte?kategorie=Winterreifen"
                      >
                        Winterreifen
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#404042]"
                        href="/produkte?kategorie=Ganzjahresreifen"
                      >
                        Ganzjahresreifen
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        className="md:text-[16px] text-[14px] text-left font-normal font-secondary leading-[150%] text-[#16171A]"
                        href="./#byBrand"
                      >
                        Nach Marke
                      </Link>
                    </li> */}
                  </ul>
                </div>
                <div className="quick-link-cont">
                  <h3 className="mb-2 md:mb-3 md:text-[18px] text-[16px] text-left font-normal font-primary text-[#404042] leading-[150%]">
                    Soziale Medien
                  </h3>
                  <ul className="quick-link-list flex gap-3 md:gap-3 pl-0">
                    <li>
                      <Link
                        className="p-2 hover:bg-[#f5b602]/60 hover:border-[#f5b602] trabsition ease-in-out duration-100 !border relative rounded-full !border-secondary-100/40 h-12 w-12 max-md:w-10 max-md:h-10 flex items-center justify-center"
                        href="http://facebook.com/reifencheck.de"
                      >
                        <Image
                          src="/images/facebook.png"
                          alt="reifencheck facebook icon"
                          width={20}
                          height={20}
                        />
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="p-2 hover:bg-[#f5b602]/60 hover:border-[#f5b602] trabsition ease-in-out duration-100 !border relative rounded-full !border-secondary-100/40 h-12 w-12 max-md:w-10 max-md:h-10 flex items-center justify-center"
                        href="https://www.instagram.com/reifencheck.de"
                      >
                        <Image
                          src="/images/instagram.png"
                          alt="reifencheck instagrame icon"
                          width={20}
                          height={20}
                        />
                      </Link>
                    </li>
                    {/* <li>
                      <Link
                        className="p-2 hover:bg-[#f5b602]/60 hover:border-[#f5b602] trabsition ease-in-out duration-100 !border relative rounded-full !border-secondary-100/40 h-12 w-12 max-md:w-10 max-md:h-10 flex items-center justify-center"
                        href="https://youtube.com"
                      >
                        <Image
                          src="/images/youtube.png"
                          alt="reifencheck reifencheck icon"
                          width={20}
                          height={20}
                        />
                      </Link>
                    </li> */}
                  </ul>
                </div>
              </div>
            </div>
            <div className="footer-bottom-area w-full pt-[13px] pb-[20px] border-t border-t-border-100 flex items-center justify-between max-sm:flex-col max-sm:gap-3">
              <div className="foot-centent w-full lg:gap-0 gap-2 max-sm:gap-1 lg:flex-row flex-col-reverse flex items-center justify-between">
                <div className="foot-left-content">
                  <p className="foot-copyright-text max-sm:text-center text-[12px] font-normal font-secondary md:text-[14px] lg:text-[16px] text-[#404042] leading-[150%]">
                    © 2025 reifencheck.de Alle Rechte vorbehalten.
                  </p>
                </div>
                <ul className="foot-middle-cont flex items-center gap-3 lg:gap-10 max-sm:justify-center">
                  <li className="foot-middle-item">
                    <Link
                      className="md:text-[14px] max-sm:text-center text-[12px] whitespace-nowrap text-left font-normal font-secondary leading-[120%] lg:leading-[150%] text-[#404042]"
                      href="/impressum-datenschutz"
                    >
                      Impressum & Datenschutz
                    </Link>
                  </li>
                  <li className="foot-middle-item">
                    <Link
                      className="md:text-[14px] text-left max-sm:text-center text-[12px] whitespace-nowrap font-normal font-secondary leading-[120%] lg:leading-[150%] text-[#404042]"
                      href="/AGB"
                    >
                      Nutzungsbedingung AGB
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
