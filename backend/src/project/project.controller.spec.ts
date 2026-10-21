import {ProjectController} from "./project.controller";
import {ProjectService} from "./project.service";
import {Test} from "@nestjs/testing";
import {CreateProjectDto} from "./dto/create-project.dto";
import {ReadProjectDto} from "./dto/read-project.dto";
import {UpdateProjectDto} from "./dto/update-project.dto";

describe('ProjectController', () => {
    let controller: ProjectController;
    let service: jest.Mocked<ProjectService>;

    const mockProjectService = {
        createProject: jest.fn(),
        readProjectById: jest.fn(),
        updateProjectById: jest.fn(),
        deleteProjectById: jest.fn(),
        deleteAllProjectMediaById: jest.fn()
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ProjectController],
            providers: [
                {provide: ProjectService, useValue: mockProjectService},
            ]
        }).compile();

        controller = module.get(ProjectController);
        service = module.get(ProjectService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
