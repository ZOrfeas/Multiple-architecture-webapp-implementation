export class CreateAnswerDto {
  readonly ansContent: string;
  // readonly answeredOn: Date;
  readonly user: { id: number };
  readonly question: { id: number };
}
