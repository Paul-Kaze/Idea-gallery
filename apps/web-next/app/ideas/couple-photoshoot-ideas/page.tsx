import { DommiCoupleIdeasPage } from '../../dommi-couple-ideas-page'
import { getCoupleLandingData } from '../../couple-landing-data'

const data = getCoupleLandingData('couple-photoshoot-ideas')

export const metadata = data.metadata

export default function CouplePhotoshootIdeasPage() {
  return <DommiCoupleIdeasPage data={data} />
}
