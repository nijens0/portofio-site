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

    const createProjectMediaDto: CreateProjectMediaDto = {
        type: media_type.PHOTO,
        url: "url",
        sort_order: 1,
        caption: "main page",
        project_id: 1
    };

    describe('createProjectMedia', () => {
        it('should create project media and return ReadProjectMediaDto', async () => {
            prisma.project.findUnique.mockResolvedValue(fakeProject);
            prisma.project_media.create.mockResolvedValue(fakeProjectMedia);

            const result = await service.createProjectMedia(createProjectMediaDto);

            expect(prisma.project.findUnique).toHaveBeenCalledWith({where: {id: createProjectMediaDto.project_id}});
            expect(prisma.project_media.create).toHaveBeenCalledWith({data: createProjectMediaDto});
            expect(result).toEqual(fakeProjectMedia);
        });

        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            await expect(service.createProjectMedia(createProjectMediaDto)).rejects.toThrow(NotFoundException);

            expect(prisma.project_media.create).not.toHaveBeenCalled();
        });
    });

    describe('readProjectMedia', () => {
        it('should read project media and return ReadProjectMediaDto', async () => {
            prisma.project_media.findUnique.mockResolvedValue(fakeProjectMedia);

            const result = await service.readProjectMediaById(fakeProjectMedia.id);
            expect(prisma.project_media.findUnique).toHaveBeenCalledWith({where: {id: fakeProjectMedia.id}});
            expect(result).toEqual(fakeProjectMedia);
        });

        it('should throw NotFoundException if project media does not exist', async () => {
            prisma.project_media.findUnique.mockResolvedValue(null);

            await expect(service.readProjectMediaById(228)).rejects.toThrow(NotFoundException);
            expect(prisma.project_media.findUnique).toHaveBeenCalledWith({where: {id: 228}});
        });
    });

    const fakeProjectMediaCollection: project_mediaModel[] = [
        {id: 1, type: media_type.PHOTO, url: "url", sort_order: 1, caption: "main page", project_id: 1},
        {id: 2, type: media_type.VIDEO, url: "url", sort_order: 2, caption: "demo", project_id: 1},
        {id: 3, type: media_type.GIF, url: "url", sort_order: null, caption: null, project_id: 1}
    ];

    describe('readAllProjectMediaByProjectId', () => {
        it('should return collection of ReadProjectMediaDto', async () => {
            prisma.project.findUnique.mockResolvedValue(fakeProject);
            prisma.project_media.findMany.mockResolvedValue(fakeProjectMediaCollection);

            const result = await service.readAllProjectMediaByProjectId(fakeProject.id);
            expect(prisma.project.findUnique).toHaveBeenCalledWith({where: {id: fakeProject.id}});
            expect(prisma.project_media.findMany).toHaveBeenCalledWith({
                where: {
                    project_id: fakeProject.id
                }
            });
            expect(result).toEqual(fakeProjectMediaCollection);
        });

        it('should return empty collection if project has no media', async () => {
            prisma.project.findUnique.mockResolvedValue(fakeProject);
            prisma.project_media.findMany.mockResolvedValue([]);

            const result = await service.readAllProjectMediaByProjectId(fakeProject.id);
            expect(result).toEqual([]);
        });

        it('should throw NotFoundException if project does not exist', async () => {
            prisma.project.findUnique.mockResolvedValue(null);

            await expect(service.readAllProjectMediaByProjectId(fakeProject.id)).rejects.toThrow(NotFoundException);

            expect(prisma.project_media.findMany).not.toHaveBeenCalled();
        });
    });

    const updateProjectMediaDto: UpdateProjectMediaDto = {
        caption: "new main page",
        project_id: 1
    };

    describe('updateProjectMedia', () => {
        it('should update project media and return ReadProjectMediaDto', async () => {
            const updatedProjectMedia: project_mediaModel = {...fakeProjectMedia, ...updateProjectMediaDto};

            prisma.project_media.findUnique.mockResolvedValue(fakeProjectMedia);
            prisma.project_media.update.mockResolvedValue(updatedProjectMedia);

            const result = await service.updateProjectMediaById(fakeProjectMedia.id, updateProjectMediaDto);

            expect(prisma.project_media.findUnique).toHaveBeenCalledWith({where: {id: fakeProjectMedia.id}});
            expect(prisma.project_media.update).toHaveBeenCalledWith({
                where: {id: fakeProjectMedia.id},
                data: updateProjectMediaDto
            });
            expect(result).toEqual(updatedProjectMedia);
        });

        it('should throw NotFoundException if project media does not exist', async () => {
            prisma.project_media.findUnique.mockResolvedValue(null);

            await expect(service.updateProjectMediaById(fakeProjectMedia.id, updateProjectMediaDto))
                .rejects.toThrow(NotFoundException);
            expect(prisma.project_media.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteProjectMedia', () => {
        it('should delete project media if exists', async () => {
            prisma.project_media.findUnique.mockResolvedValue(fakeProjectMedia);
            prisma.project_media.delete.mockResolvedValue(fakeProjectMedia);

            const result = await service.deleteProjectMediaById(fakeProjectMedia.id);
            expect(prisma.project_media.findUnique).toHaveBeenCalledWith({where: {id: fakeProjectMedia.id}});
            expect(prisma.project_media.delete).toHaveBeenCalledWith({where: {id: fakeProjectMedia.id}});
            expect(result).toEqual(fakeProjectMedia);
        });

        it('should throw NotFoundException if project media does not exist', async () => {
            prisma.project_media.findUnique.mockResolvedValue(null);

            await expect(service.deleteProjectMediaById(fakeProjectMedia.id)).rejects.toThrow(NotFoundException);
            expect(prisma.project_media.delete).not.toHaveBeenCalled();
        });
    });
});
