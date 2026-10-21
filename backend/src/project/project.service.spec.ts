import {ProjectService} from "./project.service";
import {projectModel} from "../generated/prisma/models/project";
import {Test} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";
import {CreateProjectDto} from "./dto/create-project.dto";
import {NotFoundException} from "@nestjs/common";
import {UpdateProjectDto} from "./dto/update-project.dto";

describe('ProjectService', () => {
    let service: ProjectService;
    let prisma: any;
    let fakeProject: projectModel;

    const mockPrisma = {
        project: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            deleteMany: jest.fn(),
        },
        project_media: {
            deleteMany: jest.fn()
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
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [ProjectService, {provide: PrismaService, useValue: mockPrisma}]
        }).compile();

        service = module.get(ProjectService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => jest.clearAllMocks());
});
