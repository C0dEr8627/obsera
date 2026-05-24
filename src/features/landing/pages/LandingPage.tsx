import CTASection from '../components/CTASection'
import HeroSection from '../components/HeroSection'
import LandingNavbar from '../components/LandingNavbar'

interface LandingPageProps {
  onStartUpload: () => void
}

const LandingPage = ({ onStartUpload }: LandingPageProps) => (
  <div className="min-h-screen bg-[var(--obsera-bg)] text-[var(--obsera-text)]">
    <LandingNavbar onUploadClick={onStartUpload} />
    <main>
      <HeroSection onUploadClick={onStartUpload} />
      <CTASection onUploadClick={onStartUpload} />
    </main>
  </div>
)

export default LandingPage
