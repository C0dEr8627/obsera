import CTASection, { WorkflowSection } from '../components/CTASection'
import HeroSection from '../components/HeroSection'
import LandingNavbar from '../components/LandingNavbar'

interface LandingPageProps {
  onStartUpload: () => void
}

const LandingPage = ({ onStartUpload }: LandingPageProps) => (
  <div className="min-h-screen bg-[var(--obsera-bg)] text-[var(--obsera-text)]">
    <LandingNavbar />
    <main>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_360px]">
        <HeroSection />
        <CTASection onUploadClick={onStartUpload} />
      </section>
      <WorkflowSection />
    </main>
  </div>
)

export default LandingPage
