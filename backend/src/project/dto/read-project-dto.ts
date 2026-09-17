export class ReadProjectDto {
    id: number;
    name: string;
    slug: string;
    preview_url: string;
    employer?: string;
    description: string;
    work_started: Date;
    work_ended?: Date;
    is_featured: boolean;
    git: string;
}