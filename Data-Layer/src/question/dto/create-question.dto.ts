export class CreateQuestionDto {
  readonly title: string;
  readonly questContent: string;
  readonly askedOn: Date;
  readonly user: { id: number };
  keywords?: { id: number }[];
}
