import {DeveloperService} from "./developer.service";
import {developersModel} from "../generated/prisma/models/developers";
import {Test} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";

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
});