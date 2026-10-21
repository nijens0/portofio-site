import {StackService} from "./stack.service";
import {stackModel} from "../generated/prisma/models/stack";
import {Test} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";
import {CreateStackDto} from "./dto/create-stack.dto";
import {ConflictException, NotFoundException} from "@nestjs/common";
import {UpdateStackDto} from "./dto/update-stack";

describe('StackService', () => {
    let service: StackService;
    let prisma: any;
    let fakeStack: stackModel;

    const mockPrisma = {
        stack: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    };

    beforeAll(() => {
        fakeStack = {
            id: 1,
            technology: 'NestJS'
        }
    });

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [StackService, {provide: PrismaService, useValue: mockPrisma}]
        }).compile();

        service = module.get(StackService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => jest.clearAllMocks());

    const createStackDto: CreateStackDto = {
        technology: 'NestJS'
    };

    describe('createStack', () => {
        it('should create stack and return ReadStackDto', async () => {
            prisma.stack.findUnique.mockResolvedValue(null);
            prisma.stack.create.mockResolvedValue(fakeStack);

            const result = await service.createStack(createStackDto);

            expect(prisma.stack.findUnique).toHaveBeenCalledWith({where: {technology: createStackDto.technology}});
            expect(prisma.stack.create).toHaveBeenCalledWith({
                data: {
                    technology: 'NestJS'
                }
            });
            expect(result).toEqual(fakeStack);
        });

        it('should throw ConflictException if stack with this technology already exists', async () => {
            prisma.stack.findUnique.mockResolvedValue(fakeStack);

            await expect(service.createStack(createStackDto)).rejects.toThrow(ConflictException);

            expect(prisma.stack.create).not.toHaveBeenCalled();
        });
    });

    describe('readStack', () => {
        it('should read stack and return ReadStackDto', async () => {
            prisma.stack.findUnique.mockResolvedValue(fakeStack);

            const result = await service.readStackById(fakeStack.id);
            expect(prisma.stack.findUnique).toHaveBeenCalledWith({where: {id: fakeStack.id}});
            expect(result).toEqual(fakeStack);
        });

        it('should throw NotFoundException if stack does not exist', async () => {
            prisma.stack.findUnique.mockResolvedValue(null);

            await expect(service.readStackById(228)).rejects.toThrow(NotFoundException);
            expect(prisma.stack.findUnique).toHaveBeenCalledWith({where: {id: 228}});
        });
    });

    const fakeStacks: stackModel[] = [
        {id: 1, technology: 'NestJS'},
        {id: 2, technology: 'Prisma'},
        {id: 3, technology: 'PostgreSQL'},
        {id: 4, technology: 'React'},
        {id: 5, technology: 'Docker'}
    ];

    describe('readAllStacks', () => {
        it('should return collection of ReadStackDto', async () => {
            prisma.stack.findMany.mockResolvedValue(fakeStacks);

            const result = await service.readAllStacks();
            expect(prisma.stack.findMany).toHaveBeenCalled();
            expect(result).toEqual(fakeStacks);
        });

        it('should throw NotFoundException if there are no stacks', async () => {
            prisma.stack.findMany.mockResolvedValue([]);

            await expect(service.readAllStacks()).rejects.toThrow(NotFoundException);
        });
    });

    const updateStackDto: UpdateStackDto = {technology: 'Express'};

    describe('updateStack', () => {
        it('should update stack and return ReadStackDto', async () => {
            const updatedStack: stackModel = {...fakeStack, ...updateStackDto};

            prisma.stack.findUnique.mockResolvedValue(fakeStack);
            prisma.stack.update.mockResolvedValue(updatedStack);

            const result = await service.updateStackById(fakeStack.id, updateStackDto);

            expect(prisma.stack.findUnique).toHaveBeenCalledWith({where: {id: fakeStack.id}});
            expect(prisma.stack.update).toHaveBeenCalledWith({
                where: {id: fakeStack.id},
                data: updateStackDto
            });
            expect(result).toEqual(updatedStack);
        });

        it('should throw NotFoundException if stack does not exist', async () => {
            prisma.stack.findUnique.mockResolvedValue(null);

            await expect(service.updateStackById(fakeStack.id, updateStackDto))
                .rejects.toThrow(NotFoundException);
            expect(prisma.stack.update).not.toHaveBeenCalled();
        });
    });
});
