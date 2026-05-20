import { CoupleLandingPage } from '../../couple-landing-page'
import { getCoupleLandingData } from '../../couple-landing-data'

const data = getCoupleLandingData('valentine-photoshoot-ideas')

export const metadata = data.metadata

export default function ValentinePhotoshootIdeasPage() {
  return <CoupleLandingPage data={data} />
}
