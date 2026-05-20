import { CoupleLandingPage } from '../../couple-landing-page'
import { getCoupleLandingData } from '../../couple-landing-data'

const data = getCoupleLandingData('engagement-photoshoot-ideas')

export const metadata = data.metadata

export default function EngagementPhotoshootIdeasPage() {
  return <CoupleLandingPage data={data} />
}
