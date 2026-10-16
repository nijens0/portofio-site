import {AdminController} from "./admin.controller";
import {AdminService} from "./admin.service";
import {Test, TestingModule} from "@nestjs/testing";
import {UpdateAdminDto} from "./dto/update-admin.dto";
import {ReadAdminDto} from "./dto/read-admin.dto";
import {CreateAdminDto} from "./dto/create-admin.dto";
import {ChangeAdminPasswordDto} from "./dto/change-admin-password.dto";

describe('AdminController', () => {
    let controller: AdminController;
    let service: jest.Mocked<AdminService>;

    const mockAdminService = {
        createAdmin: jest.fn(),
        readAdminById: jest.fn(),
        updateAdminById: jest.fn(),
        changeAdminPasswordByEmail: jest.fn(),
        deleteAdminById: jest.fn()
    }

    beforeEach(async () => {
       const module: TestingModule = await Test.createTestingModule({
           controllers: [AdminController],
           providers: [
               { provide: AdminService, useValue: mockAdminService }
           ]
       }).compile();

       controller = module.get(AdminController);
       service = module.get(AdminService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('POST /admin', () => {
        it('should create admin', async () => {
            const dto: CreateAdminDto = {email: 'nijens@mail.ru', password: 'testPassword'};
            const created = {id: 1, ...dto};
            service.createAdmin.mockResolvedValue(created);

            await expect(controller.createAdmin(dto)).resolves.toEqual(created);
            expect(service.createAdmin).toHaveBeenCalledWith(dto);
        });
    });

    describe('GET /admin?id=id', () => {
       it('should get admin', async () => {
           const returned: ReadAdminDto = {id: 1, email: 'nijens@mail.ru'};
           service.readAdminById.mockResolvedValue(returned);

           await expect(controller.readAdminById(String(returned.id))).resolves.toEqual(returned);
           expect(service.readAdminById).toHaveBeenCalledWith(returned.id);
       });
    });

    describe('PATCH /admin?id=id', () => {
        it('should update admin', async () => {
            const dto: UpdateAdminDto = {email: 'newNijens@mail.ru'};
            const returned: ReadAdminDto = {id: 1, email: 'newNijens@mail.ru'};
            service.updateAdminById.mockResolvedValue(returned);

            await expect(controller.updateAdminById(String(returned.id), dto)).resolves.toEqual(returned);
            expect(service.updateAdminById).toHaveBeenCalledWith(returned.id, dto);
        });
    });

    describe('PATCH /admin?email=email/password', () => {
       it('should update password', async () => {
           const dto: ChangeAdminPasswordDto = {currentPassword: 'testPassword', newPassword: 'newTestPassword'};
           const returned: ReadAdminDto = {id: 1, email: 'newNijens@mail.ru'};
           service.changeAdminPasswordByEmail.mockResolvedValue(returned);

           await expect(controller.changePasswordAdminByEmail(returned.email, dto)).resolves.toEqual(returned);
           expect(service.changeAdminPasswordByEmail).toHaveBeenCalledWith(returned.email, dto);
       });
    });

    describe('DELETE /admin?id=id', () => {
        it('should delete admin', async () => {
            const deleted: ReadAdminDto = {id: 1, email: 'nijens@mail.ru'}
            service.deleteAdminById.mockResolvedValue(deleted);

            await expect(controller.deleteAdminById(String(deleted.id))).resolves.toEqual(deleted);
            expect(service.deleteAdminById).toHaveBeenCalledWith(deleted.id);
        });
    });
})