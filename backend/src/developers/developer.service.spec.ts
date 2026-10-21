import {DeveloperService} from "./developer.service";
import {developersModel} from "../generated/prisma/models/developers";
import {Test} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";
import {CreateDeveloperDto} from "./dto/create-developer.dto";
import {ConflictException, NotFoundException} from "@nestjs/common";
import {UpdateDeveloperDto} from "./dto/update-developer.dto";
import {ReadProjectDto} from "../project/dto/read-project.dto";

describe('DeveloperService', () => {
    let service: DeveloperService;
    let prisma: any;
    let fakeDeveloper: developersModel;

    const mockPrisma = {
        developers: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        project: {
            findMany: jest.fn()
        }
    };

    beforeAll(() => {
        fakeDeveloper = {
            id: 1,
            name: 'Dima',
            surname: 'Mongolin',
            nickname: 'nijens0'
        }
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [DeveloperService, {provide: PrismaService, useValue: mockPrisma}]
        }).compile()

        service = module.get(DeveloperService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => jest.clearAllMocks());

    const createDeveloperDto: CreateDeveloperDto = {
        name: 'Dima',
        surname: 'Mongolin',
        nickname: 'nijens0'
    };

    describe('createDeveloper', () => {
        it('should create developer and return ReadDeveloperDto', async () => {
            prisma.developers.create.mockResolvedValue(fakeDeveloper);

            await service.createDeveloper(createDeveloperDto);

            expect(prisma.developers.create).toHaveBeenCalledWith({
                data: {
                    name: 'Dima',
                    surname: 'Mongolin',
                    nickname: 'nijens0'
                }
            });
        });

        it('should throw ConflictException if dto has empty body', async () => {
            prisma.developers.create.mockResolvedValue(null);

            await expect(service.createDeveloper({})).rejects.toThrow(ConflictException);

            expect(prisma.developers.create).not.toHaveBeenCalled();
        });
    });

    describe('readDeveloper', () => {
        it('should read developer and return ReadDeveloperDto', async () => {
            prisma.developers.findUnique.mockResolvedValue(fakeDeveloper);

            const result = await service.readDeveloperById(fakeDeveloper.id);
            expect(prisma.developers.findUnique).toHaveBeenCalledWith({where: {id: fakeDeveloper.id}});
            expect(result).toEqual(fakeDeveloper);
        });

        it('should throw NotFoundException if developer does not exist', async () => {
            prisma.developers.findUnique.mockResolvedValue(null);

            await expect(service.readDeveloperById(1)).rejects.toThrow(NotFoundException);
            expect(prisma.developers.findUnique).toHaveBeenCalledWith({where: {id: 1}});
        });
    });

    const fakeDevelopers: developersModel[] = [
        {id: 1, name: 'Dima', surname: 'Mongolin', nickname: 'nijens0'},
        {id: 2, name: 'Mix', surname: 'Slovenian', nickname: 'mijok'},
        {id: 3, name: 'Lexa', surname: 'Verstakov', nickname: 'e1shiy'},
        {id: 4, name: 'Max', surname: 'Korotkov', nickname: 'xronicle'},
        {id: 5, name: 'Maks', surname: 'Zagibax', nickname: 'vihuhol'}
    ];

    describe('readAllDevelopers', () => {
        it('should return collection of ReadDeveloperDto', async () => {
            prisma.developers.findMany.mockResolvedValue(fakeDevelopers);

            const result = await service.readAllDevelopers();
            expect(result).toEqual(fakeDevelopers);
        });

        it('should return empty collection of ReadDeveloperDto', async () => {
            prisma.developers.findMany.mockResolvedValue([]);

            const result = await service.readAllDevelopers();
            expect(result).toEqual([]);
        });
    });

    const updateDeveloperDto: UpdateDeveloperDto = {name: 'Lexa'};

    describe('updateDeveloper', () => {
        it('should update developer and return ReadDeveloperDto', async () => {
            const updatedDeveloper: developersModel = {...fakeDeveloper, ...updateDeveloperDto};

            prisma.developers.findUnique.mockResolvedValue(fakeDeveloper);
            prisma.developers.update.mockResolvedValue(updatedDeveloper);

            const result = await service.updateDeveloperById(fakeDeveloper.id, updateDeveloperDto);

            expect(prisma.developers.findUnique).toHaveBeenCalledWith({where: {id: updatedDeveloper.id}});
            expect(result).not.toEqual(fakeDeveloper);
        });

        it('should throw NotFoundException if developer does not exist', async () => {
            prisma.developers.findUnique.mockResolvedValue(null);

            await expect(service.updateDeveloperById(fakeDeveloper.id, updateDeveloperDto))
                .rejects.toThrow(NotFoundException);
            expect(prisma.developers.update).not.toHaveBeenCalled();
        });
    });

    describe('deleteDeveloper', () => {
        it('should delete developer if exists', async () => {
            prisma.developers.findUnique.mockResolvedValue(fakeDeveloper);
            prisma.developers.delete.mockResolvedValue(fakeDeveloper);

            await service.deleteDeveloperById(fakeDeveloper.id);
            expect(prisma.developers.findUnique).toHaveBeenCalledWith({where: {id: fakeDeveloper.id}});
            expect(prisma.developers.delete).toHaveBeenCalledWith({where: {id: fakeDeveloper.id}});
        });

        it('should throw NotFoundException if developer does not exist', async () => {
            prisma.developers.findUnique.mockResolvedValue(null);

            await expect(service.deleteDeveloperById(fakeDeveloper.id)).rejects.toThrow(NotFoundException);
            expect(prisma.developers.delete).not.toHaveBeenCalled();
        })
    });

    const project: ReadProjectDto[] = [
        {
            id: 1,
            name: "GazpromNeft Vostok shift-scheduler",
            slug: "GNV-WEB",
            preview_url: "url",
            description: "frontend for shift scheduler system",
            work_started: new Date('2026-04-20'),
            is_featured: false,
            git: "https://github.com/nijens0"
        },
        {
            id: 2,
            name: "Portfolio site",
            slug: "portfolio",
            preview_url: "url",
            description: "fullstack project 'Portfolio site'",
            work_started: new Date('2026-08-02'),
            is_featured: false,
            git: "https://github.com/nijens0"
        },
        {
            id: 3,
            name: "scorm weigh batcher",
            slug: "scorm-weigh-batcher",
            preview_url: "",
            description: "",
            work_started: new Date('2026-09-16'),
            is_featured: false,
            git: "https://github.com/nijens0"
        },
    ];

    describe('getDevelopersProjectById', () => {
        it('should return projects by id', async () => {
            prisma.developers.findUnique.mockResolvedValue(fakeDeveloper);
            prisma.project.findMany.mockResolvedValue(project);

            await service.getDeveloperProjectsById(fakeDeveloper.id);
            expect(prisma.developers.findUnique).toHaveBeenCalledWith({where: {id: fakeDeveloper.id}});
            expect(prisma.project.findMany).toHaveBeenCalledWith({
                where: {
                    dev_project_cross_ref: {
                        some: {dev_id: fakeDeveloper.id}
                    }
                }
            });
        });

        it('should return empty collection if developer has no projects', async () => {
            prisma.developers.findUnique.mockResolvedValue(fakeDeveloper);
            prisma.project.findMany.mockResolvedValue([]);

            const result = await service.getDeveloperProjectsById(fakeDeveloper.id);
            expect(prisma.developers.findUnique).toHaveBeenCalledWith({where: {id: fakeDeveloper.id}});
            expect(prisma.project.findMany).toHaveBeenCalledWith({
                where: {
                    dev_project_cross_ref: {
                        some: {dev_id: fakeDeveloper.id}
                    }
                }
            });
            expect(result).toEqual([]);
        });

        it('should throw NotFoundException if developer does not exist', async () => {
            prisma.developers.findUnique.mockResolvedValue(null);

            await expect(service.getDeveloperProjectsById(fakeDeveloper.id)).rejects.toThrow(NotFoundException);

            expect(prisma.project.findMany).not.toHaveBeenCalled();
        });
    });
});