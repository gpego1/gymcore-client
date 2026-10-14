'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Icon } from './icons';

const slides = [
  { image: '/images/gym-strength.jpg', alt: 'Halteres alinhados em uma academia de musculação', title: 'Força para evoluir.', detail: 'MUSCULAÇÃO · DISCIPLINA EM CADA REPETIÇÃO' },
  { image: '/images/gym-training.jpg', alt: 'Atleta preparando um levantamento com barra e anilhas na academia', title: 'Energia que conecta.', detail: 'TREINAMENTO · MOVIMENTO COM PROPÓSITO' },
  { image: '/images/gym-space.jpg', alt: 'Área de treinamento com equipamentos de academia', title: 'Espaço para ir além.', detail: 'SUA ACADEMIA · NOVAS POSSIBILIDADES' }
];

export function GymCarousel() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      setReducedMotion(preference.matches);
      setPlaying(!preference.matches);
    };
    sync();
    preference.addEventListener('change', sync);
    return () => preference.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!playing || focused || reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [active, playing, focused, reducedMotion]);

  const select = (index: number) => {
    setActive((index + slides.length) % slides.length);
  };

  return <section className="gym-carousel" aria-label="Academia em movimento" aria-roledescription="carrossel"
    data-autoplay={playing && !focused && !reducedMotion}
    onPointerDownCapture={() => setFocused(false)}
    onFocusCapture={event => setFocused(event.target.matches(':focus-visible'))} onBlurCapture={event => {
      if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
    }} onKeyDown={event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        select(active + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    }}>
    <div className="gym-carousel-images">
      {slides.map((slide, index) => <div key={slide.image} className={'gym-slide' + (index === active ? ' is-active' : '')}
        aria-hidden={index !== active} role="group" aria-roledescription="slide" aria-label={`${index + 1} de ${slides.length}`}>
        <Image src={slide.image} alt={slide.alt} fill sizes="(max-width: 900px) 100vw, 55vw" priority={index === 0} />
      </div>)}
    </div>
    <span className="gym-carousel-label"><span /> GYMCORE / EM MOVIMENTO</span>
    <div className="gym-carousel-caption" aria-live={playing && !focused && !reducedMotion ? 'off' : 'polite'} aria-atomic="true">
      <div key={active} className="gym-caption-content">
        <span>{slides[active].detail}</span>
        <h2>{slides[active].title}</h2>
      </div>
    </div>
    <div className="gym-carousel-controls">
      <div className="gym-carousel-dots" aria-label="Escolher imagem">
        {slides.map((slide, index) => <button key={slide.image} type="button" aria-label={`Ver imagem ${index + 1}: ${slide.title}`}
          aria-current={active === index ? 'true' : undefined} onClick={() => select(index)}><span /></button>)}
      </div>
      <span className="gym-carousel-count">0{active + 1} / 0{slides.length}</span>
      {!reducedMotion && <button type="button" onClick={() => {
        setFocused(false);
        setPlaying(value => !value);
      }} aria-label={playing ? 'Pausar carrossel' : 'Retomar carrossel'}>{playing ? 'Pausar' : 'Retomar'}</button>}
      <button type="button" aria-label="Imagem anterior" onClick={() => select(active - 1)}><Icon name="arrow" size={18} className="reverse" /></button>
      <button type="button" aria-label="Próxima imagem" onClick={() => select(active + 1)}><Icon name="arrow" size={18} /></button>
    </div>
  </section>;
}
