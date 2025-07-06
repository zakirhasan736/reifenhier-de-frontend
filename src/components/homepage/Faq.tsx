'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

const FaqSection: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/faq/faqs-lists`);
        setFaqs(res.data);
      } catch (err) {
        console.error('Failed to fetch FAQs', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section className="FAQ-section pt-16 pb-10 bg-bg-opacity">
      <div className="custom-container">
        <div className="FAQ-content">
          <div className="section-header text-left mb-9">
            <h2 className="h3 max-sm:text-[22px] text-primary-70 font-secondary text-left leading-tight">
              <span className="text-primary-100">Frequently</span> <br />
              Asked Questions (FAQ)
            </h2>
          </div>

          <div className="FAQ-list">
            {loading ? (
              <p>Loading FAQs...</p>
            ) : faqs.length === 0 ? (
              <p>No FAQs available at the moment.</p>
            ) : (
              faqs.map((faq, index) => (
                <div
                  key={faq._id}
                  className="collapse collapse-plus bg-mono-0 border border-border-100 mb-3"
                >
                  <input
                    type="radio"
                    name="faq-accordion"
                    defaultChecked={index === 0}
                  />
                  <div className="collapse-title max-sm:text-[16px] font-semibold text-primary-70 h5">
                    {faq.question}
                  </div>
                  <div className="collapse-content max-sm:text-[14px] body-regular font-primary">
                    {faq.answer}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;

