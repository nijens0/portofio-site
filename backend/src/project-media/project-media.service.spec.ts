import {ProjectMediaService} from "./project-media.service";
import {project_mediaModel} from "../generated/prisma/models/project_media";
import {projectModel} from "../generated/prisma/models/project";
import {media_type} from "../generated/prisma/enums";
import {Test} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";
import {CreateProjectMediaDto} from "./dto/create-project-media.dto";
import {NotFoundException} from "@nestjs/common";
import {UpdateProjectMediaDto} from "./dto/update-project-media.dto";

describe('ProjectMediaService', () => {
    let service: ProjectMediaService;
    let prisma: any;
    let fakeProject: projectModel;
    let fakeProjectMedia: project_mediaModel;

    const mockPrisma = {
        project: {
            findUnique: jest.fn()
        },
        project_media: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    };

    beforeAll(() => {
        fakeProject = {
            id: 1,
            name: "Portfolio site",
            slug: "portfolio",
            preview_url: "url",
            employer: null,
            description: "fullstack project 'Portfolio site'",
            work_started: new Date('2026-08-02'),
            work_ended: null,
            is_featured: false,
            git: "https://github.com/nijens0"
        }

        fakeProjectMedia = {
            id: 1,
            type: media_type.PHOTO,
            url: "url",
            sort_order: 1,
            caption: "main page",
            project_id: fakeProject.id
        }
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ProjectMediaService, {provide: PrismaService, useValue: mockPrisma}]
        }).compile();

        service = module.get(ProjectMediaService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => jest.clearAllMocks());
});
