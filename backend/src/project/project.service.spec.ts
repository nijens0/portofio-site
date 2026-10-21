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

    const createProjectDto: CreateProjectDto = {
        name: "Portfolio site",
        slug: "portfolio",
        preview_url: "url",
        description: "fullstack project 'Portfolio site'",
        work_started: new Date('2026-08-02'),
        git: "https://github.com/nijens0"
    };

    describe('createProject', () => {
        it('should create project and return ReadProjectDto', async () => {
            prisma.project.create.mockResolvedValue(fakeProject);

            const result = await service.createProject(createProjectDto);

            expect(prisma.project.create).toHaveBeenCalledWith({data: createProjectDto});
            expect(result).toEqual(fakeProject);
        });
    });

    describe('readProject', () => {
        it('should read project and return ReadProjectDto', async () => {
            prisma.project.findUnique.mockResolvedValue(fakeProject);

            const result = await service.readProjectById(fakeProject.id);
            expect(prisma.project.findUnique).toHaveBeenCalledWith({where: {id: fakeProject.id}});
            expect(result).toEqual(fakeProject);
        });

        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            await expect(service.readProjectById(228)).rejects.toThrow(NotFoundException);
            expect(prisma.project.findUnique).toHaveBeenCalledWith({where: {id: 228}});
        });
    });

    const updateProjectDto: UpdateProjectDto = {
        description: "fullstack project 'Portfolio site' on NestJS",
        is_featured: true
    };

    describe('updateProject', () => {
        it('should update project and return ReadProjectDto', async () => {
            const updatedProject: projectModel = {...fakeProject, ...updateProjectDto};

            prisma.project.findUnique.mockResolvedValue(fakeProject);
            prisma.project.update.mockResolvedValue(updatedProject);

            const result = await service.updateProjectById(fakeProject.id, updateProjectDto);

            expect(prisma.project.findUnique).toHaveBeenCalledWith({where: {id: fakeProject.id}});
            expect(prisma.project.update).toHaveBeenCalledWith({
                where: {id: fakeProject.id},
                data: updateProjectDto
            });
            expect(result).toEqual(updatedProject);
        });

        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            await expect(service.updateProjectById(fakeProject.id, updateProjectDto))
                .rejects.toThrow(NotFoundException);
            expect(prisma.project.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteProject', () => {
        it('should delete project if exists', async () => {
            prisma.project.findUnique.mockResolvedValue(fakeProject);
            prisma.project.delete.mockResolvedValue(fakeProject);

            const result = await service.deleteProjectById(fakeProject.id);
            expect(prisma.project.findUnique).toHaveBeenCalledWith({where: {id: fakeProject.id}});
            expect(prisma.project.delete).toHaveBeenCalledWith({where: {id: fakeProject.id}});
            expect(result).toEqual(fakeProject);
        });

        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            await expect(service.deleteProjectById(fakeProject.id)).rejects.toThrow(NotFoundException);
            expect(prisma.project.delete).not.toHaveBeenCalled();
        });
    });
});
