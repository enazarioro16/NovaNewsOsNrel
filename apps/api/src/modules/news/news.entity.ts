export class NewsEntity {
  constructor(
    public readonly id: string,
    public title: string,
    public content: string,
    public status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
