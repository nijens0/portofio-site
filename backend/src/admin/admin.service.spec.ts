import {AdminService} from "./admin.service";
import {adminModel} from '../generated/prisma/models';
import {CreateAdminDto} from "./dto/create-admin.dto";
import {Test, TestingModule} from "@nestjs/testing";
import {PrismaService} from "../prisma/prisma.service";
import {ConflictException, NotFoundException, UnauthorizedException} from "@nestjs/common";
import * as argon2 from 'argon2';
import {UpdateAdminDto} from "./dto/update-admin.dto";
import {ChangeAdminPasswordDto} from "./dto/change-admin-password.dto";

describe('AdminService', () => {
    let service: AdminService;
    let prisma: any;
    let fakeAdmin: adminModel;

    const mockPrisma = {
        admin: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        }
    };

    beforeAll(async () => {
        fakeAdmin = {
            id: 1,
            email: 'nijens@mail.com',
            password_hash: await argon2.hash('testPassword')
        };
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [AdminService, {provide: PrismaService, useValue: mockPrisma}]
        }).compile();

        service = module.get(AdminService);
        prisma = module.get(PrismaService);
    });

    afterEach(() => jest.clearAllMocks());

    const createDto: CreateAdminDto = {
        email: 'nijens@mail.com',
        password: 'testPassword'
    }

    describe('createAdmin', () => {
        it('should create admin and return ReadAdminDto without password_hash', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);
            prisma.admin.create.mockResolvedValue(fakeAdmin);

            const result = await service.createAdmin(createDto);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {email: createDto.email}});

            expect(prisma.admin.create).toHaveBeenCalledWith({
                data: {
                    email: createDto.email,
                    password_hash: expect.any(String),
                }
            });

            const createCallArgs = prisma.admin.create.mock.calls[0][0];
            expect(createCallArgs.data.password_hash).not.toEqual(createDto.password);

            expect(result).not.toHaveProperty('password_hash');
            expect(result.email).toEqual(fakeAdmin.email);
        });

        it('should throw ConflictException if admin with this email already exists', async () => {
            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);

            await expect(service.createAdmin(createDto)).rejects.toThrow(ConflictException);

            expect(prisma.admin.create).not.toHaveBeenCalled();
        });

        it('should actually hash the password with argon2 (real hash, not mocked)', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);
            prisma.admin.create.mockResolvedValue(fakeAdmin);

            await service.createAdmin(createDto);

            const createCallArgs = prisma.admin.create.mock.calls[0][0];
            const hashSentToDb = createCallArgs.data.password_hash;

            expect(hashSentToDb).toMatch(/^\$argon2/);
            const isValid = await argon2.verify(hashSentToDb, createDto.password);
            expect(isValid).toBe(true);
        });
    });

    describe('readAdmin', () => {
        it('should return ReadAdminDto without password_hash', async () => {
            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);

            const result = await service.readAdminById(fakeAdmin.id);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {id: fakeAdmin.id}});
            expect(result.id).toEqual(fakeAdmin.id);
            expect(result).not.toHaveProperty('password_hash');
        });

        it('should throw NotFoundException if admin with this id does not exist', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);

            await expect(service.readAdminById(2)).rejects.toThrow(NotFoundException);
            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {id: 2}});
        });
    });

    const updateDto: UpdateAdminDto = {
        email: 'newnijens@mail.com'
    }

    describe('updateAdmin', () => {
        it('should update admin and return ReadAdminDto without password_hash', async () => {
            const updatedAdmin: adminModel = { ...fakeAdmin, email: updateDto.email!}

            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);
            prisma.admin.update.mockResolvedValue(updatedAdmin);

            const result = await service.updateAdminById(fakeAdmin.id, createDto);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({where: {id: fakeAdmin.id}});
            expect(result).not.toHaveProperty('password_hash');
        });

        it('should throw NotFoundException if admin with this id does not exist', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);

            await expect(service.readAdminById(228)).rejects.toThrow(NotFoundException);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({ where: { id: 228 } });
        });
    });

    const updatePasswordDto: ChangeAdminPasswordDto = {
        currentPassword: 'testPassword',
        newPassword: 'newTestPassword'
    }

    describe('changePassword', () => {
        it('should update password and return ReadAdminDto without password_hash', async () => {
            const adminWithRealHash: adminModel = {
                ...fakeAdmin,
                password_hash: await argon2.hash(updatePasswordDto.currentPassword),
            };

            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);
            prisma.admin.update.mockResolvedValue(adminWithRealHash);

            const result = await service.changeAdminPasswordByEmail(fakeAdmin.email, updatePasswordDto);

            const hashSentToDb = prisma.admin.update.mock.calls[0][0].data.password_hash;

            expect(hashSentToDb).toMatch(/^\$argon2/);
            expect(hashSentToDb).not.toEqual(updatePasswordDto.newPassword);
            expect(await argon2.verify(hashSentToDb, updatePasswordDto.newPassword)).toBe(true);
            expect(await argon2.verify(hashSentToDb, updatePasswordDto.currentPassword)).toBe(false);

            expect(result).not.toHaveProperty('password_hash');
        });

        it('should not update if currentPassword is wrong', async () => {
            const adminWithRealHash: adminModel = {
                ...fakeAdmin,
                password_hash: await argon2.hash('someOtherPassword'),
            };
            prisma.admin.findUnique.mockResolvedValue(adminWithRealHash);

            await expect(
                service.changeAdminPasswordByEmail(fakeAdmin.email, updatePasswordDto),
            ).rejects.toThrow(UnauthorizedException);

            expect(prisma.admin.update).not.toHaveBeenCalled();
        });

        it('should not update if admin does not exist', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);

            await expect(service.changeAdminPasswordByEmail('fakeEmail', updatePasswordDto)).rejects.toThrow(NotFoundException);

            expect(prisma.admin.findUnique).toHaveBeenCalledWith({ where: { email: 'fakeEmail' } });
        });

    });

    describe('deleteAdmin', () => {
        it('should delete admin if exists', async () => {
            prisma.admin.findUnique.mockResolvedValue(fakeAdmin);
            prisma.admin.delete.mockResolvedValue(fakeAdmin as Omit<adminModel, 'password_hash'>);

            await service.deleteAdminById(fakeAdmin.id);
            expect(prisma.admin.findUnique).toHaveBeenCalledWith({ where: { id: fakeAdmin.id } });
            expect(prisma.admin.delete).toHaveBeenCalledWith({where: {id: fakeAdmin.id}});
        });

        it('should throw NotFoundException if admin does not exist', async () => {
            prisma.admin.findUnique.mockResolvedValue(null);

            await expect(service.deleteAdminById(228)).rejects.toThrow(NotFoundException);
            expect(prisma.admin.findUnique).toHaveBeenCalledWith({ where: { id: 228 } });
            expect(prisma.admin.delete).not.toHaveBeenCalled();
        });
    });
});