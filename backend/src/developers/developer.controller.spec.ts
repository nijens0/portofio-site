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

});