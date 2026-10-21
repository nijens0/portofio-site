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
});