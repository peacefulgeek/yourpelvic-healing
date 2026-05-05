import { useState, useEffect, useCallback } from 'react';

interface Section {
  id: string;
  label: string;
}

interface DotNavProps {
  sections: Section[];
}

export function DotNav({ sections }: DotNavProps) {
  const [activeSection, setActiveSection] = useState(0);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const progress = scrollY / (docHeight - windowHeight);
    const idx = Math.min(
      Math.floor(progress * sections.length),
      sections.length - 1
    );
    setActiveSection(idx);
  }, [sections.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToSection = (index: number) => {
    const sectionId = sections[index]?.id;
    if (sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      const docHeight = document.documentElement.scrollHeight;
      const windowHeight = window.innerHeight;
      const targetY = (index / sections.length) * (docHeight - windowHeight);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  if (sections.length === 0) return null;

  return (
    <nav className="dot-nav" aria-label="Article sections">
      {sections.map((section, i) => (
        <button
          key={section.id || i}
          className={`dot-nav-item ${i === activeSection ? 'active' : ''}`}
          onClick={() => scrollToSection(i)}
          aria-label={`Jump to: ${section.label}`}
          title={section.label}
        />
      ))}
    </nav>
  );
}
export default DotNav;
