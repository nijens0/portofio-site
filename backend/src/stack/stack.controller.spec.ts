import {StackController} from "./stack.controller";
import {StackService} from "./stack.service";
import {Test} from "@nestjs/testing";
import {CreateStackDto} from "./dto/create-stack.dto";
import {ReadStackDto} from "./dto/read-stack.dto";
import {UpdateStackDto} from "./dto/update-stack";

describe('StackController', () => {
    let controller: StackController;
    let service: jest.Mocked<StackService>;

    const mockStackService = {
        createStack: jest.fn(),
        readStackById: jest.fn(),
        readAllStacks: jest.fn(),
        updateStackById: jest.fn(),
        deleteStackById: jest.fn()
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            controllers: [StackController],
            providers: [
                {provide: StackService, useValue: mockStackService},
            ]
        }).compile();

        controller = module.get(StackController);
        service = module.get(StackService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /stack', () => {
        it('should create stack', async () => {
            const dto: CreateStackDto = {technology: 'NestJS'};
            const created: ReadStackDto = {id: 1, ...dto};
            service.createStack.mockResolvedValue(created);

            await expect(controller.createStack(dto)).resolves.toEqual(created);
            expect(service.createStack).toHaveBeenCalledWith(dto);
        });
    });
});
