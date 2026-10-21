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

    describe('POST /projects', () => {
        it('should create project', async () => {
            const dto: CreateProjectDto = {
                name: "Portfolio site",
                slug: "portfolio",
                preview_url: "url",
                description: "fullstack project 'Portfolio site'",
                work_started: new Date('2026-08-02'),
                git: "https://github.com/nijens0"
            };
            const created = {id: 1, is_featured: false, ...dto} as ReadProjectDto;
            service.createProject.mockResolvedValue(created);

            await expect(controller.createProject(dto)).resolves.toEqual(created);
            expect(service.createProject).toHaveBeenCalledWith(dto);
        });
    });

    describe('GET /projects/:id', () => {
        it('should get project', async () => {
            const returned: ReadProjectDto = {
                id: 1,
                name: "Portfolio site",
                slug: "portfolio",
                preview_url: "url",
                description: "fullstack project 'Portfolio site'",
                work_started: new Date('2026-08-02'),
                is_featured: false,
                git: "https://github.com/nijens0"
            };
            service.readProjectById.mockResolvedValue(returned);

            await expect(controller.readProject(String(returned.id))).resolves.toEqual(returned);
            expect(service.readProjectById).toHaveBeenCalledWith(returned.id);
        });
    });
});
