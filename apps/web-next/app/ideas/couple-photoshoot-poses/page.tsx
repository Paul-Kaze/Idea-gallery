import { CoupleLandingPage } from '../../couple-landing-page'
import { getCoupleLandingData } from '../../couple-landing-data'

const data = getCoupleLandingData('couple-photoshoot-poses')

export const metadata = data.metadata

export default function CouplePhotoshootPosesPage() {
  return <CoupleLandingPage data={data} />
}
