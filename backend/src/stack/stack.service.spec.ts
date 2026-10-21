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
});
