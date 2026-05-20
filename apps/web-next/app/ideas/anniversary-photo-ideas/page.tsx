import { CoupleLandingPage } from '../../couple-landing-page'
import { getCoupleLandingData } from '../../couple-landing-data'

const data = getCoupleLandingData('anniversary-photo-ideas')

export const metadata = data.metadata

export default function AnniversaryPhotoIdeasPage() {
  return <CoupleLandingPage data={data} />
}
