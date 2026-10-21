import {ProjectMediaController} from "./project-media.controller";
import {ProjectMediaService} from "./project-media.service";
import {Test} from "@nestjs/testing";
import {media_type} from "../generated/prisma/enums";
import {CreateProjectMediaDto} from "./dto/create-project-media.dto";
import {ReadProjectMediaDto} from "./dto/read-project-media.dto";
import {UpdateProjectMediaDto} from "./dto/update-project-media.dto";

describe('ProjectMediaController', () => {
    let controller: ProjectMediaController;
    let service: jest.Mocked<ProjectMediaService>;

    const mockProjectMediaService = {
        createProjectMedia: jest.fn(),
        readProjectMediaById: jest.fn(),
        readAllProjectMediaByProjectId: jest.fn(),
        updateProjectMediaById: jest.fn(),
        deleteProjectMediaById: jest.fn()
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [ProjectMediaController],
            providers: [
                {provide: ProjectMediaService, useValue: mockProjectMediaService},
            ]
        }).compile();

        controller = module.get(ProjectMediaController);
        service = module.get(ProjectMediaService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
