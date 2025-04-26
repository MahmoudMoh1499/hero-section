import { useState, useEffect, useRef } from 'react';
import { contentOptions } from '../data/contentOptions';

const HeroSection = () => {

    const [currentContent, setCurrentContent] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [editing, setEditing] = useState(null);
    const [content, setContent] = useState([...contentOptions]);
    const editRef = useRef(null);

    const regenerateContent = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setTimeout(() => {
            setCurrentContent((prev) => (prev + 1) % content.length);
            setIsAnimating(false);
        }, 500);
    };

    const handleContentChange = (field, value) => {
        const updatedContent = [...content];
        updatedContent[currentContent][field] = value;
        setContent(updatedContent);
    };

    const startEditing = (field) => {
        setEditing(field);
    };

    const handleBlur = (field, e) => {
        handleContentChange(field, e.target.textContent);
        setEditing(null);
    };

    const handleKeyDown = (field, e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleContentChange(field, e.target.textContent);
            setEditing(null);
        }
    };

    useEffect(() => {
        if (editing && editRef.current) {
            editRef.current.focus();
            const range = document.createRange();
            range.selectNodeContents(editRef.current);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }, [editing]);

    const current = content[currentContent];

    return (
        <section className={`relative min-h-screen overflow-hidden ${current.color} transition-colors duration-500`}>
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white/10 animate-float"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${Math.random() * 300 + 100}px`,
                            height: `${Math.random() * 300 + 100}px`,
                            animationDuration: `${20 + Math.random() * 20}s`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>

            <div className="container mx-auto px-6 py-24 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    {/* Text content */}
                    <div className="lg:w-1/2 space-y-8">
                        {editing === 'headline' ? (
                            <h1
                                ref={editRef}
                                className="text-4xl md:text-6xl font-extrabold text-white leading-tight outline-none animate-fadeIn"
                                contentEditable
                                onBlur={(e) => handleBlur('headline', e)}
                                onKeyDown={(e) => handleKeyDown('headline', e)}
                                suppressContentEditableWarning
                                dangerouslySetInnerHTML={{ __html: current.headline }}
                            />
                        ) : (
                            <h1
                                className="text-4xl md:text-6xl font-extrabold text-white leading-tight animate-fadeIn cursor-text hover:ring-2 hover:ring-white/30 rounded-lg px-2 -mx-2 transition-all"
                                onClick={() => startEditing('headline')}
                            >
                                {current.headline}
                            </h1>
                        )}

                        {editing === 'subheadline' ? (
                            <p
                                ref={editRef}
                                className="text-xl md:text-2xl text-white/90 outline-none animate-fadeIn"
                                contentEditable
                                onBlur={(e) => handleBlur('subheadline', e)}
                                onKeyDown={(e) => handleKeyDown('subheadline', e)}
                                suppressContentEditableWarning
                                dangerouslySetInnerHTML={{ __html: current.subheadline }}
                            />
                        ) : (
                            <p
                                className="text-xl md:text-2xl text-white/90 animate-fadeIn cursor-text hover:ring-2 hover:ring-white/30 rounded-lg px-2 -mx-2 transition-all"
                                onClick={() => startEditing('subheadline')}
                            >
                                {current.subheadline}
                            </p>
                        )}

                        {editing === 'cta' ? (
                            <div className="flex flex-wrap gap-4">
                                <button
                                    ref={editRef}
                                    className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full outline-none animate-fadeIn"
                                    contentEditable
                                    onBlur={(e) => handleBlur('cta', e)}
                                    onKeyDown={(e) => handleKeyDown('cta', e)}
                                    suppressContentEditableWarning
                                    dangerouslySetInnerHTML={{ __html: current.cta }}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-4">
                                <button
                                    className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg hover:scale-105 active:scale-95 cursor-text"
                                    onClick={() => startEditing('cta')}
                                >
                                    {current.cta}
                                </button>

                                <button
                                    onClick={regenerateContent}
                                    className="px-8 py-4 border-2 border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                    </svg>
                                    Regenerate Design
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Image */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute -inset-4 bg-white/20 rounded-3xl blur-xl animate-pulse-slow"></div>
                        <img
                            src={current.image}
                            alt="Hero visual"
                            className="relative rounded-2xl shadow-2xl w-full h-auto object-cover border-4 border-white/20 animate-scaleIn"
                        />
                    </div>
                </div>
            </div>

        </section>
    );
};

export default HeroSection;