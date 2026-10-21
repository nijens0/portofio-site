import {DeveloperController} from "./developer.controller";
import {DeveloperService} from "./developer.service";
import {Test} from "@nestjs/testing";

describe('DeveloperController', () => {
    let controller: DeveloperController;
    let service: jest.Mocked<DeveloperService>

    const mockDeveloperService = {
        createDeveloper: jest.fn(),
        readDeveloperById: jest.fn(),
        readAllDevelopers: jest.fn(),
        updateDeveloperById: jest.fn(),
        deleteDeveloperById: jest.fn(),
        getDevelopersProjectById: jest.fn()
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [DeveloperController],
            providers: [
                {provide: DeveloperService, useValue: mockDeveloperService},
            ]
        }).compile();

        controller = module.get(DeveloperController);
        service = module.get(DeveloperService);
    });

    afterEach(() => {jest.clearAllMocks()});

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /developers', () => {
        it('should create developer', async () => {
            const dto: CreateDeveloperDto = {name: 'Dima', surname: 'Mongolin', nickname: 'nijens0'};
            const created = {id: 1, ...dto} as ReadDeveloperDto;
            service.createDeveloper.mockResolvedValue(created);

            await expect(controller.createDeveloper(dto)).resolves.toEqual(created);
            expect(service.createDeveloper).toHaveBeenCalledWith(dto);
        });
    });

    describe('GET /developers?id=id', () => {
        it('should get developer', async () => {
            const returned: ReadDeveloperDto = {id: 1, name: 'Dima', surname: 'Mongolin', nickname: 'nijens0'};
            service.readDeveloperById.mockResolvedValue(returned);

            await expect(controller.readDeveloperById(String(returned.id))).resolves.toEqual(returned);
            expect(service.readDeveloperById).toHaveBeenCalledWith(returned.id);
        })
    });

    describe('GET /developers', () => {
        it('should get all developers', async () => {
           const returned: ReadDeveloperDto[] = [
               {id: 1, name: 'Dima', surname: 'Mongolin', nickname: 'nijens0'},
               {id: 2, name: 'Mix', surname: 'Slovenian', nickname: 'mijok'},
               {id: 3, name: 'Lexa', surname: 'Verstakov', nickname: 'e1shiy'},
               {id: 4, name: 'Max', surname: 'Korotkov', nickname: 'xronicle'},
               {id: 5, name: 'Maks', surname: 'Zagibax', nickname: 'vihuhol'}
           ];
           service.readAllDevelopers.mockResolvedValue(returned);

           await expect(controller.readAllDevelopers()).resolves.toEqual(returned);
        });
    });

    describe('PATCH /developers?id=id', () => {
       it('should update developer by id', async () => {
           const dto: UpdateDeveloperDto = {name: 'Dima'};
           const updated: ReadDeveloperDto = {id: 1, name: 'Dima', surname: 'Mongolin', nickname: 'nijens0'};
           service.updateDeveloperById.mockResolvedValue(updated);

           await expect(controller.updateDeveloperById(String(updated.id), dto)).resolves.toEqual(updated);
           expect(service.updateDeveloperById).toHaveBeenCalledWith(updated.id, dto);
       });
    });
});