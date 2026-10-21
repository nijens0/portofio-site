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

    describe('POST /project-media', () => {
        it('should create project media', async () => {
            const dto: CreateProjectMediaDto = {
                type: media_type.PHOTO,
                url: "url",
                sort_order: 1,
                caption: "main page",
                project_id: 1
            };
            const created: ReadProjectMediaDto = {id: 1, ...dto};
            service.createProjectMedia.mockResolvedValue(created);

            await expect(controller.createProjectMedia(dto)).resolves.toEqual(created);
            expect(service.createProjectMedia).toHaveBeenCalledWith(dto);
        });
    });
});
