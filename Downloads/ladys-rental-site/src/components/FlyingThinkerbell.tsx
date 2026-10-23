import React, { useEffect, useRef } from 'react';

interface FlyingThinkerbellProps {
    mode?: 'wander' | 'follow';
    size?: number; // lapad sa pixels
    message?: string | null;
    targetSelector?: string | null;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    r: number;
    hue: number;
}

const BUBBLE_W = 210;

export const FlyingThinkerbell: React.FC<FlyingThinkerbellProps> = ({
                                                                        mode = 'follow',
                                                                        size = 52,
                                                                        message = null,
                                                                        targetSelector = null,
                                                                    }) => {
    const posRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const faceRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const modeRef = useRef(mode);
    const messageRef = useRef(message);
    const targetRef = useRef(targetSelector);
    const lastMessage = useRef<string>('');
    modeRef.current = mode;
    messageRef.current = message;
    targetRef.current = targetSelector;
    if (message) lastMessage.current = message;

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        let x = window.innerWidth * 0.7;
        let y = window.innerHeight * 0.4;
        let vx = 0;
        let vy = 0;
        let face = 1; // 1 = nakaharap sa kanan, -1 = sa kaliwa
        const mouse = { x, y };
        let wander = { x, y };
        let nextWander = 0;
        let rx = 0;
        let rz = 0;
        let scale = 1;
        const particles: Particle[] = [];
        let raf = 0;

        const onMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        const onTouch = (e: TouchEvent) => {
            if (e.touches[0]) {
                mouse.x = e.touches[0].clientX;
                mouse.y = e.touches[0].clientY;
            }
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onTouch, { passive: true });

        const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

        const loop = (time: number) => {
            const w = window.innerWidth;
            const h = window.innerHeight;

            // --- saan pupunta ---
            let tx: number;
            let ty: number;
            let pointing = false;

            if (modeRef.current === 'follow') {
                const sel = messageRef.current ? targetRef.current : null;
                const el = sel ? (document.querySelector(sel) as HTMLElement | null) : null;
                if (el) {
                    const r = el.getBoundingClientRect();
                    tx = r.left + r.width / 2;
                    ty = r.bottom + 34;
                    pointing = true;
                } else {
                    tx = mouse.x + 40 + Math.sin(time * 0.003) * 12;
                    ty = mouse.y + 28 + Math.cos(time * 0.004) * 9;
                }
            } else {
                if (time > nextWander) {
                    wander = {
                        x: 60 + Math.random() * (w - 120),
                        y: 60 + Math.random() * (h - 160),
                    };
                    nextWander = time + 2200 + Math.random() * 2200;
                }
                tx = wander.x + Math.sin(time * 0.002) * 30;
                ty = wander.y + Math.sin(time * 0.0035) * 22;
            }

            // --- malambot na lipad ---
            const k = pointing ? 0.014 : 0.010;
            vx += (tx - x) * k;
            vy += (ty - y) * k;
            vx *= 0.9;
            vy *= 0.9;
            x += vx;
            y += vy;

            // --- humaharap sa direksyon ng lipad ---
            if (vx > 0.5) face = 1;
            else if (vx < -0.5) face = -1;

            // --- 3D tilt: nakadapa pasulong kapag mabilis, umaangat kapag paakyat ---
            const targetRz = clamp(vy * 3 * face, -22, 22) + clamp(Math.abs(vx) * 1.2, 0, 12) * -0.5;
            const targetRx = clamp(-vy * 2.5, -16, 16);
            rz += (targetRz - rz) * 0.12;
            rx += (targetRx - rx) * 0.12;

            const targetScale = modeRef.current === 'wander' ? 1 + Math.sin(time * 0.0012) * 0.14 : 1;
            scale += (targetScale - scale) * 0.05;

            const bob = Math.sin(time * 0.008) * 4;

            if (posRef.current) {
                posRef.current.style.transform = `translate3d(${x - size / 2}px, ${y - size / 2 + bob}px, 0)`;
            }
            if (tiltRef.current) {
                tiltRef.current.style.transform = `perspective(300px) rotateX(${rx}deg) rotateZ(${rz}deg) scale(${scale})`;
            }
            if (faceRef.current) {
                faceRef.current.style.transform = `scaleX(${face})`;
            }

            // --- bubble ---
            const b = bubbleRef.current;
            if (b) {
                const left = clamp(x - BUBBLE_W / 2, 8, w - BUBBLE_W - 8);
                b.style.left = `${left - (x - size / 2)}px`;
                if (y < 150) {
                    b.style.top = `${size + 6}px`;
                    b.style.bottom = 'auto';
                } else {
                    b.style.bottom = `${size + 6}px`;
                    b.style.top = 'auto';
                }
            }

            // --- gintong alikabok sa likod (tulad ng sa larawan) ---
            const speed = Math.hypot(vx, vy);
            const spawn = 1 + Math.floor(Math.min(speed * 0.5, 3));
            for (let n = 0; n < spawn; n++) {
                if (Math.random() < 0.8) {
                    particles.push({
                        x: x - face * size * 0.32 + (Math.random() - 0.5) * 6,
                        y: y + size * 0.18 + bob + (Math.random() - 0.5) * 6,
                        vx: -vx * 0.12 + (Math.random() - 0.5) * 0.5,
                        vy: Math.random() * 0.5 + 0.15,
                        life: 1,
                        r: 0.8 + Math.random() * 1.8,
                        hue: 38 + Math.random() * 14, // ginto
                    });
                }
            }
            ctx.clearRect(0, 0, w, h);
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.012; // dahan-dahang bumabagsak
                p.life -= 0.014;
                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }
                ctx.globalAlpha = p.life;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsl(${p.hue} 100% 60%)`;
                ctx.fillStyle = `hsl(${p.hue} 100% 72%)`;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * (0.5 + p.life * 0.5), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.globalAlpha = 1;
            ctx.shadowBlur = 0;

            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('touchmove', onTouch);
        };
    }, [size]);

    return (
        <>
            <style>{`
        @keyframes tb-flap {
          0%, 100% { transform: rotate(-16deg) scaleY(1); }
          50% { transform: rotate(12deg) scaleY(0.82); }
        }
        .tb-wing {
          transform-box: view-box;
          transform-origin: 56px 46px;
          animation: tb-flap 0.2s ease-in-out infinite;
        }
        .tb-wing-2 { animation-delay: -0.05s; }
        .tb-wing-3 { animation-delay: -0.1s; }
        #tb-face { transition: transform 220ms ease; }
      `}</style>

            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none"
                style={{ zIndex: 9998 }}
            />

            <div
                ref={posRef}
                className="fixed top-0 left-0 pointer-events-none"
                style={{ width: size, height: size, zIndex: 9999, willChange: 'transform' }}
            >
                <div
                    ref={bubbleRef}
                    style={{
                        position: 'absolute',
                        width: BUBBLE_W,
                        padding: '8px 12px',
                        borderRadius: 14,
                        background: 'rgba(13,18,26,0.96)',
                        border: '1px solid rgba(94,234,212,0.6)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6), 0 0 14px rgba(94,234,212,0.25)',
                        color: '#fce7f3',
                        fontSize: 12.5,
                        lineHeight: 1.35,
                        fontStyle: 'italic',
                        textAlign: 'center',
                        opacity: message ? 1 : 0,
                        transform: message ? 'translateY(0) scale(1)' : 'translateY(6px) scale(0.92)',
                        transition: 'opacity 350ms ease, transform 350ms ease',
                    }}
                >
                    {message ?? lastMessage.current}
                </div>

                <div
                    ref={tiltRef}
                    style={{
                        width: '100%',
                        height: '100%',
                        willChange: 'transform',
                        filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.35))',
                    }}
                >
                    <div ref={faceRef} id="tb-face" style={{ width: '100%', height: '100%' }}>
                        <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible" aria-label="Thinkerbell">
                            <defs>
                                <linearGradient id="tb-wing" x1="1" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                                    <stop offset="55%" stopColor="#eafffb" stopOpacity="0.7" />
                                    <stop offset="100%" stopColor="#bdf3ff" stopOpacity="0.4" />
                                </linearGradient>
                                <radialGradient id="tb-skin" cx="35%" cy="30%" r="80%">
                                    <stop offset="0%" stopColor="#fff1e0" />
                                    <stop offset="100%" stopColor="#e8b48c" />
                                </radialGradient>
                                <radialGradient id="tb-hair" cx="35%" cy="30%" r="85%">
                                    <stop offset="0%" stopColor="#fde68a" />
                                    <stop offset="100%" stopColor="#d97706" />
                                </radialGradient>
                                <linearGradient id="tb-dress" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#a7f3d0" />
                                    <stop offset="60%" stopColor="#34d399" />
                                    <stop offset="100%" stopColor="#0f766e" />
                                </linearGradient>
                            </defs>

                            {/* pakpak sa likod (mas malabo, para may lalim) */}
                            <g className="tb-wing tb-wing-3" opacity="0.55">
                                <path d="M56 46 C46 14, 18 2, 8 12 C4 26, 28 44, 56 48 Z" fill="url(#tb-wing)" />
                            </g>

                            {/* mababang pakpak */}
                            <g className="tb-wing tb-wing-2">
                                <path d="M56 49 C40 52, 20 62, 24 73 C34 77, 52 63, 57 52 Z" fill="url(#tb-wing)" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.8" />
                            </g>

                            {/* mga binti */}
                            <path d="M52 64 L41 73" stroke="#e8b48c" strokeWidth="2.6" strokeLinecap="round" />
                            <path d="M55 66 L47 77" stroke="#e8b48c" strokeWidth="2.6" strokeLinecap="round" />

                            {/* damit */}
                            <path d="M60 45 L69 47 L59 66 Q50 71 45 64 Z" fill="url(#tb-dress)" />
                            <path d="M62 47 L65 48 L55 64 Q51 65 50 62 Z" fill="#ffffff" opacity="0.28" />

                            {/* braso */}
                            <path d="M66 50 L77 53" stroke="#e8b48c" strokeWidth="2.6" strokeLinecap="round" />

                            {/* ulo, buhok */}
                            <circle cx="60" cy="31" r="4.8" fill="url(#tb-hair)" />
                            <circle cx="67" cy="38" r="8" fill="url(#tb-skin)" />
                            <path d="M59 38 C58 28, 71 25, 74 34 C69 32, 63 33, 59 38 Z" fill="url(#tb-hair)" />
                            <circle cx="70" cy="39" r="1.3" fill="#3b2a20" />
                            <path d="M69 43 Q71.5 44.6 73.5 43" stroke="#c2607a" strokeWidth="1" fill="none" strokeLinecap="round" />
                            <ellipse cx="64" cy="33.5" rx="2.4" ry="1.3" fill="#ffffff" opacity="0.5" />

                            {/* malaking pakpak sa harap */}
                            <g className="tb-wing">
                                <path d="M56 46 C48 18, 22 6, 12 14 C8 26, 30 44, 56 48 Z" fill="url(#tb-wing)" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="0.9" />
                                <path d="M56 47 C42 33, 26 21, 15 16" stroke="#ffffff" strokeOpacity="0.6" strokeWidth="0.7" fill="none" />
                                <path d="M55 47 C40 40, 24 34, 12 24" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="0.6" fill="none" />
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        </>
    );
};