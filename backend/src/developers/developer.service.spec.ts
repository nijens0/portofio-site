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
});