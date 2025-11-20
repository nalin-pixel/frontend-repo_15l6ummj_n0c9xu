import Spline from '@splinetool/react-spline';

export default function HeroSpline() {
  return (
    <div className="relative w-full h-[340px] md:h-[420px] rounded-2xl overflow-hidden border border-white/5 bg-black">
      <Spline scene="https://prod.spline.design/gL1OurO-6gihUrEW/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
      <div className="absolute bottom-4 left-4">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white drop-shadow-[0_0_20px_rgba(59,130,246,0.35)]">
          508 Spendings
        </h1>
        <p className="text-sm text-white/70">Neo-black theme with neon vibes</p>
      </div>
    </div>
  )
}
