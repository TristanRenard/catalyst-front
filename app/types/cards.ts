export interface SituationCard {
  id: string;
  effectId: string;
  frontImageUrl: string;
  backImageUrl: string;
}

export interface EnergySituationCard {
  id: string;
  situationCardId: string;
  quota: number;
  energy1Id: string;
  energy2Id: string;
  energy3Id: string;
  energy4Id: string;
  energy5Id: string;
}
