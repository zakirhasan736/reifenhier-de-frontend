import React from 'react';
import Image from 'next/image';

const NewArticles: React.FC = () => {
    return (
        <section className="news-section pt-10 pb-20 bg-mono-0">
            <div className="custom-container">
                <div className="news-content">
                    <div className="section-header text-left mb-9">
                        <h2 className="h3 text-primary-70 font-secondary">News & Articles</h2>
                        <p className="text-mono-100 font-medium text-[14px] font-primary">
                            Stay updated with the latest insights and tips about tires.
                        </p>
                    </div>
                    <div className="news-list grid grid-cols-3 max-md:grid-cols-1 gap-6">
                        {/* news card item start */}
                        <div className="news-item bg-mono-0 relative border border-border-100 rounded-[4px]">
                            <Image
                                src="/images/blogs/img_fehler_beim_reifenkauf-1024x675.webp"
                                alt="The most common mistakes when buying tires – and how to avoid them"
                                className="w-full h-[280px] object-cover rounded-[4px]"
                                width={1024}
                                height={675}
                                priority
                            />
                            <div className="news-item-content absolute bottom-0 left-0 z-[99] py-6 px-5">
                                <h5 className="text-mono-0 font-semibold h6 font-secondary">
                                    The most common mistakes when buying tires – and how to avoid them
                                </h5>
                                <p className="text-mono-0 text-[14px] font-medium font-primary mt-1">
                                    January 2, 2025
                                </p>
                            </div>
                        </div>
                        {/* news card item end */}
                        {/* news card item start */}
                        <div className="news-item bg-mono-0 relative border border-border-100 rounded-[4px]">
                            <Image
                                src="/images/blogs/img_fehler_beim_reifenkauf-1024x675.webp"
                                alt="The most common mistakes when buying tires – and how to avoid them"
                                className="w-full h-[280px] object-cover rounded-[4px]"
                                width={1024}
                                height={675}
                                 priority
                            />
                            <div className="news-item-content absolute bottom-0 left-0 z-[99] py-6 px-5">
                                <h5 className="text-mono-0 font-semibold h6 font-secondary">
                                    The most common mistakes when buying tires – and how to avoid them
                                </h5>
                                <p className="text-mono-0 text-[14px] font-medium font-primary mt-1">
                                    January 2, 2025
                                </p>
                            </div>
                        </div>
                        {/* news card item end */}
                        {/* news card item start */}
                        <div className="news-item bg-mono-0 relative border border-border-100 rounded-[4px]">
                            <Image
                                src="/images/blogs/img_fehler_beim_reifenkauf-1024x675.webp"
                                alt="The most common mistakes when buying tires – and how to avoid them"
                                className="w-full h-[280px] object-cover rounded-[4px]"
                                width={1024}
                                height={675}
                                 priority
                            />
                            <div className="news-item-content absolute bottom-0 left-0 z-[99] py-6 px-5">
                                <h5 className="text-mono-0 font-semibold h6 font-secondary">
                                    The most common mistakes when buying tires – and how to avoid them
                                </h5>
                                <p className="text-mono-0 text-[14px] font-medium font-primary mt-1">
                                    January 2, 2025
                                </p>
                            </div>
                        </div>
                        {/* news card item end */}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewArticles;