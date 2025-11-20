export interface SituationCard {
  id: string
  effectId: string
  backImage: string
  frontImage: string
  quota: number
  energie1Id: string
  energie2Id: string
  energie3Id: string
  energie4Id: string
  energie5Id: string
  effect?: {
    id: string
    name: string
    description: string
    type: string
    points: number
    slug: string
  }
  requiredEnergies?: Array<{
    id: string
    name: string
    color: string
    quota: number
    backImage: string
    frontImage: string
    picto: string
  }>
}
